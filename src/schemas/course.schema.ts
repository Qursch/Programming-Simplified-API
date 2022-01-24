import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
	@Prop()
		id: string;
	@Prop()
		name: string;
	@Prop()
		lessons: string[]; // lesson names
}

export const CourseSchema = SchemaFactory.createForClass(Course);