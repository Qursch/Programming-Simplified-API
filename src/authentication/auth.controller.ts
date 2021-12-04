import { Controller, UseGuards, Post, Request, Body, Put, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/auth/local.guard';
import UserDto from 'src/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService: UsersService) { }

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@Put('register')
	async register(@Body() dto: UserDto) {
		const res = await this.usersService.insert(dto);
		if(res == 'CONFLICT') throw new ConflictException({
			message: 'CONFLICT'
		});
		if(res == 'ERROR') throw new BadRequestException({
			message: 'uh oh'
		});
		return {
			message: res
		};
	}
}
