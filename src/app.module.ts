import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './users/user.entity';
import { config } from 'dotenv';
import { Course } from './courses/course.entity';
import { Lesson } from './courses/lesson.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Token } from './users/token.entity';
import { CoursesService } from './courses/courses.service';
import { CoursesModule } from './courses/courses.module';

config();

@Module({
	imports: [
		AuthModule,
		UsersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: 'psapi_test',
			entities: [User, Course, Lesson, Token],
			synchronize: true,
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		CoursesModule,
	],
	controllers: [AppController],
	providers: [AppService, CoursesService],
})
export class AppModule {
	constructor(private connection: Connection) { }
}
