import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
	@PrimaryGeneratedColumn()
		id: string;

	@Column()
		token: string;

	@Column()
		expiresAt: string;

	@OneToOne(() => User)
	@JoinColumn()
		user: User;
}
