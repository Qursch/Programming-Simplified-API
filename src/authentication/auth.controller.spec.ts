import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Course } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

describe('AuthController', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secret: process.env.JWT_SECRET,
					signOptions: { expiresIn: '2hr' },
				}),
			],
			controllers: [AuthController],
			providers: [
				AuthService, 
				LocalStrategy, 
				JwtStrategy,
				UsersService,
				{
					provide: getModelToken(User.name),
					useValue: { }
				},
				{
					provide: getModelToken(Course.name),
					useValue: { }
				},
				{
					provide: getModelToken(UserCourse.name),
					useValue: { }
				},
				{
					provide: getModelToken(Lesson.name),
					useValue: { }
				},
			]
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
