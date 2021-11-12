import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User)
    @JoinTable()
	instructors: User[];

	@ManyToMany(() => Lesson)
    @JoinTable()
	lessons: Lesson[];
}
