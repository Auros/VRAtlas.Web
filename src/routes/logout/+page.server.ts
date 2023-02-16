import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    throw redirect(302, '/');
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ cookies }) => {
        cookies.set('token', '', {
            path: '/',
            expires: new Date(0)
        });
    }
} satisfies Actions