import { ADMIN_IP } from '$env/static/private';
import { ApiConnector } from './api-connector';
import type { RequestEvent } from '@sveltejs/kit';

type UserItem = {
	id: string;
	ip: string;
	username: string;
	lastOnline: string;
	role: string;
};

export class UsersApiConnector extends ApiConnector {
	constructor(event: RequestEvent, isAdmin: boolean = false) {
		super(event);
		this.base_url = `${this.base_url}/users`;
		if (isAdmin) this.userIp = ADMIN_IP;
	}

	async getUsers(offset: number = 0, limit: number = 20) {
		return (await this.sendRequest(`${this.base_url}?offset=${offset}&limit=${limit}`, 'GET'))
			.users as UserItem[];
	}

	async getUserById(id: string) {
		return (await this.sendRequest(`${this.base_url}/${id}`, 'GET')).user as UserItem;
	}
}
