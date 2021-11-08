import { Controller, Get, Request, Post, UseGuards, Body, Put } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/register.dto';

@Controller()
export class AppController {
	constructor(private authService: AuthService) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@Put('register')
	async register(@Body() body: RegisterDto) {
		return 'hi friends'
		return this.authService.register(body);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
