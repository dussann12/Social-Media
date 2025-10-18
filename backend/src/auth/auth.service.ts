import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';




@Injectable()
export class AuthService {
    constructor(private userService: UserService,
                private jwtService: JwtService,
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

}
