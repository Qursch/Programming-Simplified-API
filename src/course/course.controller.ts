import { Body, Controller, Put, UseGuards, Request, Post, HttpCode } from '@nestjs/common';
import AddCourseDto from 'src/dto/addCourse.dto';
import LessonProgressDto from 'src/dto/progress.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { Course } from 'src/schemas/course.schema';
import { UsersService } from 'src/users/users.service';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService, private usersService: UsersService) { }

	@Put('add')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async addCourse(@Request() req, @Body() addCourseDto: AddCourseDto) {
		await this.courseService.addCourse(req.user, addCourseDto);
	}

	@Post('progress')
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	async lessonProgress(@Request() req, @Body() lessonProgressDto: LessonProgressDto) {
		await this.courseService.progress(
			req.email, 
			lessonProgressDto.courseName, 
			lessonProgressDto.lessonNumber, 
			lessonProgressDto.progress
		);
	}
	

	// UNDER NO CIRCUMSTANCES UNCOMMENT THIS METHOD

	// @Put('newCourse')
	// async newCourse(@Body() course: Course) {
	// 	await this.courseService.newCourse(course);
	// }
}
