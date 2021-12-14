import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Lesson } from './userLesson.schema';
import { User } from './user.schema';
import { Course } from './course.schema';

export type UserCourseDocument = UserCourse & Document;

@Schema()
export class UserCourse {
	@Prop()
		id: string;
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course'})
		ref: Course;
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'Lesson' })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		lessons: Lesson[];
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
		user: User;
	@Prop()
		status: number; // 0 (not started) | 1 (started, not finished) | 2 (finished)
}

export const UserCourseSchema = SchemaFactory.createForClass(UserCourse);