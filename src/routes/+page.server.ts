import type { RequestEvent } from './$types';
import { NewsApiConnector } from '$lib/news-api-connector';

export const load = async (event: RequestEvent) => {
  const ip = event.getClientAddress();

  console.log(ip);
  
	const newsApiConnector = new NewsApiConnector(ip);

	const offset = event.url.searchParams.get('offset') || 0;
	const limit = event.url.searchParams.get('limit') || 20;

	console.log(`offset: ${offset}, limit: ${limit}`);

	const data = await newsApiConnector.getNews(+offset, +limit);

	console.log(data);

	return data;
};
