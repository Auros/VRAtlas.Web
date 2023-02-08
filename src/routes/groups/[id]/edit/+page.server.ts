import { api, uploadImage } from '$lib';
import type { Group } from '$lib/types';
import type { Actions, PageServerLoad } from "./$types";
import { GroupMemberRole } from "$lib/types";
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params: { id }, fetch }) => {
    const { localUser } = await parent();
    const group = await api.get<Group>(`/groups/${id}`, fetch);
    
    const canEdit = localUser && group.members.some(m => m.user.id === localUser?.id && m.role === GroupMemberRole.Owner || m.role === GroupMemberRole.Manager);
    if (!canEdit) {
        throw error(403, 'You cannot edit this group.');
    }
    
    return {
        group
    }
}

export const actions = {
    default: async ({ cookies, request }) => {
        const token = cookies.get('token') as string;
        const data = await request.formData();

        const id = data.get('id');
        const description = data.get('description') ?? '';
        
        const iconEntry = data.get('icon');
        const bannerEntry = data.get('banner');

        // Checks if the icon and banner entries are filled. If so, uploads the image. If not, uses the previous value.
        const icon = (iconEntry && (iconEntry as Blob).size !== 0) ? await uploadImage(iconEntry as FormDataEntryValue, token) : data.get('current-icon');
        const banner = (bannerEntry && (bannerEntry as Blob).size !== 0) ? await uploadImage(bannerEntry as FormDataEntryValue, token) : data.get('current-banner');

        await api.put<Group>('/groups', fetch, {
            id,
            description,
            icon,
            banner
        }, token);

        return {
            success: true
        }
    }
} satisfies Actions