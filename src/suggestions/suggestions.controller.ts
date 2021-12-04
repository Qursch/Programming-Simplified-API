import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt.guard';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { Client } from '@notionhq/client';

const WEBHOOK_URI = 'https://discord.com/api/webhooks/916512548000497764/8nRHdkg5s023Of4x2Zq22z-rwD-O5Zk2V8T4D0aREbszJd9CVBaSfIaTGYOW1jNbg3qY';
export type Feedback = {
    avatarUrl  : string,
    username   : string
} & Record<string, string>;

const notion = new Client({
	auth: process.env.NOTION_TOKEN
});

@Controller('suggestions')
export class SuggestionsController {
	// @UseGuards(JwtAuthGuard)
	@Post('feedback')
	async feedback(@Body() feedback: Feedback) {

		const url = feedback.avatarUrl;
		delete feedback.avatarUrl;
		const username = feedback.username;
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
		// const url = feedback.avatarUrl;
		delete feedback.avatarUrl;
		
		const username = feedback.username;
		delete feedback.username;
		const keys = Object.keys(feedback);

		const props = {
			Author: {
				title: [
					{
						text: {
							content: `Bug Report by ${username ?? '<username not provided>'}`,
						}
					}
				]
			},
		};

		keys.forEach(i => {
			props[i] = {
				rich_text: [
					{
						text: {
							content: feedback[i]
						}
					}
				]
			};
		});

		const res = await notion.pages.create({
			parent: {
				database_id: '0ea6a20bacaf400eb261ac128c109c61'
			},
			properties: props
		});

		console.log(res);
	}
}
