import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const { password, ...result } = user;
        return result;


    
    }

    async register(email: string, name: string, pass: string) {
        const existingUser = await this.userService.getUserByEmail(email);
        if(existingUser) {
            throw new BadRequestException('email already exists');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = await this.userService.createUser({
            email,
            name,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return result;
    }
}
