import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { Lesson, LessonSchema } from 'src/schemas/lesson.schema';

@Module({
	imports: [
		CourseModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }, 
			{ name: Course.name, schema: CourseSchema }, 
			{ name: Lesson.name, schema: LessonSchema }]
		),
	],
	providers: [CourseService],
	controllers: [CourseController]
})
export class CourseModule { }