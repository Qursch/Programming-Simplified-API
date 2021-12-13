import { IsNotEmpty, Max, Min } from 'class-validator';


export default class LessonProgressDto {
	@IsNotEmpty()
		courseId: string;
	
	@IsNotEmpty()
	@Min(0)
		lessonNumber: number;

	@IsNotEmpty()
	@Min(0)
	@Max(1)
		progress: number;
}