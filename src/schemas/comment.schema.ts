import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';
export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
		user: User;
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
		course: Course;
	@Prop()
		discussionId: string;
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
		replyTo: string;
	@Prop()
		content: string;
	@Prop()
		createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(User);
