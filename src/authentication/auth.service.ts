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
	) { }

	async validateUser(email: string, pass: string): Promise<Partial<User> | null> {
		const user = await this.usersService.findOneByEmail(email);
		if (user && verify(user.password, pass)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user) {
		console.log(user);
		const payload = { email: user.email, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}