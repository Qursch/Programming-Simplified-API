import { IsJWT, IsNotEmpty, Max, Min } from 'class-validator';


export default class LessonProgressDto {
	@IsNotEmpty()
		courseId: string;
	
	@IsNotEmpty()
	@Min(0)
		lessonId: number;

	@IsNotEmpty()
	@Min(0)
	@Max(1)
		progress: number;

	@IsJWT()
		jwt: string;
}