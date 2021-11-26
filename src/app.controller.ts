import { Controller, Get, Request, Post, UseGuards, Body, Put, ConflictException, Query, BadRequestException, HttpException, HttpStatus, GoneException, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/register.dto';
import { AddCourseDto } from './users/addCourseDto';
import { UsersService } from './users/users.service';

class AlreadyVerifiedException extends HttpException {
	constructor() {
		super('Already Verified', HttpStatus.FORBIDDEN);
	}
}


@Controller()
export class AppController {
	constructor(private authService: AuthService, private usersService: UsersService) { }

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
	async getProfile(@Request() req) {
		const user = await this.usersService.findOne(req.user.sub);
		if(!user) {
			console.log(req.user);
			throw new InternalServerErrorException();
		}
		delete user.password;
		return user;
	}
	
	//TODO: Implement Notion scraper to get info on course
	@Post('users/addCourse')
	async addCourse(@Body() addCourseDto: AddCourseDto) {
		return await this.usersService.addCourse(addCourseDto);
	}
}
