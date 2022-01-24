import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
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
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
