import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Course } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

describe('CourseController', () => {
	let controller: CourseController;
	let service: CourseService;
	beforeEach(async () => {
		

		const module: TestingModule = await Test.createTestingModule({
			controllers: [CourseController],
			providers: [
				CourseService,
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
		service = module.get<CourseService>(CourseService);
		controller = module.get<CourseController>(CourseController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getProgress', () => {
		it('should return the non completed lessons', async () => {
			const user = {
				courses: [
					{
						lessons: [
							{
								progress: 0,
								id: 0,
								completed: false
							}
						],
						id: '',
						ref: {
							id: '',
							lessons: 0
						},
						user: { },
						status: 0
					}
				],
			};
	
			jest.spyOn(service, 'findOne_User').mockImplementation(async (..._) => { _; return user; });
	
			expect(await controller.getProgress({
				email: ''
			})).toStrictEqual([{
				progress: 0,
				id: 0,
				completed: false
			}]);
		});
	});
});