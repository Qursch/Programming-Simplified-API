
import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

const options = {
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': 'Token ' + process.env.CODEPOST_API_KEY,
	},
};

@Injectable()
export class CodepostService {
	public async isRegistered(email: string, courseId: string) {
		try {
			const response = await axios.get(`https://api.codepost.io/courses/${courseId}/roster`, options);
			return response.data.students.some(user => user == email.toLowerCase());
		} catch (error) {
			throw new NotFoundException('Course not found.');
		}
	}
}
