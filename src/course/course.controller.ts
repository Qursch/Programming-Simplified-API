/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Put, UseGuards, Request, HttpCode, Get, Post, Req } from '@nestjs/common';
import EnrollDto from 'src/dto/enroll.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { User } from 'src/schemas/user.schema';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService) { }

	@UseGuards(JwtAuthGuard)
	@Post('progress')
	async postProgress(@Req() req, @Body() data) {
		await this.courseService.progress(
			req.user.email,
			data.courseId,
			data.lessonId-1,
			data.progress
		);
	}

	@Put('enroll')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async enroll(@Request() req, @Body() addCourseDto: EnrollDto) {
		await this.courseService.enroll(req.user.email, addCourseDto);
	}

	@Get('progress')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getProgress(@Request() req) {
		const user = await this.courseService.findOne_User(req.user.email) as User;
		return this.courseService.getProgress(user);
	}

	// @Put('newCourse')
	// async newCourse(@Body() course: Course) {
	// 	await this.courseService.newCourse(course);
	// }
}
