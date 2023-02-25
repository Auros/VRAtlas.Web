import { redirect } from '@sveltejs/kit';
import { PUBLIC_OAUTH_URL } from '$env/static/public';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    console.log('Starting login process');
    const authUrl = new URL(PUBLIC_OAUTH_URL);

    // Setup our auth state and url
    const challenge = crypto.randomUUID();
    console.log(`Challenging user login request: (${challenge})`);

    authUrl.searchParams.set('state', challenge);
    cookies.set('challenge', challenge, {
        maxAge: 60 * 10, // 10 minutes 
        path: '/'
    });

    // Redirect to oauth page
    throw redirect(307, authUrl.toString());
}) satisfies PageServerLoad;

export const actions = {
    default: async () => {
        // This form exists just to allow the browser to refresh the page in order to update the cookies.
        // I'm not sure why it won't update otherwise.
    }
} satisfies Actions;
