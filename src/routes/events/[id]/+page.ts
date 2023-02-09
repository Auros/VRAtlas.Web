import { api } from '$lib';
import type { PageLoad } from './$types';
import type { AtlasEvent } from '$lib/types';

export const load: PageLoad = async ({ params: { id }, fetch }) => {
    return {
        event: api.get<AtlasEvent>(`/events/${id}`, fetch),
    };
};