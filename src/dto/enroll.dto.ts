import { IsNotEmpty } from 'class-validator';

export default class EnrollDto {
	@IsNotEmpty()
		id: string; 
}