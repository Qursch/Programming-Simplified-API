import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync } from 'bcrypt';
import { verify, hash } from 'argon2';
import { RegisterDto } from 'src/auth/register.dto';
import { Token } from './token.entity';
import { v4 } from 'uuid';

const saltRounds = 10;

type FailedRequestReasons = 'REQUEST_FAILED'

type LoginUserResult = {
	ok: boolean;
	reason?: 'INCORRECT_PASSWORD' | 'USER_NOT_FOUND' | FailedRequestReasons;
	user?: User;
}

export type RegisterUserResult = {
	ok: boolean;
	result?: User;
	reason?: 'ALREADY_EXISTS' | FailedRequestReasons;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Token)
		private tokenRepository: Repository<Token>
	) { }

	/**
	 * @method findAll finds all the users in the database
	 * @returns all users in the database
	 */
	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	/**
	 * @method findOne finds a user by their id or username
	 * @param identifier the identifier of the user; number if id, string if username
	 * @returns a promise of the user object
	 */
	findOne(identifier: number | string): Promise<User> {
		switch (typeof identifier) {
		case 'string':
			return this.usersRepository.findOne({
				// for some reason it only accepts array literals 
				select: ['id', 'email', 'activated', 'name', 'password', 'username'],
				where: {
					username: identifier
				}
			});

		case 'number':
			return this.usersRepository.findOne({
				// for some reason it only accepts array literals 
				select: ['id', 'email', 'activated', 'name', 'password', 'username'],
				where: {
					id: identifier
				}
			});
		}
	}


	/**
	 * @method verify verifies a user's username and password
	 * @param username the username of the user to verify
	 * @param password the password to verify
	 * @returns a promise with the result object
	 */
	async verify(username: string, password: string): Promise<LoginUserResult> {
		const user = await this.findOne(username);

		// The user does not exist; return an error.
		if (!user) return {
			ok: false,
			reason: 'USER_NOT_FOUND'
		};
		// The provided password is correct; proceed.
		if (await verify(user.password, password)) {
			return {
				ok: true,
				user: user
			};
			// Incorrect password
		} else {
			return {
				ok: false,
				reason: 'INCORRECT_PASSWORD'
			};
		}
	}

	/**
	 * @method remove removes a user
	 * @param id the id of the user to remove
	 */
	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	/**
	 * @method insert inserts a user object into the database
	 * @param userDto the user data transfer object to insert
	 * @returns a promise with the result of the query
	 */
	async insert(userDto: RegisterDto): Promise<RegisterUserResult> {
		const salt = genSaltSync(saltRounds);
		const password = await hash(Buffer.from(userDto.password), { salt: Buffer.from(salt) });
		const user: User = { ...userDto, password: password, tier: 0, courses: [], activated: false };
		if (await this.findOne(userDto.username)) return {
			ok: false,
			reason: 'ALREADY_EXISTS'
		};
		return {
			ok: true,
			result: await this.usersRepository.save(user)
		};
	}

	/**
	 * @method findToken finds a token object by the token string
	 * @param token the activation token to search for
	 * @returns the token object
	 */
	async findToken(token: string): Promise<Token | undefined> {
		const thing = (await this.tokenRepository.findOne({
			select: ['user', 'id', 'expiresAt', 'token'],
			relations: ['user'],
			where: {
				token: token
			}
		}));
		return thing;
	}

	/**
	 * @method createNewActivationToken create an activation token for a user
	 * @param user the user to create the token for
	 * @returns a promise with the token
	 */
	async createNewActivationToken(user: User): Promise<Token> {
		const token = new Token();
		// set the expires at time to 1 hour from creation (use bigints because limit overflow)
		token.expiresAt = (BigInt(new Date().getTime()) + BigInt(60 * 60 * 1000)).toString();

		// generate a token using uuidv4
		token.token = v4();
		token.user = user;

		const res = await this.tokenRepository.save(token);
		return res;
	}

	async getActivationToken(id: number): Promise<Token> {
		return await this.tokenRepository.findOne({
			select: ['expiresAt', 'id', 'token', 'user'],
			where: {
				id
			}
		});
	}

	async activateUser(id: number) {
		const user = await this.usersRepository.findOne(id);
		user.activated = true;
		await this.usersRepository.save(user);
	}
}
