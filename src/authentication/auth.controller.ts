import { Controller, UseGuards, Post, Request, Body, Put, ConflictException, NotFoundException, HttpCode, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/auth/local.guard';
import UserDto from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import emailTemplate from './email.template';
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
	@HttpCode(202)
	async login(@Request() req) {
		const token = await this.authService.login(req.user);
		return {
			token
		};
	}

	@Put('register')
	@HttpCode(201)
	async register(@Body() dto: UserDto) {
		const res = await this.usersService.insert(dto);
		return {
			message: res
		};

		// if(await this.usersService.userExists(dto.username, dto.email)) throw new ConflictException({message: 'CONFLICT'});
		// const token = await this.jwtService.sign({
		// 	username: dto.username,
		// 	email: dto.email
		// });

		// console.log(emailTemplate(token));

		// const msg = {
		// 	to: dto.email,
		// 	from: 'verify@programmingsimplified.org',
		// 	subject: 'Activate your Programming Simplified account.',
		// 	html: emailTemplate(token)
		// };

		// await sgMail.send(msg);
		// return 'Success';
	}
}
