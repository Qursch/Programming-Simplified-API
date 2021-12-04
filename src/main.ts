import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

async function bootstrap() {
	config();
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe());
	// something im using port 8000 for something else don't switch it
	await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
