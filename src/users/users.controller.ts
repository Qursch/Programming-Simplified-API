import { Controller, UseGuards, Get, Request, Post, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';

@Controller('users')
export class UsersController {

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
