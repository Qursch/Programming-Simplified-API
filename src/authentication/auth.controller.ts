import { Controller, UseGuards, Post, Request, Body, Put, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/auth/local.guard';
import UserDto from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { config } from 'dotenv';
config();

import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	async login(@Request() req) {
		const token = await this.authService.login(req.user);
		if (token) return {
			token
		};
	}

	@Put('register')
	@HttpCode(201)
	async register(@Body() dto: UserDto) {
		const message = await this.usersService.insert(dto);
		const token = await this.authService.login({ email: dto.email, password: dto.password });

		return {
			token,
			message
		};
	}

	// @Post('resetpassword')
	// async resetPassword(@Body() body: { email: string; }) {

	// 	if (body.email) {
	// 		let user = await this.usersService.findOneByEmail(body.email);
	// 		if (user) {
	// 			let token = await this.authService.login(user);
	// 			await sgMail.send({ to: user.email, from: 'reset@programmingsimplified.org', subject: 'reset your programming simplified password', text: 'reset your programming simplified password at https://programmingsimplified.org/reset/' + token + '\nignore this message if you did not request it.' });
	// 		}
	// 	}
	// }

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

