import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentType } from './discussion.controller';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';
import { Course, CourseDocument } from 'src/schemas/course.schema';

@Injectable()
export class DiscussionService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,

		@InjectModel(Comment.name)
		private commentModel: Model<CommentDocument>,

		@InjectModel(Course.name)
		private courseModel: Model<CourseDocument>,
	) {}

	public async getDiscussion(courseId: string, discussionId: string) {
		const comments = await this.commentModel.find({
			courseId,
			discussionId,
		});

		if (comments.length == 0) return 'No comments found';
		return comments;
	}

	public async createComment(userId: string, comment: CommentType) {
		const user = await this.userModel.findOne({ _id: userId });
		if (!user) throw new NotFoundException('User not found');
		const course = await this.courseModel.findOne({ _id: comment.courseId });
		if (!course) throw new NotFoundException('Course not found');
		const newComment = new this.commentModel(comment);
		if (comment.replyTo) {
			const replyTo = await this.commentModel.findOne({ _id: comment.replyTo });
			if (!replyTo) throw new NotFoundException('Comment not found');
			if (replyTo.replyTo) throw new NotFoundException('Not top level comment');
			newComment.replyTo = replyTo.replyTo;
		}
		newComment.user = user;
		newComment.course = course;
		newComment.createdAt = new Date();
		const commentCreated = await newComment.save();
		return commentCreated;
	}
}
