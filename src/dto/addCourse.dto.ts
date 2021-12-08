import { IsNotEmpty } from 'class-validator';

export default class AddCourseDto {
	@IsNotEmpty()
		username: string;
	@IsNotEmpty()
		id: string; 
}