import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CourseService } from 'src/course/course.service';

const options = {
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: 'Token ' + process.env.CODEPOST_API_KEY,
	},
};

@Injectable()
export class CodepostService {
	constructor(private courseService: CourseService) {}

	public async isRegistered(email: string, courseId: string) {
		try {
			const response = await axios.get(
				`https://api.codepost.io/courses/${courseId}/roster`,
				options,
			);
			if (response.data.students.includes(email.toLowerCase())) {
				return true;
			}

			return false;
		} catch (error) {
			console.error(error);
			throw new NotFoundException('Course not found.');
		}
	}

	public async hasSubmitted(email: string, assignmentId: string) {
		try {
			const response = await axios.get(
				`https://api.codepost.io/assignments/${assignmentId}/submissions`,
				options,
			);
			if (
				response.data.some((submission) =>
					submission.students.includes(email.toLowerCase()),
				)
			) {
				return true;
			}
			return false;
		} catch (error) {
			throw new NotFoundException('Assignment not found.');
		}
	}
}
