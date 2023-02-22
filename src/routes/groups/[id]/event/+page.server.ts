import { api, uploadImage } from '$lib';
import { GroupMemberRole } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import type { AtlasEvent, Group } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ parent, params: { id }, fetch }) => {
    const { localUser } = await parent();
    const group = await api.get<Group>(`/groups/${id}`, fetch);

    const canEdit =
        localUser && group.members.some((m) => (m.user.id === localUser?.id && m.role === GroupMemberRole.Owner) || m.role === GroupMemberRole.Manager);
    if (!canEdit) {
        throw error(403, 'You cannot create a new event for this group.');
    }

    return {
        group
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ cookies, request }) => {
        const token = cookies.get('token') as string;
        const data = await request.formData();

        const name = data.get('name');
        const group = data.get('group');

        const media = await uploadImage(data.get('poster') as FormDataEntryValue, token);

        const event = await api.post<AtlasEvent>(
            '/events',
            fetch,
            {
                name,
                group,
                media
            },
            token
        );
        throw redirect(307, `/events/${event.id}`);
    }
} satisfies Actions;
