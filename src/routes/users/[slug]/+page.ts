import { getUserById } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
    const { queryClient } = await parent();
    const userId = params.slug;

    await queryClient.prefetchQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId, fetch)
    });

    return {
        userId
    };
};
