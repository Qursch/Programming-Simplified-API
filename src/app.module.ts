import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { UsersModule } from './users/users.module';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { FeedbackController } from './feedback/feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CourseController } from './course/course.controller';
import { CourseModule } from './course/course.module';
import { SuggestionsController } from './suggestions/suggestions.controller';
import { CourseService } from './course/course.service';
@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		AuthModule,
		UsersModule,
		MongooseModule.forRoot('mongodb://localhost/psapi'),
		AuthorizationModule,
		CourseModule
	],
	controllers: [AppController, FeedbackController, CourseController,  SuggestionsController],
	providers: [
		AppService,
		AuthorizationService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		// CourseService
	],
})
export class AppModule { }
