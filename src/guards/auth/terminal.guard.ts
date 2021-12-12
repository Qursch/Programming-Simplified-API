import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import prompt from 'prompt';

@Injectable()
export class TerminalGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	async validateRequest(request: any): Promise<boolean> {
		prompt.start();

		console.log(request);

		const { dothing } = await prompt.get(['do the thing? (yes/no)']);

		return dothing == 'yes';
	}
}

