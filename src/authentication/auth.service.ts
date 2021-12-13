import { Injectable, NotFoundException } from '@nestjs/common';
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

	async validateUser(email: string, password: string): Promise<Partial<User> | null> {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) throw new NotFoundException('User not found');
		if (await verify(user.password, password)) {
			return user;
		}
		return null;
	}

	async login(user) {
		const payload = { email: user.email };
		return this.jwtService.sign(payload);
	}
}