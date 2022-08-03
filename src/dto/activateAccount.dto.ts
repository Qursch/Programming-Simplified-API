import { IsNotEmpty } from 'class-validator';

export default class ActivateAccountDto {
	@IsNotEmpty()
	token: string;
}
