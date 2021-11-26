import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
		id?: number;

	@Column()
		name: string;

	@ManyToOne(() => User, user => user.courses)
		user?: User;

	@OneToMany(() => Lesson, lesson => lesson.course)
		lessons: Lesson[];
}
