import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop()
		username: string;
	@Prop()
		email: string;
	@Prop()
		name: string;
	@Prop()
		password: string;
	@Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]})
		courses: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);