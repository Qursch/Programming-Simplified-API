import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync } from 'bcrypt'
import { verify, hash } from 'argon2';
import { RegisterDto } from 'src/auth/register.dto';
import { Token } from './token.entity';
import { v4 } from 'uuid'

const saltRounds = 10;

type FailedRequestReasons = "REQUEST_FAILED"

type LoginUserResult = {
	ok: boolean;
	reason?: "INCORRECT_PASSWORD" | "USER_NOT_FOUND" | FailedRequestReasons;
	user?: User;
}

export type RegisterUserResult = {
	ok: boolean;
	result?: User;
	reason?: "ALREADY_EXISTS" | FailedRequestReasons;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@InjectRepository(Token)
		private tokenRepository: Repository<Token>
	) { }

	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

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



	async verify(username: string, password: string): Promise<LoginUserResult> {
		const user = await this.findOne(username);
		if (!user) return {
			ok: false,
			reason: "USER_NOT_FOUND"
		};

		if (await verify(user.password, password)) {
			return {
				ok: true,
				user: user
			}
		} else {
			return {
				ok: false,
				reason: "INCORRECT_PASSWORD"
			}
		}
	}

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async insert(userDto: RegisterDto): Promise<RegisterUserResult> {
		const salt = genSaltSync(saltRounds)
		const password = await hash(Buffer.from(userDto.password), { salt: Buffer.from(salt) })
		const user: User = { ...userDto, password: password, tier: 0, courses: [], activated: false };
		if (await this.findOne(userDto.username)) return {
			ok: false,
			reason: "ALREADY_EXISTS"
		};
		return {
			ok: true,
			result: await this.usersRepository.save(user)
		}
	}
	
	async findByToken(token: string): Promise<Token | undefined> {

		const thing = (await this.tokenRepository.findOne({
			select: ['user', 'id', 'expiresAt', 'token'],
			relations: ['user'],
			where: {
				token: token
			}
		}))

		console.log(thing)

		return thing;
	}

	async createNewToken(user: User): Promise<Token> {
		const token = new Token();
		token.expiresAt = (BigInt(new Date().getTime()) + BigInt(60 * 60 * 1000)).toString();
		token.token = v4()
		token.user = user

		const res =  await this.tokenRepository.save(token);
		return res
	}

	async getToken(id: number): Promise<Token> {
		return await this.tokenRepository.findOne({
			select: ['expiresAt', 'id', 'token', 'user'],
			where: {
				id
			}
		})
	}

	async activateUser(id: number) {
		const user = await this.usersRepository.findOne(id)
		user.activated = true
		await this.usersRepository.save(user);
	}
}
