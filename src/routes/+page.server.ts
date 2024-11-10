import type { PageServerLoad } from './$types';
import { NewsApiConnector } from '$lib/connectors/news-api-connector';

export const load: PageServerLoad = async (event) => {
	const newsApiConnector = new NewsApiConnector(event);

	const offset = event.url.searchParams.get('offset') || 0;
	const limit = event.url.searchParams.get('limit') || 20;

	return await newsApiConnector.getNews(+offset, +limit);
};
