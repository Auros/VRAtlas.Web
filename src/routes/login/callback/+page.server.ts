import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
    if (!locals.token) {
        return;
    }
    
    const challenge = cookies.get('challenge');
    console.log('Deleting challenge cookie')
    // Delete the challenge cookie as it's no longer necessary
    cookies.set('challenge', '', {
        path: '/' ,
        expires: new Date(0)
    });

    console.log('Setting token cookie');
    cookies.set('token', locals.token, {
        maxAge: 86400,
        path: '/'
    });
    console.log(`Finished user login request: (${challenge})`);
}) satisfies PageServerLoad;

export const actions = {
    default: async () => {
        // This form exists just to allow the browser to refresh the page in order to update the cookies.
        // I'm not sure why it won't update otherwise.
    }
} satisfies Actions;
