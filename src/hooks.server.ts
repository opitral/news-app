import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.userIp = event.request.headers.get('x-forwarded-for')! || event.request.headers.get('x-real-ip')! || event.getClientAddress();

	return resolve(event);
};