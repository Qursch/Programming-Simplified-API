import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

type ValidateResult = 'ERROR' | Partial<User>

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {}

	async validateUser(username, password): Promise<ValidateResult> {
		const user = await this.usersService.findOne(username);
		if (!user) return 'ERROR';
		if(verify(user.password, password)) {
			const { password, ...res } = user;
			password;
			return res;
		} else {
			return 'ERROR';
		}
	}

	async login(user: { username: string, userId: string }) {
		return {
			bearer: this.jwtService.sign({ username: user.username, sub: user.userId })
		};
	}
}