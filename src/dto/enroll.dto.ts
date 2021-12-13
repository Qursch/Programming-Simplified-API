import { IsNotEmpty } from 'class-validator';

export default class EnrollDto {
	@IsNotEmpty()
		username: string;
	@IsNotEmpty()
		id: string; 
}