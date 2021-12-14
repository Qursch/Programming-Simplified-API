/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Put, UseGuards, Request, Post, HttpCode, Get } from '@nestjs/common';
import EnrollDto from 'src/dto/enroll.dto';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { UsersService } from 'src/users/users.service';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService, private usersService: UsersService) { }

	@Put('enroll')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async enroll(@Request() req, @Body() addCourseDto: EnrollDto) {
		await this.courseService.enroll(req.user.email, addCourseDto);
	}

	@Post('progress')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async lessonProgress(@Request() req, @Body() lessonProgressDto: LessonProgressDto) {
		await this.courseService.progress(
			req.email,
			lessonProgressDto.courseId,
			lessonProgressDto.lessonId + 1,
			lessonProgressDto.progress
		);
	}

	@Get('progress')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getProgress(@Request() req) {
		const user = await this.courseService.findOne_User(req.email);
		const courses = user.courses;

		const lessons: Map<UserCourse, Record<string, any>> = new Map();
		courses.forEach(i => i.lessons.forEach(j => lessons.set(i, j)));

		const notCompleted = courses.filter(course => course.status != 2);
		const nextLessons = new Array<Record<string, any>>();
		notCompleted.forEach(course => nextLessons.push(course.lessons.find(lesson => lesson.progress < 100)));

	}

	// @Put('newCourse')
	// async newCourse(@Body() course: Course) {
	// 	await this.courseService.newCourse(course);
	// }
}
