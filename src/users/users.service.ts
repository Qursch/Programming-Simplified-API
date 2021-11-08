import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync } from 'bcrypt'
import { hash } from 'argon2';
import { RegisterDto } from 'src/auth/register.dto';
const saltRounds = 10;
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
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

	async remove(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	async insert(userDto: RegisterDto): Promise<InsertResult> {
		const salt = genSaltSync(saltRounds)
		const password = await hash(userDto.password, {salt: Buffer.from(salt)})
		const user: User = { ...userDto, salt: salt, password: password, tier: 0, courses: [], activated: false };

		return this.usersRepository.insert(user);
	}
}
