import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PrismaService } from 'src/prisma/prisma.service';




@Injectable()
export class AuthService {
    constructor(private userService: UserService,
                private jwtService: JwtService,
                private mailService: MailService,
                private prisma: PrismaService,
    ) {}

    async signIn(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.getUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const payload = { email: user.email , id: user.id };
        return { accessToken: this.jwtService.sign(payload), user };

    }
    

    async register(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
        const existingUser = await this.userService.getUserByEmail(createUserDto.email);
        if(existingUser) {
            throw new BadRequestException('email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userService.createUser({
            email: createUserDto.email,
            name: createUserDto.name,
            password: hashedPassword,
        });

        const code = Math.floor(1000 + Math.random() * 9000).toString();

        await this.userService['prisma'].verificationCode.create({
            data: {
                userId: user.id,
                code,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
               
            },
        });

        await this.mailService.sendVerificationEmail(user.email, code);

        const payload = { id: user.id, email: user.email, name: user.name };
        return { accessToken: this.jwtService.sign(payload)

        };
    }

    async refreshTokens(user: any): Promise<{ accessToken: string }> {
        const payload = { id: user.id, email: user.email, name: user.name };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const { email, code } = verifyEmailDto;

        const user = await this.userService.getUserByEmail(email);

        if(!user) {
            throw new UnauthorizedException('User not found');
        }
        const verificationCode = await this.prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                code,
                used: false,
            },
        });

        if(!verificationCode) {
            throw new UnauthorizedException('Invalid or already used code');
        }

        if(verificationCode.expiresAt < new Date()) {
            throw new UnauthorizedException('Verification code has expired');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        });
        await this.prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true },
        });

        return { message: 'Email verified successfully' };
    }

}
