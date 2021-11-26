export class AddCourseDto {
	notionLink: string;
	courseName: string;
	userId: string;
	lessons: [{ link: string }];
}