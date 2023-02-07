import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';
import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = async ({ data: { token, localUser }, url: { pathname } }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser
            }
        }
    });

    return {
        path: pathname,
        queryClient,
        localUser,
        token
    };
};
