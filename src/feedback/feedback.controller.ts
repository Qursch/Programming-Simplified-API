import { BadRequestException, Body, Controller, Logger, Post } from '@nestjs/common';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { Client } from '@notionhq/client';
import { IsArray, IsNotEmpty } from 'class-validator';

const WEBHOOK_URI = 'https://discord.com/api/webhooks/916512548000497764/8nRHdkg5s023Of4x2Zq22z-rwD-O5Zk2V8T4D0aREbszJd9CVBaSfIaTGYOW1jNbg3qY';
export type Suggestion = {
	avatarUrl: string,
	username: string;
} & Record<string, string>;

export class Bug {
	@IsNotEmpty()
		username: string;

	@IsArray()
	@IsNotEmpty()
		type: string[];

	@IsNotEmpty()
		steps: string;

	@IsNotEmpty()
		url: string;

	additional: string;
}

const notion = new Client({
	auth: process.env.NOTION_TOKEN
});

@Controller('feedback')
export class FeedbackController {

	private readonly logger = new Logger(FeedbackController.name);
	// @UseGuards(JwtAuthGuard)
	@Post('suggestion')
	async suggestion(@Body() feedback: Suggestion) {

		const url = feedback.avatarUrl ?? 'https://programmingsimplified.org/logo_primary.png';
		delete feedback.avatarUrl;
		const username = feedback.username ?? '<username not provided>';
		delete feedback.username;

		const keys = Object.keys(feedback);
		const embed = new MessageEmbed()
			.setTitle(`Feedback from ${username}`)
			.addFields(keys.filter(name => {
				if (!feedback[name]) return false;
				return true;

			}).map((name) => ({ name, value: feedback[name] }))
			)
			.setThumbnail(url)
			.setAuthor(
				username,
				url
			);
		axios.post(WEBHOOK_URI, {
			embeds: [
				embed
			]
		});
	}

	// @UseGuards(JwtAuthGuard)
	@Post('bug')
	async bug(@Body() feedback: Bug) {
		/*
		{
			@IsNotEmpty()
				username: string;
			
			@IsNotEmpty()
				type: string;

			@IsNotEmpty()
				steps: string;
			
			@IsNotEmpty()
				url: string;

			@IsNotEmpty()
				additional: string;
		}
		*/
		const username = feedback.username;
		const props = {
			Author: {
				title: [
					{
						text: {
							content: username ?? '<username not provided>',
						}
					}
				]
			},
			steps: {
				rich_text: [
					{
						text: {
							content: feedback.steps
						}
					}
				]
			},
			type: {
				multi_select: feedback.type.map(i => ({ name: i }))
			},
			url: {
				rich_text: [
					{
						text: {
							content: feedback.url
						}
					}
				]
			},
			additional: {
				rich_text: [
					{
						text: {
							content: feedback.additional ?? '-'
						}
					}
				]
			},


		};
		try {
			await notion.pages.create({
				parent: {
					database_id: '0ea6a20bacaf400eb261ac128c109c61'
				},
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				properties: props
			});

			this.logger.log('Created new bug report');
		} catch (e) {
			this.logger.error(e);

			return new BadRequestException('we did an oopsie');
		}

	}
}
