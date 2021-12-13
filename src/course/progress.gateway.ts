import { Req, UseGuards } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CourseService } from './course.service';

@WebSocketGateway(1025, { transports: ['websocket'] })
export class ProgressGateway {
	constructor(private courseService: CourseService) { }

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage('progress')
	async handleProgress(@Req() req, @MessageBody() data: LessonProgressDto): Promise<string> {
		await this.courseService.progress(
			req.email, 
			data.courseId, 
			data.lessonId, 
			data.progress
		);
		return 'ok';
	}
}