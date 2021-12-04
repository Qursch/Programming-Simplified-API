import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authentication/auth.module';
import { UsersModule } from './users/users.module';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { SuggestionsController } from './suggestions/suggestions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		AuthModule,
		UsersModule,
		MongooseModule.forRoot('mongodb://localhost/psapi'),
		AuthorizationModule
	], 
	controllers: [AppController, SuggestionsController],
	providers: [
		AppService,
		AuthorizationService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
		  
	],
})
export class AppModule { }
