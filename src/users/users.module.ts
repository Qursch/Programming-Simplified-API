import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserCourse, UserCourseSchema } from 'src/schemas/userCourse.schema';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema }, 
			{ name: UserCourse.name, schema: UserCourseSchema }
		]
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