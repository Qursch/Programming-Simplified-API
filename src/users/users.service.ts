import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserDto from 'src/dto/user.dto';

import * as argon2 from 'argon2';

export type UserInsertResult = User | 'EXISTS' | 'ERROR'

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async findOne(username: string): Promise<User | undefined> {
		return await this.userModel.findOne(user => user.username == username);
	}

	async insert(dto: UserDto): Promise<UserInsertResult> {
		const user = dto;
		user.password = (await argon2.hash(dto.password)).toString();
		const res = new this.userModel(user as Partial<User>);
		return res.save();
	}
}
