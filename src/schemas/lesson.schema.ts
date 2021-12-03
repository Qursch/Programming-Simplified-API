import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
import * as mongoose from 'mongoose';

export type LessonDocument = Lesson & Document;

@Schema()
export class Lesson {
	@Prop()
		id: string;
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
		course: Course;
	@Prop()
		completed: boolean;
	@Prop()
		progress: number; // 0 -> 100 (perc)
	
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);