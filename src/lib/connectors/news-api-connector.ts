import { ApiConnector } from "./api-connector";
import type { RequestEvent } from "@sveltejs/kit";

type NewsCreate = {
    title: string;
    content: string;
    image?: string;
    video?: string;
}

type NewsUpdate = NewsCreate & {
    id: string;
    title?: string;
    content?: string;
}

type NewsItem = NewsCreate & {
    id: string;
    likes: number;
    views: number;
    comments: number;
    createdAt: string;
}

type CommentItem = {
    id: string;
    content: string;
    date: string;
    user: string;
}

type NewsItemFull = Omit<NewsItem, 'comments'> & {
    comments: CommentItem[];
    isLiked: boolean;
}

type NewsData = {
    news: NewsItem[];
}

export class NewsApiConnector extends ApiConnector {

    constructor(event: RequestEvent) {
        super(event);
        this.base_url = `${this.base_url}/news`;
    }
    
    async getNews(offset: number = 0, limit: number = 20) {
        return await this.sendRequest(`${this.base_url}?offset=${offset}&limit=${limit}`, 'GET') as NewsData;
    }

    async getNewsById(id: string) {
        return await this.sendRequest(`${this.base_url}/${id}`, 'GET') as { news: NewsItemFull };
    }

    async createNews(news: NewsCreate) {
        return await this.sendRequest(this.base_url, 'POST', news) as { id: string };
    }

    async updateNews(news: NewsUpdate) {
        return await this.sendRequest(this.base_url, 'PUT', news) as { result: boolean };
    }

    async deleteNews(newsId: string) {
        return await this.sendRequest(`${this.base_url}/${newsId}`, 'DELETE') as { result: boolean };
    }

    async likeNews(newsId: string) {
        return await this.sendRequest(`${this.base_url}/${newsId}/like`, 'POST') as { result: boolean };
    }

    async unlikeNews(newsId: string) {
        return await this.sendRequest(`${this.base_url}/${newsId}/unlike`, 'POST') as { result: boolean };
    }

    async createComment(newsId: string, content: string) {
        return await this.sendRequest(`${this.base_url}/${newsId}/comment`, 'POST', {content}) as { result: boolean };
    }

    async deleteComment(newsId: string, commentId: string) {
        return await this.sendRequest(`${this.base_url}/${newsId}/comment/${commentId}`, 'DELETE') as { result: boolean };
    }
}