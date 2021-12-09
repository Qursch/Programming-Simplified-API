import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { Lesson, LessonSchema } from 'src/schemas/lesson.schema';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }, 
			{ name: Course.name, schema: CourseSchema }, 
			{ name: Lesson.name, schema: LessonSchema }]
		),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '60s' },
		}),
	],
	providers: [UsersService],
	exports: [UsersService],
	controllers: [UsersController, 
		// ManageController
	],
})
export class UsersModule {}