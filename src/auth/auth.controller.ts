import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/auth/local.guard';

@Controller('auth')
export class AuthController {

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return req.user;
	}
}
