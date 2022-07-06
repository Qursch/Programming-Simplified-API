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
import { CourseModule } from './course/course.module';
import { SuggestionsController } from './suggestions/suggestions.controller';
import { CodepostController } from './codepost/codepost.controller';
import { CodepostService } from './codepost/codepost.service';
import { config } from 'dotenv';
config();
@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 1,
			limit: 5,
		}),
		AuthModule,
		UsersModule,
		MongooseModule.forRoot(process.env.MONGO),
		AuthorizationModule,
		CourseModule
	],
	controllers: [AppController, FeedbackController, SuggestionsController, CodepostController],
	providers: [
		AppService,
		AuthorizationService,
		CodepostService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
	],
})
export class AppModule { }
