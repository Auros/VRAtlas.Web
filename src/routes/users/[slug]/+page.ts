import { atlasUrl } from '$lib/env';
import type { User } from '$lib/types/user';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
    let userId = params.slug;
    const response = await fetch(atlasUrl(`/users/${userId}`));
    const userJson = await response.json();

    const thisUser = userJson as User;
    return {
        thisUser
    };
};
