import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv'
config();
const { JWT_SECRET_KEY } = process.env

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: JWT_SECRET_KEY,
			signOptions: { expiresIn: '60s' },
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule { }
