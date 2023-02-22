import { api } from '$lib';
import type { User } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, fetch }) => {
    return {
        // Provide the token to the client, so it can make optimistic data updates after page load.
        token: locals.token,

        // Fetch the local user via token if it exists.
        localUser: locals.token ? api.get<User>('/users/@me', fetch, locals.token) : null,

        streamed: {
            notifQuery: locals.token ? api.get<{ unread: number }>('/notifications', fetch, locals.token) : null
        }
    };
}) satisfies LayoutServerLoad;
