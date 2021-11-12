import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './register.dto';
import { verify } from 'argon2';
import { config } from 'dotenv'
import * as sg from '@sendgrid/mail'

config();
sg.setApiKey(process.env.SENDGRID_API_KEY)

type VerificationResult = 'SUCCESS' | 'EXPIRED' | 'INVALID' | 'ALREADY_VERIFIED'

const verifMessage = (_strings: TemplateStringsArray, token: string) => {
	return `Yooo laddy verify your programming simplified account at ${token}`
}

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name)
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) { }

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOne(username);
		if (user && await verify(user.password, pass)) {
			return user;
		}
		return null;
	}

	async login(user: any) {
		const payload = { username: user.username, sub: user.userId };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async register(userDto: RegisterDto): Promise<string | undefined> {
		const user = await this.usersService.insert(userDto);
		if (!user.ok && user.reason) return user.reason;
		this.logger.log(`REG - User ${user.result.username} registered`)
		const token = await this.usersService.createNewToken(await this.usersService.findOne(userDto.username));
		const message = {
			to: user.result.email,
			from: 'verify@programmingsimplified.org',
			subject: 'Verify your Programming Simplified account',
			text: verifMessage`${token.token}`
		}

		await sg.send(message);
		this.logger.log(`REG - Email sent to ${message.to} | ${user.result.username}`)
	}

	async verifyToken(token: string): Promise<VerificationResult> {
		const result = await this.usersService.findByToken(token);
		
		if(!result) return 'INVALID'
		const user = result.user
		if (!user) return 'INVALID';
		if (user.activated) return 'ALREADY_VERIFIED';
		if (BigInt(result.expiresAt) < new Date().getTime()) return 'EXPIRED';
		this.usersService.activateUser(user.id);
		return 'SUCCESS';
	}
}
