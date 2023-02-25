import api from '$lib/api';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_OAUTH_URL } from '$env/static/public';

type Tokens = {
    accessToken: string;
    expires_in: number;
};

export const load = (async ({ cookies, url, fetch, locals }) => {
    console.log('Starting login request');
    let challenge = cookies.get('challenge');
    const code = url.searchParams.get('code');
    const authUrl = new URL(PUBLIC_OAUTH_URL);

    // If there's no challenge or there's no code, it means we need to log in the user.
    console.log(challenge);
    if (!challenge || !code) {
        console.log('Challenging user login request.');

        // Setup our auth state and url
        challenge = crypto.randomUUID();

        authUrl.searchParams.set('state', challenge);
        cookies.set('challenge', challenge);

        // Redirect to oauth page
        throw redirect(307, authUrl.toString());
    }

    console.log('Processing challenge and code');

    // If the provided challenge state does not equal the one we generated, throw.
    // (Preventing CSRF Attacks)
    const state = url.searchParams.get('state');
    if (state !== challenge) {
        console.log('Non-matching OAuth challenge detected.');
        throw error(401, 'Non-matching OAuth challenge. Cannot verify authorization state.');
    }

    console.log('Deleting challenge cookie')
    // Delete the challenge cookie as it's no longer necessary
    cookies.delete('challenge');

    // Setup the url for getting our tokens
    const params = new URLSearchParams();
    params.set('redirectUri', authUrl.searchParams.get('redirect_uri') ?? 'MISCONFIGURED_WEBSITE');
    params.set('code', code);

    console.log('Acquiring access token');
    // Fetch the access token response.
    const tokens = await api.get<Tokens>(`/auth/token?${params.toString()}`, fetch);

    console.log('Setting token cookie');
    // Set the token in the cookies and locals
    locals.token = tokens.accessToken;
    cookies.set('token', tokens.accessToken, {
        maxAge: tokens.expires_in,
        path: '/'
    });

    console.log('Successfully logged in user.')
    return {
        token: tokens.accessToken
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async () => {
        // This form exists just to allow the browser to refresh the page in order to update the cookies.
        // I'm not sure why it won't update otherwise.
    }
} satisfies Actions;
