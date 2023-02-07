import { getUserById } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const userId = params.slug;
    return {
        user: getUserById(userId)
    };
};
