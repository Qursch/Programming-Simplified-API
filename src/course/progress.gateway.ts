import { Req } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from '@nestjs/websockets';
import LessonProgressDto from 'src/dto/progress.dto';
import { CourseService } from './course.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ProgressGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private jwtService: JwtService, private courseService: CourseService) { }

	handleConnection(client: Socket) {
		// client.disconnect();
		console.log(`Client connected: ${client.id}`);
	}
	
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('progress')
	async handleProgress(client: Socket, @MessageBody() data: LessonProgressDto, @Req() req: Socket): Promise<WsResponse<string>> {
		console.log(data);
		const user = this.jwtService.verify(req.handshake.headers.authorization.split(' ')[1]);
		if(!user) throw new WsException('Invalid token');
		await this.courseService.progress(
			user.email,
			data.courseId,
			data.lessonId,
			data.progress
		);
		return { event: 'progress', data: 'ok' };
	}
}