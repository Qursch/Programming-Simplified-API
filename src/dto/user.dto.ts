import { IsEmail, IsNotEmpty } from 'class-validator';
export default class UserDto {
	@IsNotEmpty()
		firstName: string;
	@IsNotEmpty()
		lastName: string;
	@IsNotEmpty()
		password: string;
	@IsNotEmpty()
	@IsEmail()
		email: string;


}