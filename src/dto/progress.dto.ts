import { IsNotEmpty, Max, Min } from 'class-validator';


export default class LessonProgressDto {
	@IsNotEmpty()
		courseName: string;
	
	@IsNotEmpty()
	@Min(0)
		lessonNumber: number;

	@IsNotEmpty()
	@Min(0)
	@Max(1)
		progress: number;
}