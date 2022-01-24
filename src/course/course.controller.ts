/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Put, UseGuards, HttpCode, Get, Post, Req } from '@nestjs/common';
import EnrollDto from 'src/dto/enroll.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { Course } from 'src/schemas/course.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService) { }

	@Put()
	async updateCourse(@Body() course: Course) {
		return this.courseService.updateCourse(course);
	}

	@UseGuards(JwtAuthGuard)
	@Put('enroll')
	@HttpCode(201)
	async enroll(@Req() req, @Body() addCourseDto: EnrollDto) {
		await this.courseService.enroll(req.user.email, addCourseDto);
	}

	@UseGuards(JwtAuthGuard)
	@Put('currentLesson')
	@HttpCode(201)
	async setCurrentLesson(@Req() req, @Body() body) {
		const user = await this.courseService.findOne_User(req.user.email) as UserDocument;
		await this.courseService.setCurrentLesson(user, body.courseId, body.lessonId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('progress')
	async postProgress(@Req() req, @Body() data) {
		await this.courseService.progress(
			req.user.email,
			data.courseId,
			data.lessonId,
			data.progress
		);
	}

	// @UseGuards(JwtAuthGuard)
	// @Get('progress')
	// async getProgress(@Req() req) {
	// 	const user = await this.courseService.findOne_User(req.user.email) as User;
	// 	return this.courseService.getProgress(user);
	// }

	@UseGuards(JwtAuthGuard)
	@Get('/all')
	async getCourses(@Req() req) {
		const user = await this.courseService.findOne_User(req.user.email) as UserDocument;
		return this.courseService.find_UserCourses(user);
	}

	// make sure anything that takes ids in the url is at the end of the controller to not override the other routes
	@UseGuards(JwtAuthGuard)
	@Get('/:id')
	async getCourse(@Req() req) {
		const user = await this.courseService.findOne_User(req.user.email) as UserDocument;
		return this.courseService.findOne_UserCourse(user, req.params['id']);
	}

	@Get('/:id/students')
	async getStudents(@Req() req) {
		return this.courseService.getStudents(req.params['id']);
	}
}
