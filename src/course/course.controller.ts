import { Body, Controller, Put, UseGuards, Request } from '@nestjs/common';
import AddCourseDto from 'src/dto/addCourse.dto';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private courseService: CourseService) { }

	@Put('add')
	@UseGuards(JwtAuthGuard)
	async addCourse(@Request() req, @Body() addCourseDto: AddCourseDto) {
		await this.courseService.addCourse(req.user, addCourseDto);
	}
}
