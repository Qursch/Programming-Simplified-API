import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
	constructor(
    private usersService: UsersService,
    private jwtService: JwtService
	) {}

	async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
		const user = await this.usersService.findOne(username);
		if (user && verify(user.password, pass)) {
			const { password, ...result } = user;
			password;
			return result;
		}
		return null;
	}

	async login(user) {
		const payload = { username: user.username, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}