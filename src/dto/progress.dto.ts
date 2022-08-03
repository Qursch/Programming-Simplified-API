import { IsJWT, IsNotEmpty, Max, Min } from 'class-validator';

export default class LessonProgressDto {
	@IsJWT()
	token: string;

	@IsNotEmpty()
	courseId: string;

	@IsNotEmpty()
	@Min(0)
	lessonId: number;

	@IsNotEmpty()
	@Min(0)
	@Max(1)
	progress: number;

	@IsNotEmpty()
	session_start: boolean;
}
