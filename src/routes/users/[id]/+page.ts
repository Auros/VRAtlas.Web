import { api, getUserById } from '$lib';
import type { PageLoad } from './$types';
import { ProfileStatus, type Group } from '$lib/types';

export const load: PageLoad = async ({ parent, params: { id }, fetch }) => {
    const { token, localUser } = await parent();
    const user = await getUserById(id, fetch);
    const shouldLoadProfileMetadata = user.profileStatus === ProfileStatus.Public || user.id === localUser?.id; 
    return {
        user,
        metadata: shouldLoadProfileMetadata ? api.get<{ followers: number, following: number }>(`/users/${id}/profile`, fetch, token) : null,
        followed: shouldLoadProfileMetadata ? api.get<{ groups: Group[], next: string }>(`/users/${id}/profile/groups`, fetch, token) : null
    };
};
