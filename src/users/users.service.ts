import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync } from 'bcrypt';
import { verify, hash } from 'argon2';
import { RegisterDto } from 'src/auth/register.dto';
import { Token } from './token.entity';
import { AddCourseDto } from './addCourseDto';

import { JWK, JWE, parse } from 'node-jose';
import { readFileSync } from 'fs';
import { ActivationTokenVerificationResult } from 'src/auth/auth.service';
import { join } from 'path/posix';

const saltRounds = 10;

type FailedRequestReasons = 'REQUEST_FAILED';

type LoginUserResult = {
  ok: boolean;
  reason?: 'INCORRECT_PASSWORD' | 'USER_NOT_FOUND' | FailedRequestReasons;
  user?: User;
};

export type RegisterUserResult = {
  ok: boolean;
  result?: User;
  reason?: 'ALREADY_EXISTS' | FailedRequestReasons;
};

export type JWTActivationToken = {
  userId: number;
  expiresAt: BigInt;
};

@Injectable()
export class UsersService {
	constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>
	) {}

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
					username: identifier,
				},
			});

		case 'number':
			return this.usersRepository.findOne({
				// for some reason it only accepts array literals
				select: ['id', 'email', 'activated', 'name', 'password', 'username'],
				where: {
					id: identifier,
				},
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
		if (!user)
			return {
				ok: false,
				reason: 'USER_NOT_FOUND',
			};
		// The provided password is correct; proceed.
		if (await verify(user.password, password)) {
			return {
				ok: true,
				user: user,
			};
			// Incorrect password
		} else {
			return {
				ok: false,
				reason: 'INCORRECT_PASSWORD',
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
		const password = await hash(Buffer.from(userDto.password), {
			salt: Buffer.from(salt),
		});
		const user: User = {
			...userDto,
			password: password,
			tier: 0,
			courses: [],
			activated: false,
		};
		if (await this.findOne(userDto.username))
			return {
				ok: false,
				reason: 'ALREADY_EXISTS',
			};
		return {
			ok: true,
			result: await this.usersRepository.save(user),
		};
	}

	/**
   * @method findToken finds a token object by the token string
   * @param token the activation token to search for
   * @returns the token object
   */
	async findToken(token: string): Promise<Token | undefined> {
		const thing = await this.tokenRepository.findOne({
			select: ['user', 'id', 'expiresAt', 'token'],
			relations: ['user'],
			where: {
				token: token,
			},
		});
		return thing;
	}

	/**
   * @method createNewActivationToken create an activation token for a user
   * @param user the user to create the token for
   * @returns a promise with the token
   */
	async createNewActivationToken(user: User): Promise<string> {
		return await this.encryptActivationToken(user.id);
	}

	async activateUser(
		token: string
	): Promise<ActivationTokenVerificationResult> {
		const [valid, res, user] = await this.checkActivationToken(token);
		if (!valid) return 'INVALID';
		if (user.activated) return 'ALREADY_VERIFIED';
		user.activated = true;
		await this.usersRepository.save(user);
		return res;
	}

	async addCourse(dto: AddCourseDto) {
		const user = await this.usersRepository.findOne(dto.userId);
		user.courses.push({
			name: dto.courseName,
			lessons: dto.lessons.map((i) => ({
				notionLink: i.link,
				completed: false,
			})),
		});
	}
	private get JWTKeys(): [string, string] {
		return [
			readFileSync(join(__dirname, '../../plain_private.jwt.pem')).toString(),
			readFileSync(join(__dirname, '../../public.jwt.pem')).toString(),
		];
	}

	async encryptActivationToken(
		userId: number,
		format: 'compact' | 'general' | 'flattened' = 'compact',
		contentAlg = 'A256GCM',
		alg = 'RSA-OAEP'
	) {
		const [_publicKey] = this.JWTKeys;
		const publicKey = await JWK.asKey(_publicKey, 'pem');
		const buffer: Buffer = Buffer.from(
			JSON.stringify({
				userId: userId,
				expiresAt: (
					BigInt(new Date().getTime()) + BigInt(60 * 60 * 1000)
				).toString(),
			})
		);
		const encrypted: string = await JWE.createEncrypt(
			{ format: format, contentAlg: contentAlg, fields: { alg: alg } },
			publicKey
		)
			.update(buffer)
			.final();

		return encrypted;
	}

	async checkActivationToken(
		token: string
	): Promise<[boolean, ActivationTokenVerificationResult, User?]> {
		const _privateKey = this.JWTKeys[0];
		const privateKey = await JWK.asKey(_privateKey, 'pem');

		const keystore = JWK.createKeyStore();
		await keystore.add(privateKey);

		const parsed = parse.compact(token);
		let decrypted;
		try {
			decrypted = await parsed.perform(keystore);
		} catch {
			return [false, 'INVALID'];
		}

		const json: {
      userId: number;
      expiresAt: BigInt;
    } = JSON.parse(decrypted.payload.toString());

		const user = await this.findOne(json.userId);

		if (json && json.expiresAt > BigInt(new Date().getTime()) && user) {
			return [true, 'SUCCESS', user];
		}

		if (json.expiresAt <= BigInt(new Date().getTime())) {
			return [false, 'EXPIRED'];
		}

		return [false, 'INVALID'];
	}
}
