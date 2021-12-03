import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import { Lesson } from './lesson.schema';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
	@Prop()
		id: string;
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
		user: User;
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
		lesson: Lesson;
	@Prop()
		status: number; // 0 (not started) | 1 (started, not finished) | 2 (finished)
}

export const CourseSchema = SchemaFactory.createForClass(Course);