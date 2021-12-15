import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let controller: UsersController;
	let service: UsersService;
	const emptyModel = {};
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				{
					provide: getModelToken(User.name),
					useValue: emptyModel
				},
				{
					provide: getModelToken(Course.name),
					useValue: emptyModel
				},
				{
					provide: getModelToken(UserCourse.name),
					useValue: emptyModel
				},
				{
					provide: getModelToken(Lesson.name),
					useValue: emptyModel
				},
			]
		}).compile();

		controller = module.get<UsersController>(UsersController);
		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('profile', () => {
		it('should return a profile', async () => {
			const user: User = {
				courses: [],
				email: '',
				firstName: 'ur',
				lastName: 'mom',
				name: 'ur mom (xd lmao)',
				password: 'very secure'
			};

			jest.spyOn(service, 'findOneByEmail').mockImplementation(async () => user);

			expect(await controller.getProfile({ user: { email: '' } })).toStrictEqual({
				courses: [],
				email: '',
				firstName: 'ur',
				lastName: 'mom',
				name: 'ur mom (xd lmao)',
				password: undefined
			});
			expect(await controller.getProfile({ user: { email: '' } })).not.toStrictEqual({
				courses: [],
				email: '',
				firstName: 'ur',
				lastName: 'mom',
				name: 'ur mom (xd lmao)',
				password: 'very secure'
			});
		}); 
	});
});
