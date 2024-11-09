import {API_BASE_URL} from "$env/static/private";

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

type NewsItemFull = NewsItem & {
    comments: CommentItem[];
}

type NewsData = {
    news: NewsItem[];
}

export class NewsApiConnector {
    private readonly base_url: string;
    private readonly headers: { "X-Client-IP": string, "Content-Type": string; };
    private userIp: string;

    constructor(userIp: string) {
        this.userIp = userIp;
        this.base_url = `${API_BASE_URL}/news`;
        this.headers = {
            'X-Client-IP': userIp,
            'Content-Type': 'application/json'
        }
    }

    async sendRequest(url: string, method: string, body?: any) {
        try {
            const response = await fetch(url, {
                method: method,
                headers: this.headers,
                body: body ? JSON.stringify(body) : undefined
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            return { error: error + '' };
        }
    }

    async getNews(offset: number = 0, limit: number = 20) {
        console.log(this.base_url);
        return await this.sendRequest(`${this.base_url}?offset=${offset}&limit=${limit}`, 'GET') as NewsData;
    }

    async getNewsById(id: string) {
        return await this.sendRequest(`${this.base_url}/${id}`, 'GET') as NewsItemFull;
    }

    async createNews(news: NewsCreate) {
        return await this.sendRequest(this.base_url, 'POST', news) as { id: string };
    }

    async updateNews(news: NewsUpdate) {
        return await this.sendRequest(this.base_url, 'PUT', news) as { result: boolean };
    }

    async deleteNews(id: string) {
        return await this.sendRequest(`${this.base_url}/${id}`, 'DELETE') as { result: boolean };
    }

    async likeNews(id: string) {
        return await this.sendRequest(`${this.base_url}/${id}/like`, 'POST') as { result: boolean };
    }

    async dislikeNews(id: string) {
        return await this.sendRequest(`${this.base_url}/${id}/dislike`, 'POST') as { result: boolean };
    }

    async createComment(content: string) {
        return await this.sendRequest(`${this.base_url}/comment`, 'POST', content) as { id: string };
    }

    async deleteComment(postId: string, commentId: string) {
        return await this.sendRequest(`${this.base_url}/post/${postId}/comment/${commentId}`, 'DELETE') as { result: boolean };
    }
}