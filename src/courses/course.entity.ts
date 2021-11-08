import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	instructors: Array<User>;

	@Column()
	lessons: Array<Lesson>;
}
