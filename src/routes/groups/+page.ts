import { api } from '$lib';
import type { Group } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch }) => {
    const { token, localUser } = await parent();
    return {
        groups: api.get<Group[]>(`/groups/user/${localUser?.id}`, fetch, token)
    };
};
