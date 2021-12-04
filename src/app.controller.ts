import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth/jwt.guard';
import { LocalAuthGuard } from './guards/auth/local.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController { }