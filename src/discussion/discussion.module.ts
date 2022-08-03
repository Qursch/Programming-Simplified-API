import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { UsersService } from 'src/users/users.service';
import { CourseService } from 'src/course/course.service';
import { UserCourse, UserCourseSchema } from 'src/schemas/userCourse.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		DiscussionModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Comment.name, schema: CommentSchema },
			{ name: Course.name, schema: CourseSchema },
			{ name: UserCourse.name, schema: UserCourseSchema },
		]),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '30d' },
		}),
	],
	providers: [UsersService, DiscussionService, CourseService],
	exports: [DiscussionService],
	controllers: [DiscussionController],
})
export class DiscussionModule {}
