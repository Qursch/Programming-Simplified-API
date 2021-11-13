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
import { Blog } from './blog/blog.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Token } from './users/token.entity';

config();

@Module({
	imports: [AuthModule, UsersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: 'psapi_test',
			entities: [User, Course, Lesson, Blog, Token],
			synchronize: true,
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private connection: Connection) { }
}
