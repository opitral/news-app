import type { PageServerLoad } from './$types';
import { NewsApiConnector } from '$lib/connectors/news-api-connector';

export const load: PageServerLoad = async (event) => {
	const newsApiConnector = new NewsApiConnector(event);

	const offset = event.url.searchParams.get('offset') || 0;
	const limit = event.url.searchParams.get('limit') || 20;

	const defaultNews = await newsApiConnector.getNews(+offset, +limit);
	const topNews = await newsApiConnector.getTodayTopNews();

	const topNewsIds = topNews.news.map((n) => n.id);
	
	defaultNews.news = defaultNews.news.filter((n) => !topNewsIds.includes(n.id));

	return {
		news: defaultNews.news,
		topNews: topNews.news
	};
};
