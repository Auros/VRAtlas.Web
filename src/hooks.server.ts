import { api } from '$lib';
import { PUBLIC_OAUTH_URL } from '$env/static/public';
import { error, type Handle, type RequestEvent } from '@sveltejs/kit';

type Tokens = {
    accessToken: string;
    expiresIn: number;
};

export const handle = (async ({ event, resolve }) => {
    const { url } = event;
    // If we're in the auth flow, validate the user here.
    if (url.pathname.includes('login/callback')) {
        await loginUser(event);
    }

    // Supply the local user's token into the event locals.
    event.locals.token = event.cookies.get('token');

    // Handle the request.
    return await resolve(event);

}) satisfies Handle;

const loginUser = async (event: RequestEvent) => {
    const code = event.url.searchParams.get('code');
    const challenge = event.cookies.get('challenge');
    const authUrl = new URL(PUBLIC_OAUTH_URL);

    if (!(code && challenge && challenge !== '')) {
        throw error(401, 'Authentication failed, missing parameters');
    }

    // If the provided challenge state does not equal the one we generated, throw.
    // (Preventing CSRF Attacks)
    const state = event.url.searchParams.get('state');
    if (state !== challenge) {
        console.log('Non-matching OAuth challenge detected.');
        throw error(401, 'Non-matching OAuth challenge. Cannot verify authorization state.');
    }

    // Setup the url for getting our tokens
    const params = new URLSearchParams();
    params.set('redirectUri', authUrl.searchParams.get('redirect_uri') ?? 'MISCONFIGURED_WEBSITE');
    params.set('code', code);

    console.log('Acquiring access token');
    // Fetch the access token response.
    const tokens = await api.get<Tokens>(`/auth/token?${params.toString()}`, fetch);

    console.log('Setting token cookie');
    // Set the token in the cookies and locals
    event.locals.token = tokens.accessToken;
    event.cookies.set('token', tokens.accessToken, {
        maxAge: tokens.expiresIn,
        path: '/'
    });
}