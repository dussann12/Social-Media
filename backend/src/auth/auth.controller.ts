import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(
        @Body('email') email: string,
        @Body('name') name: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(email, name, password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body('email') email: string,
           @Body('password') password: string, 
        ) {
        return this.authService.signIn(email, password);
    }
}
