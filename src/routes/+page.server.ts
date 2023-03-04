import { api } from '$lib';
import type { AtlasEvent } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    try {
        const { live, upcoming, past } = await api.get<{ live: AtlasEvent[], upcoming: AtlasEvent[], past: AtlasEvent[] }>('/events/summaries', fetch);
        return {
            live,
            upcoming,
            past
        };
    } catch {
        // We don't want the main page to fallback to the error page, so we do nothing here.
        // Realistically the request above will only fail if the user has no internet connection
        // or the API is offline.
    }
}) satisfies PageServerLoad;
