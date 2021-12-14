import { Req, UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CourseService } from './course.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ProgressGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private courseService: CourseService) { }

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@UseGuards(JwtAuthGuard)
	@SubscribeMessage('progress')
	async handleProgress(client: Socket, @MessageBody() data: LessonProgressDto, @Req() req): Promise<WsResponse<string>> {
		console.log(data);
		await this.courseService.progress(
			req?.email,
			data.courseId,
			data.lessonId,
			data.progress
		);
		return { event: 'progress', data: 'ok' };
	}
}