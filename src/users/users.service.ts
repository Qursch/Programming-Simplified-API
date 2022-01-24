import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserDto from 'src/dto/user.dto';

import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

	findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	findOneByEmail(email: string): Promise<User | undefined> {
		return this.userModel.findOne({ email: email }).exec();
	}

	async userExists(email: string) {
		const foundOneByEmail = await this.findOneByEmail(email);
		if (foundOneByEmail) return true;
		return false;
	}

	async insert(dto: UserDto): Promise<string> {
		if (await this.userExists(dto.email)) throw new ConflictException('User with this email already exists');
		dto.firstName = dto.firstName.trim();
		dto.lastName = dto.lastName.trim();
		const user = dto;
		user.password = (await argon2.hash(dto.password)).toString();
		const res = new this.userModel(user as Partial<User>);
		await res.save();
		return 'User created successfully';
	}
}
