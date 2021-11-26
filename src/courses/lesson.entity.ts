import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Lesson {
	@PrimaryGeneratedColumn()
		id?: number;

	@Column()
		notionLink: string;

	@Column()
		completed: boolean;

	@ManyToOne(() => Course, course => course.lessons)
		course?: Course;
}
