import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { CodepostService } from 'src/codepost/codepost.service';

@Controller('codepost')
export class CodepostController {
	constructor(private codepostService: CodepostService) {}

	@UseGuards(JwtAuthGuard)
	@Get('registered/:courseId')
	async isRegistered(@Req() req, @Param('courseId') courseId: string) {
		return this.codepostService.isRegistered(req.user.email, courseId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('submitted/:assignmentId')
	async hasSubmitted(@Req() req, @Param('assignmentId') assignmentId: string) {
		return this.codepostService.hasSubmitted(req.user.email, assignmentId);
	}
}
