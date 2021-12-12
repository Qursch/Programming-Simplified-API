import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserCourse, UserCourseSchema } from 'src/schemas/userCourse.schema';
import { Lesson, LessonSchema } from 'src/schemas/userLesson.schema';

@Module({
	imports: [
		CourseModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }, 
			{ name: UserCourse.name, schema: UserCourseSchema }, 
			{ name: Lesson.name, schema: LessonSchema }]
		),
	],
	providers: [CourseService],
	controllers: [CourseController]
})
export class CourseModule { }