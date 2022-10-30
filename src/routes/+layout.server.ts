import { atlasUrl } from '$lib/env';
import { token } from '$lib/stores/token';
import type { User } from '$lib/types/user';
import type { LayoutServerData } from './$types';
import fetcher from '$lib/utilities/fetcher';

export const load: LayoutServerData = async ({ cookies, url: { pathname } }) => {
    const cookieTokenValue = cookies.get('token');
    let user: User | null = null;

    if (cookieTokenValue) {
        token.set(cookieTokenValue)
        const data = await fetcher<User>(atlasUrl('/users/@me'))
        user = data
    }

    return {
        user,
        pathName: pathname,
        token: cookieTokenValue
    }
}