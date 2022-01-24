import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
import { User } from './user.schema';
import { Lesson } from './userLesson.schema';

export type UserCourseDocument = UserCourse & Document;

@Schema()
export class UserCourse {
	@Prop()
		id: string;	
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course'})
		ref: Course;
	@Prop()
		lessons: Lesson[];
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
		user: Partial<User>;
	@Prop()
		completed: boolean;
	@Prop()
		currentLesson: number; // lesson id
}

export const UserCourseSchema = SchemaFactory.createForClass(UserCourse);