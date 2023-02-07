import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    // Supply the local user's token into the event locals.
    event.locals.token = event.cookies.get('token');

    // Handle the request.
    return await resolve(event);
}) satisfies Handle;
