import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserCourse, UserCourseSchema } from 'src/schemas/userCourse.schema';
import { Lesson, LessonSchema } from 'src/schemas/userLesson.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { UsersService } from 'src/users/users.service';

@Module({
	imports: [
		CourseModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }, 
			{ name: UserCourse.name, schema: UserCourseSchema }, 
			{ name: Course.name, schema: CourseSchema }, 
			{ name: Lesson.name, schema: LessonSchema }]
		),
	],
	providers: [UsersService, CourseService],
	exports: [CourseService],
	controllers: [CourseController]
})
export class CourseModule { }