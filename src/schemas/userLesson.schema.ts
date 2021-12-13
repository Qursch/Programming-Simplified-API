import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserCourse } from './userCourse.schema';
import * as mongoose from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema()
export class Lesson {
	@Prop()
		id: number;
	@Prop()
		completed: boolean;
	@Prop()
		progress: number; // 0 -> 1 (perc)
	
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);