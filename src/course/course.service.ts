import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import AddCourseDto from 'src/dto/addCourse.dto';
import { Course, CourseDocument } from 'src/schemas/course.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class CourseService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Course.name) private courseModel: Model<CourseDocument>) { }

	public async addCourse(username: string, dto: AddCourseDto) {
		const old = await this.userModel.findOne({ username: username });
		const course = await this.courseModel.findOne({ id: dto.id });
		old.courses.push(course);
		await old.save();
	}
}
