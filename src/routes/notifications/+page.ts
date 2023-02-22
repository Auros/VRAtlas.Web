import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    const { token } = await parent();
    if (!token) {
        throw error(401, 'Not logged in');
    }
};
