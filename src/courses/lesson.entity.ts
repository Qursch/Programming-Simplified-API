import { Blog } from 'src/blog/blog.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Lesson {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	videoUrl: string

	@OneToOne(() => Blog)
	@JoinColumn()
	blog: Blog;
}
