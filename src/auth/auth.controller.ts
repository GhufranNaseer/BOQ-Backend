import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log(`[AUTH] Login attempt for email: ${loginDto.email}`);
        try {
            const result = await this.authService.login(loginDto);
            console.log(`[AUTH] Login successful for: ${loginDto.email}`);
            return result;
        } catch (error) {
            console.error(`[AUTH] Login failed for: ${loginDto.email} - ${error.message}`);
            throw error;
        }
    }

    @Post('register')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser() user: any) {
        return user;
    }
}
