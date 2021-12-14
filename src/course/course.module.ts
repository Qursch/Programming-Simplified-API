import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserCourse, UserCourseSchema } from 'src/schemas/userCourse.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { UsersService } from 'src/users/users.service';
import { ProgressGateway } from './progress.gateway';
import { Lesson, LessonSchema } from 'src/schemas/userLesson.schema';

@Module({
	imports: [
		CourseModule,
		MongooseModule.forFeature([
<<<<<<< HEAD
			{ name: User.name, schema: UserSchema }, 
			{ name: UserCourse.name, schema: UserCourseSchema }, 
			{ name: Course.name, schema: CourseSchema }, 
			{ name: Lesson.name, schema: LessonSchema }
		]
=======
			{ name: User.name, schema: UserSchema },
			{ name: UserCourse.name, schema: UserCourseSchema },
			{ name: Course.name, schema: CourseSchema },
			{ name: Lesson.name, schema: LessonSchema }]
>>>>>>> 740b5cff56550a6258b80666fd1ad0c01eab9fd2
		),
	],
	providers: [UsersService, CourseService, ProgressGateway],
	exports: [CourseService],
	controllers: [CourseController]
})
export class CourseModule { }