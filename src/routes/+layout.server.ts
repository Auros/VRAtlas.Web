import type { User } from '$lib/types';
import { fetcher } from '$lib/utilities';
import type { LayoutServerLoad } from './$types';
import { token as tokenStore, currentUser } from '$lib/stores';

export const load: LayoutServerLoad = async ({ fetch, cookies, url: { pathname } }) => {
    let user: User | undefined;
    const token = cookies.get('token');
    tokenStore.set(token);

    if (token) {
        try {
            user = (await fetcher<User>('/users/@me', token, fetch)) ?? undefined;
            currentUser.set(user);
        } catch (e) {
            console.log('An error occured loading the user');
            console.log(e)
        }
    }

    return {
        token,
        path: pathname,
        currentUser: user
    };
};
