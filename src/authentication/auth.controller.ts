import { Controller, UseGuards, Post, Request, Body, Put, ConflictException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/auth/local.guard';
import UserDto from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

import * as sgMail from '@sendgrid/mail';
console.log(process.env);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Controller('auth')
export class AuthController {
	constructor(private jwtService: JwtService, private authService: AuthService, private usersService: UsersService) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		const token = this.authService.login(req.user);
		if(token) return token;

		throw new NotFoundException();
	}

	@Put('register')
	async register(@Body() dto: UserDto) {
		
		if(await this.usersService.userExists(dto.username, dto.email)) throw new ConflictException({message: 'CONFLICT'});
		const token = await this.jwtService.sign({
			username: dto.username,
			email: dto.email
		});

		const msg = {
			to: dto.email,
			from: 'verify@programmingsimplified.org',
			subject: 'Activate your Programming Simplified account.',
			html: `<a href="programmingsimplified.org/activate/${token} style="padding: 10px; background-color: coral; border-radius: 5px>Activate</a>`
		};

		await sgMail.send(msg);
		return 'SUCCESS';
	}
}
