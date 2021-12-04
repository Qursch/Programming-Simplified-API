import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

const WEBHOOK_URI = 'https://discord.com/api/webhooks/916512548000497764/8nRHdkg5s023Of4x2Zq22z-rwD-O5Zk2V8T4D0aREbszJd9CVBaSfIaTGYOW1jNbg3qY';
export type Feedback = {
    avatarUrl  : string,
    username   : string
} & Record<string, string>;

@Controller('suggestions')
export class SuggestionsController {
	// @UseGuards(JwtAuthGuard)
	@Post('feedback')
	async feedback(@Body() feedback: Feedback) {

		const url = feedback.avatarUrl;
		delete feedback.avatarUrl;
		const username = feedback.avatarUrl;
		delete feedback.username;

		const keys = Object.keys(feedback);
		const embed = new MessageEmbed()
			.setTitle(`Feedback from ${username ?? '<username not provided>'}`)
			.addFields(keys.map(i => {
				const ret =  { name: i, value: feedback[i] };
				return ret;
			}))
			.setThumbnail(url)
			.setAuthor(
				// '厨晚欢貌能', 
				username ?? '<username not provided>',
				url ?? ''
			);
		axios.post(WEBHOOK_URI, {
			embeds: [
				embed
			]
		});
	}

	// @UseGuards(JwtAuthGuard)
	@Post('bug')
	async bug(@Body() feedback: Feedback) {
		const url = feedback.avatarUrl;
		delete feedback.avatarUrl;
		const keys = Object.keys(feedback);
		const embed = new MessageEmbed()
			.setTitle(`Bug Report from ${feedback.username}`)
			.addFields(keys.map(i => {
				const ret =  { name: i, value: feedback[i] };
				return ret;
			}))
			.setThumbnail(url)
			.setAuthor(
				'厨晚欢貌能', 
				url
			);
		axios.post(WEBHOOK_URI, {
			embeds: [
				embed
			]
		});
	}
}
