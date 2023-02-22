import type { PageServerLoad } from './$types';
import { type AtlasEvent, EventStatus } from '$lib/types';
import { api } from '$lib';

const getEvents = (status: EventStatus, fetcher: typeof fetch) => {
    return api.get<{ events: AtlasEvent[] }>(`/events?${new URLSearchParams({ size: '6', status: `${status}` })}`, fetcher);
};

export const load = (async ({ fetch, setHeaders }) => {
    try {
        setHeaders({
            'cache-control': 'max-age=60'
        });
        return {
            live: getEvents(EventStatus.Started, fetch),
            upcoming: getEvents(EventStatus.Announced, fetch),
            concluded: getEvents(EventStatus.Concluded, fetch)
        };
    } catch {
        // We don't want the main page to fallback to the error page, so we do nothing here.
        // Realistically the request above will only fail if the user has no internet connection
        // or the API is offline.
    }
}) satisfies PageServerLoad;
