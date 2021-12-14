import { Body, Controller, Put, UseGuards, Request, Post, HttpCode, Get } from '@nestjs/common';
import AddCourseDto from 'src/dto/enroll.dto';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { Course } from 'src/schemas/course.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { UsersService } from 'src/users/users.service';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService, private usersService: UsersService) { }

	@Put('enroll')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async enroll(@Request() req, @Body() addCourseDto: AddCourseDto) {
		await this.courseService.enroll(req.user, addCourseDto);
	}

	@Get('progress')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getProgress(@Request() req) {
		const user = await this.courseService.findOne_User(req.email);
		const courses = user.courses;

		const lessons: Map<UserCourse, Lesson> = new Map();
		courses.forEach(i => i.lessons.forEach(j => lessons.set(i, j)));
	}

	// @Put('newCourse')
	// async newCourse(@Body() course: Course) {
	// 	await this.courseService.newCourse(course);
	// }
}
