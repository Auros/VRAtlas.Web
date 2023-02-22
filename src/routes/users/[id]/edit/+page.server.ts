import { api } from "$lib";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { NotificationSettings, User } from "$lib/types";

export const load = (async ({ parent, params: { id }, fetch }) => {
    const { token, localUser } = await parent();
    if (localUser?.id !== id) {
        throw error(403, 'You can only edit your own profile.');
    }

    return {
        user: api.get<User>('/users/@me', fetch, token),
        defaultNotificationSettings: api.get<NotificationSettings>('/notifications/@me', fetch, token)
    }

}) satisfies PageServerLoad

export const actions = {
    default: async ({ cookies, request }) => {
        const token = cookies.get('token') as string;
        const data = await request.formData();

        const biography = data.get('biography');
        const links = data.getAll('link').filter(f => (f as string).startsWith('https://'));

        const atStart = data.get('at-start') === 'on';
        const atThirtyMinutes = data.get('at-thirty-minutes') === 'on';
        const atOneHour = data.get('at-one-hour') === 'on';
        const atOneDay = data.get('at-one-day') === 'on';

        await api.put(
            '/users/@me',
            fetch,
            {
                biography,
                links,
                notifications: {
                    atStart,
                    atThirtyMinutes,
                    atOneHour,
                    atOneDay
                }
            },
            token
        );

        return {
            success: true
        }
    }
} satisfies Actions;