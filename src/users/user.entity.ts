import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	name: string;

	@Column()
	username: string

	@Column()
	email: string;

	@Column()
	salt: string;

	@Column()
	password: string;

	@Column()
	tier: number;

	@Column()
	courses: Array<Course>

	@Column({ default: false })
	activated: boolean;
}
