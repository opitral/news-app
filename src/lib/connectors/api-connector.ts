import { API_BASE_URL } from "$env/static/private";
import type { RequestEvent } from "@sveltejs/kit";

export class ApiConnector {
    protected base_url: string;
    protected userIp: string;

    constructor(event: RequestEvent) {
        this.userIp = event.locals.userIp;
        this.base_url = `${API_BASE_URL}`;
    }

    async sendRequest(url: string, method: string, body?: any) {
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'x-forwarded-for': this.userIp,
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : undefined
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            return { error: error + '' };
        }
    }
}