import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Course } from 'src/schemas/course.schema';
import { User } from 'src/schemas/user.schema';
import { UserCourse } from 'src/schemas/userCourse.schema';
import { Lesson } from 'src/schemas/userLesson.schema';
import { CourseService } from './course.service';

describe('CourseService', () => {
	let service: CourseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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
			],
		}).compile();

		service = module.get<CourseService>(CourseService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
