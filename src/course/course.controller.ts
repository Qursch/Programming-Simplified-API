import { Body, Controller, Put, UseGuards, Request, Post, HttpCode, Get } from '@nestjs/common';
import AddCourseDto from 'src/dto/enroll.dto';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
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

	@Post('progress')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async lessonProgress(@Request() req, @Body() lessonProgressDto: LessonProgressDto) {
		await this.courseService.progress(
			req.email, 
			lessonProgressDto.courseId, 
			lessonProgressDto.lessonNumber, 
			lessonProgressDto.progress
		);
	}

	@Get('progress')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getProgress(@Request() req) {
		const user = await this.courseService.findOne_User(req.email);
		const courses = user.courses;

		const lessons: Lesson[] = [];
		courses.forEach(i => lessons.push(...i.lessons));

		
	}
	

	// UNDER NO CIRCUMSTANCES UNCOMMENT THIS METHOD

	// @Put('newCourse')
	// async newCourse(@Body() course: Course) {
	// 	await this.courseService.newCourse(course);
	// }
}
