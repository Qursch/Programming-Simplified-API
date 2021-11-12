import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Token])],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule { }
