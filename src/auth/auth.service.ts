import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './register.dto';
import { verify } from 'argon2';
import { config } from 'dotenv';
import * as sg from '@sendgrid/mail';
import { User } from 'src/users/user.entity';

config();
sg.setApiKey(process.env.SENDGRID_API_KEY);

export type ActivationTokenVerificationResult =
  | 'SUCCESS'
  | 'EXPIRED'
  | 'INVALID'
  | 'ALREADY_VERIFIED';
type UserVerificationResult = 'SUCCESS' | 'USER_NOT_FOUND' | 'INVALID_PASSWORD';
const verifMessage = (_strings: TemplateStringsArray, token: string) => {
	return `Activate your Programming Simplified account by clicking this link:\n https://programmingsimplified.org/dashboard/activate/${token}`;
};

@Injectable()
export class AuthService {
	// The nest.js logger class to use
	private readonly logger: Logger = new Logger(AuthService.name);
	constructor(
    private usersService: UsersService,
    private jwtService: JwtService
	) {}

	/**
   * @method validateUser
   * @param username the username to validate
   * @param pass the password to validate
   * @returns the user object or none
   */
	async validateUser(
		username: string,
		pass: string
	): Promise<[User | null, UserVerificationResult]> {
		const user = await this.usersService.findOne(username);
		if (!user) return [null, 'USER_NOT_FOUND'];
		const res = await verify(user.password, pass);
		return res ? [user, 'SUCCESS'] : [null, 'USER_NOT_FOUND'];
	}

	/**
   * @method login
   * @param user the user object to sign a token with
   * @returns the jwt access token
   */
	async login(user: { username; id }): Promise<{ access_token: string }> {
		const payload = { username: user.username, sub: user.id };

		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	/**
   *
   * @param userDto the registration data transfer object
   * @returns either void or the reason the user was not created
   */
	async register(userDto: RegisterDto): Promise<string | void> {
		const user = await this.usersService.insert(userDto);
		if (!user.ok && user.reason) return user.reason;
		this.logger.log(`REG - User ${user.result.username} registered`);
		const token = await this.usersService.createNewActivationToken(
			await this.usersService.findOne(userDto.username)
		);

		// construct the message to send
		const message = {
			to: user.result.email,
			from: 'verify@programmingsimplified.org',
			subject: 'Verify your Programming Simplified account',
			text: verifMessage`${token}`,
		};

		// send the verification email
		sg.send(message).then(() => {
			this.logger.log(
				`REG - Email sent to ${message.to} | ${user.result.username}`
			);
		});
	}

	/**
   * @method verifyToken verifies an account activation token
   * @param token the activation token to verify
   * @returns the result of the verification
   */
	async verifyActivationToken(
		token: string
	): Promise<ActivationTokenVerificationResult> {
		return this.usersService.activateUser(token);
	}
}
