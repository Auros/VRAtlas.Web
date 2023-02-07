import api from '$lib/api';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_OAUTH_URL } from '$env/static/public';

type Tokens = {
    accessToken: string;
    expires_in: number;
};

export const load = (async ({ cookies, url, fetch }) => {
    let challenge = cookies.get('challenge');
    const code = url.searchParams.get('code');
    const authUrl = new URL(PUBLIC_OAUTH_URL);

    // If there's no challenge or there's no code, it means we need to log in the user.
    if (!challenge || !code) {
        // Setup our auth state and url
        challenge = crypto.randomUUID();

        authUrl.searchParams.set('state', challenge);
        cookies.set('challenge', challenge);

        // Redirect to oauth page
        throw redirect(307, authUrl.toString());
    }

    // If the provided challenge state does not equal the one we generated, throw.
    // (Preventing CSRF Attacks)
    const state = url.searchParams.get('state');
    if (state !== challenge) {
        throw error(401, 'Non-matching OAuth challenge. Cannot verify authorization state.');
    }

    // Delete the challenge cookie as it's no longer necessary
    cookies.delete('challenge');

    // Setup the url for getting our tokens
    const params = new URLSearchParams();
    params.set('redirectUri', authUrl.searchParams.get('redirect_uri') ?? 'MISCONFIGURED_WEBSITE');
    params.set('code', code);

    // Fetch the access token response.
    const tokens = await api.get<Tokens>(`/auth/token?${params.toString()}`, fetch);

    // Set the token in the cookies
    cookies.set('token', tokens.accessToken, {
        maxAge: tokens.expires_in
    });

    throw redirect(307, '/');
}) satisfies PageServerLoad;
