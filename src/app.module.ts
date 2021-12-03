import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Course, CourseSchema } from './schemas/course.schema';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [MongooseModule.forRoot('mongodb://localhost/ps_api'), 
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Course.name, schema: CourseSchema },
			{ name: Lesson.name, schema: LessonSchema }
		]),
		AuthModule
	],
	controllers: [AppController, UsersController, AuthController],
	providers: [AppService, UsersService, AuthService],
})
export class AppModule {}
