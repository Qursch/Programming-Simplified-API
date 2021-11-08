import { Blog } from 'src/blog/blog.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lesson {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	videoUrl: string

	@Column()
	blog: Blog;
}
