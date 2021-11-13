import { Controller, Get, Request, Post, UseGuards, Body, Put, ConflictException, Query, BadRequestException, HttpException, HttpStatus, GoneException } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/register.dto';

class AlreadyVerifiedException extends HttpException {
	constructor() {
		super('Already Verified', HttpStatus.FORBIDDEN);
	}
}


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
		const user = await this.authService.register(body);
		if(user) throw new ConflictException();
		
	}

	@Get('verify')
	async verifyUser(@Query('token') token: string) {
		switch (await this.authService.verifyActivationToken(token)) {
		case 'ALREADY_VERIFIED': 
			throw new AlreadyVerifiedException();
		case 'EXPIRED':
			throw new GoneException();
		case 'INVALID':
			throw new BadRequestException();
		case 'SUCCESS':
			return;
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Get('test')
	te() {
		return 'test lol';
	}
}
