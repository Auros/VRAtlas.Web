import { getUserById } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { id } }) => {
    return {
        user: getUserById(id)
    };
};
