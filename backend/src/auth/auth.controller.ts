import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { response } from 'express';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(
        
        @Body() createUserDto: CreateUserDto
    ){
        return this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginDto: LoginDto 
        ) {
        return this.authService.signIn(loginDto);
    }

    @Post('verify')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(@Req() req) {
        const user = req.user;
        return this.authService.refreshTokens(user);
    }       
        
    
}
