import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
		id?: number;

	@Column()
		name: string;

	@Column()
		username: string;

	@Column()
		email: string;

	@Column()
		password: string;

	@Column()
		tier: number;

	@OneToMany(() => Course, course => course.user)
		courses: Course[];

	@Column({ default: false })
		activated: boolean;
}
