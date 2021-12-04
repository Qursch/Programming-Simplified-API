import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	config();
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	if(process.env.USE_CSRF == 'true') {
		console.log(process.env.USE_CSRF)
		app.use(cookieParser());
		app.use(csurf({ cookie: true }));
	}
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe());
	// something im using port 8000 for something else don't switch it
	await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
