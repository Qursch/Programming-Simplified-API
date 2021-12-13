import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EnrollDto from 'src/dto/addCourse.dto';
import { Course, CourseDocument } from 'src/schemas/course.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserCourse, UserCourseDocument } from 'src/schemas/userCourse.schema';

@Injectable()
export class CourseService {
	constructor(
		@InjectModel(User.name) 
			private userModel: Model<UserDocument>, 

		@InjectModel(Course.name) 
			private courseModel: Model<CourseDocument>, 

		@InjectModel(UserCourse.name) 
			private userCourseModel: Model<UserCourseDocument>
	) { }

	/* Lookups */
	public async findOne_Course(courseId: string) {
		const course = this.courseModel.findOne({ id: courseId });
		if(!course) throw new NotFoundException('Course not found');
		return course;
	}

	public async findOne_User(email: string) {
		const user = await this.userModel.findOne({ email: email });
		if(!user) throw new NotFoundException('Buy a lottery ticket because you just triggered the fattest race condition known to man');
		return user;
	}

	public async findOne_UserCourse(user: User, courseName: string) {
		const userCourse = this.userCourseModel.findOne({ user: user, name: courseName});
		if(!userCourse) throw new NotFoundException('User Course not found');
		return userCourse;
	}
	
	/* Helpers */
	public async enroll(username: string, dto: EnrollDto) {
		const old = await this.userModel.findOne({ username: username });
		const courseRef = await this.courseModel.findOne({ id: dto.id });

		old.courses.push({
			lessons: new Array(courseRef.lessons).map((_, i) => ({
				id: i,
				completed: false,
				progress: 0
			})),
			name: courseRef.name,
			ref: courseRef,
			status: 0,
			user: old
		});
		await old.save();
	}

	public async progress(
		email: string, 
		courseName: string,  
		lessonNumber: number, 
		progress: number
	) {
		const user = await this.userModel.findOne({email: email});
		if(!user) /* wtf */ throw new InternalServerErrorException('buy a lottery ticket');
		const course = user.courses.find(c => c.name == courseName);
		if(!course) throw new NotFoundException('Course not found');

		// make sure we don't query out of range
		if(course.lessons.length <= lessonNumber || lessonNumber < 0) throw new NotFoundException('Lesson not found');

		// store the lesson etc.
		const lesson = course.lessons[lessonNumber];
		lesson.progress = progress;
		return await user.save();
	}

	public async newCourse(
		course: Course
	) {
		await this.courseModel.insertMany([
			course
		]);
	}
}
