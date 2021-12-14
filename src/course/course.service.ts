import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EnrollDto from 'src/dto/enroll.dto';
import { Course, CourseDocument } from 'src/schemas/course.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserCourse, UserCourseDocument } from 'src/schemas/userCourse.schema';
import { Lesson, LessonDocument } from 'src/schemas/userLesson.schema';
@Injectable()
export class CourseService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<UserDocument>,

		@InjectModel(Course.name)
		private courseModel: Model<CourseDocument>,

		@InjectModel(UserCourse.name)
		private userCourseModel: Model<UserCourseDocument>,

		@InjectModel(Lesson.name)
		private lessonModel: Model<LessonDocument>
	) { }

	/* Lookups */
	public async findOne_Course(courseId: string) {
		const course = this.courseModel.findOne({ id: courseId });
		if (!course) throw new NotFoundException('Course not found');
		return course;
	}

	public async findOne_User(email: string) {
		const user = await this.userModel.findOne({ email: email });
		if (!user) throw new NotFoundException('Buy a lottery ticket because you just triggered the fattest race condition known to man');
		return user;
	}

	public async findOne_UserCourse(user: User, courseName: string) {
		const userCourse = this.userCourseModel.findOne({ user: user, name: courseName });
		if (!userCourse) throw new NotFoundException('User Course not found');
		return userCourse;
	}

	/* Helpers */
	public async enroll(email: string, dto: EnrollDto) {
		const old = await this.userModel.findOne({ email: email });
		const has = await this.userCourseModel.findOne({
			$and: [
				{
					id: dto.id
				},
				{
					user: old._id
				}
			]
		});
		if(has) throw new ConflictException('User already enrolled');
		const courseRef = await this.courseModel.findOne({ id: dto.id });
		if(!courseRef) throw new NotFoundException('Course not found');

		let lessons = new Array(courseRef.lessons).fill({});

		lessons = lessons.map((_, i) => ({
			id: i,
			completed: false,
			progress: 0
		}
		));

		const lessonsRes = await this.lessonModel.insertMany(lessons);

		
		const inserted = await this.userCourseModel.insertMany([{
			lessons: lessonsRes.map(l => l._id),
			id: courseRef.id,
			ref: courseRef._id,
			status: 0,
			user: old._id
		}]);

		console.log(inserted[0].lessons);


		old.courses.push(inserted[0]._id);
		await old.save();
	}

	public async progress(
		email: string,
		courseId: string,
		lessonId: number,
		progress: number
	) {
		const user = await this.userModel.findOne({ email });
		if (!user) /* wtf */ throw new InternalServerErrorException('buy a lottery ticket');
		const course = user.courses.find(c => c.ref.id == courseId);
		if (!course) throw new NotFoundException('Course not found');

		// make sure we don't query out of range
		if (course.lessons.length <= lessonId || lessonId < 0) throw new NotFoundException('Lesson not found');

		// store the lesson etc.
		const lesson = course.lessons[lessonId];
		lesson.progress = progress;
		return user.save();
	}

	public async newCourse(
		course: Course
	) {
		await this.courseModel.insertMany([
			course
		]);
	}
}
