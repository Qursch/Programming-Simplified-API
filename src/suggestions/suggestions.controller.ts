import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';

const WEBHOOK_URI = 'https://discord.com/api/webhooks/916512548000497764/8nRHdkg5s023Of4x2Zq22z-rwD-O5Zk2V8T4D0aREbszJd9CVBaSfIaTGYOW1jNbg3qY';
export type Feedback = Partial<{
    referral   : string,
    courses    : string,
    lessons    : string,
    instructors: string,
    feedback   : string,
    else       : string,
    avatarUrl  : string,
    username   : string
}>;

@Controller('suggestions')
export class SuggestionsController {
	// @UseGuards(JwtAuthGuard)
	@Post('feedback')
	async feedback(@Body() feedback: Feedback) {
		const keys = Object.keys(feedback);
		const embed = new MessageEmbed()
			.setTitle(`Feedback from ${feedback.username}`)
			.addFields(keys.map(i => {
				const ret =  { name: i, value: feedback[i] };
				return ret;
			}))
			.setThumbnail(feedback.avatarUrl)
			.setAuthor(
				'厨晚欢貌能', 
				'https://s.abcnews.com/images/US/todd-barrick-jr-ht-jef-190910_hpMain_16x9_992.jpg'
			);
		axios.post(WEBHOOK_URI, {
			embeds: [
				embed
			]
		});
	}
}
