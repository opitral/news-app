import type { PageServerLoad, Actions } from './$types';
import { NewsApiConnector } from '$lib/connectors/news-api-connector';
import { UsersApiConnector } from '$lib/connectors/users-api-connector';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const newsApiConnector = new NewsApiConnector(event);
	const userApiConnector = new UsersApiConnector(event, true);

	const data = (await newsApiConnector.getNewsById(event.params.id)).news;

	// console.log(data);

	return {
		...data,
		comments: await Promise.all(
			data.comments.map(async (comment) => {
				return {
					...comment,
					user: await userApiConnector.getUserById(comment.user)
				};
			})
		)
	};
};

export const actions = {
	async submit_comment(event) {
		const formData = await event.request.formData();
		const comment = formData.get('comment') as string;

		const newsApiConnector = new NewsApiConnector(event);
		const { result } = await newsApiConnector.createComment(event.params.id, comment);

		if (!result) {
			return fail(400);
		}

		return {};
	},

	async like(event) {
		const formData = await event.request.formData();
		const isLiked = formData.get('isLiked') == 'true';

		const newsApiConnector = new NewsApiConnector(event);

		if (isLiked) {
			const { result } = await newsApiConnector.unlikeNews(event.params.id);
			if (!result) return fail(400);
		} else {
			const { result } = await newsApiConnector.likeNews(event.params.id);
			if (!result) return fail(400);
		}

		return {};
	}
} satisfies Actions;
