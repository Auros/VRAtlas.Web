import axios from 'axios';
import { atlasUrl } from '$lib/env';
import { redirect } from '@sveltejs/kit';
import type { PageServerData } from './$types';

export const load: PageServerData = async ({ url, cookies }) => {

    if (url.searchParams.get('from-redirect'))
        return;

    const code = url.searchParams.get('code');
    
    // If there's no code and there's no token provided, redirect to the backend auth page
    if (!code) {
        throw redirect(307, atlasUrl('/auth/discord'))
    }

    try {
        if (code) {
            // Get the token from the provided code
            const response = await axios.post(atlasUrl('/auth/token'), {
                code
            });
            // Add the token to the cookies
            cookies.set('token', response.data.token, {
                maxAge: 3 * 60 * 60
            })
        }
    } catch (e) {
        console.log(e)
        // Auth failure
    }

    // If the code is in the url, redirect the page to the non-query page
    // This also acts to refresh the page so the query gets properly applied
    if (code)
        throw redirect(307, '/login?from-redirect=true')

    
};
