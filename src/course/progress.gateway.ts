import { Req, UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsException, WsResponse } from '@nestjs/websockets';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CourseService } from './course.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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
		const user = this.jwtService.decode(req.handshake.headers.authorization.split(' ')[1]) as Record<string, any>;
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