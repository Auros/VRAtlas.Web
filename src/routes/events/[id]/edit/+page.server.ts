import { api, uploadImage } from '$lib';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { type AtlasEvent, GroupMemberRole as GMR, EventStatus } from '$lib/types';

export const load = (async ({ parent, params: { id }, fetch }) => {
    const { localUser } = await parent();

    if (!localUser) {
        throw error(401, 'Unauthorized');
    }

    const event = await api.get<AtlasEvent>(`/events/${id}`, fetch);
    const members = event.owner.members;

    const canEdit = members.some((m) => m.user.id === localUser.id && (m.role === GMR.Owner || m.role === GMR.Manager));
    if (!canEdit) {
        throw error(403, 'You cannot edit this event.');
    }

    return {
        event
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ locals, request, fetch, params: { id } }) => {
        const token = locals.token;
        const form = await request.formData();
        const event = await api.get<AtlasEvent>(`/events/${id}`, fetch);

        const start = form.get('event-start') as string;
        const end = form.get('event-end') as string;

        const shouldUpdateStart = !event.startTime || new Date(event.startTime) !== new Date(start);
        const shouldUpdateEnd = !event.endTime || new Date(event.endTime) !== new Date(end);

        // Abomination of a comparison
        if ((event.status === EventStatus.Announced || event.status === EventStatus.Unlisted) && (shouldUpdateStart || shouldUpdateEnd)) {
            await api.put('/events/schedule', fetch, {
                id,
                startTime: shouldUpdateStart ? start : event.startTime,
                endTime: shouldUpdateEnd ? end : event.endTime,
            }, token ?? '')
        }

        const name = form.get('name');
        const tags = form.getAll('tag');
        const starsIds = form.getAll('star-id');
        const starsTitles = form.getAll('star-title');
        const poster = form.get('poster');
        const description = form.get('description');
        
        let media: string | null = null;
        if (poster && (poster as Blob).size !== 0) {
            media = await uploadImage(poster, token ?? '');
        }

        await api.put('/events', fetch, {
            id,
            name,
            description,
            media,
            tags,
            stars: starsIds.map((id, index) => {
                return {
                    star: id,
                    title: starsTitles[index]
                }
            })
        }, token ?? '')

        throw redirect(307, `/events/${id}`);
    }
} satisfies Actions;