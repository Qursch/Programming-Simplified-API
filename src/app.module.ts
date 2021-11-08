import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from "./users/user.entity";

@Module({
	imports: [AuthModule, UsersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'root',
			database: 'test',
			entities: [User],
			synchronize: true,
		}),],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private connection: Connection) { }
}
