import { api } from '$lib';
import { redirect } from '@sveltejs/kit';
import type { AtlasEvent } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ parent, params: { id }, fetch }) => {
    const { localUser } = await parent();
    if (!localUser) {
        throw redirect(307, `/events/${id}`);
    }

    const event = await api.get<AtlasEvent>(`/events/${id}`, fetch);
    const stars = event.stars;

    const hasPendingInvite = stars.some((s) => s.user.id === localUser.id && s.status === 0);
    if (!hasPendingInvite) {
        throw redirect(307, `/events/${id}`);
    }

    return {
        event
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ locals, request, fetch, params: { id } }) => {
        const token = locals.token;
        const form = await request.formData();

        const accept = form.get('accept') !== null;
        await api.put<unknown>(`/events/invite/${accept ? 'accept' : 'reject'}`, fetch, { id }, token ?? '');

        return {
            success: true
        };
    }
} satisfies Actions;
