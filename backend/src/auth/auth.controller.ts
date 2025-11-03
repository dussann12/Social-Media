import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException, UseGuards, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @HttpCode(HttpStatus.CREATED)
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
    async refresh(@CurrentUser() user: any) {
        
        return this.authService.refreshTokens(user);
    }       

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return user;
    }

        
    
}
