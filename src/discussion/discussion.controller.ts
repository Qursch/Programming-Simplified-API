import { Controller, UseGuards, Get, Post, Req, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { DiscussionService } from 'src/discussion/discussion.service';
import { IsNotEmpty } from 'class-validator';


export class Comment {
	@IsNotEmpty()
		courseId: string;

	@IsNotEmpty()
		discussionId: string;

	@IsNotEmpty()
		content: string;

	replyTo?: string;
}

@Controller('discussion')
export class DiscussionController {
	constructor(private discussionService: DiscussionService) {}

	@UseGuards(JwtAuthGuard)
	@Get('discussion/:courseId/:discussionId')
	async getDiscussion(@Param('courseId') courseId: string, @Param('discussionId') discussionId: string) {
		return this.discussionService.getDiscussion(courseId, discussionId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('comment')
	async createComment(@Req() req, @Body() comment: Comment) {
		return this.discussionService.createComment(req.user, comment);
	}
}
