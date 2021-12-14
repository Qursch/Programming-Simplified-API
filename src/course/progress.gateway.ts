import { Req, UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CourseService } from './course.service';
import { Socket } from 'socket.io';

<<<<<<< HEAD
@WebSocketGateway(1025, { transports: ['websocket'] })
export class ProgressGateway {
	constructor(private courseService: CourseService) {
	}
=======
@WebSocketGateway({ cors: true })
export class ProgressGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private courseService: CourseService) { }
>>>>>>> 740b5cff56550a6258b80666fd1ad0c01eab9fd2

	handleConnection(client: Socket) {
		// client.disconnect();
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
<<<<<<< HEAD
			req.email, 
			data.courseId, 
			data.lessonId, 
=======
			req?.email,
			data.courseId,
			data.lessonId,
>>>>>>> 740b5cff56550a6258b80666fd1ad0c01eab9fd2
			data.progress
		);
		return { event: 'progress', data: 'ok' };
	}
}