import { api } from '$lib';
import type { PageLoad } from './$types';
import { EventStatus, type AtlasEvent, type Group } from '$lib/types';

const getEvents = (id: string, status: EventStatus, fetcher: typeof fetch) => {
    return api.get<{ events: AtlasEvent[] }>(`/events?${new URLSearchParams({ group: id, status: `${status}` })}`, fetcher);
};

export const load: PageLoad = async ({ parent, params: { id }, fetch }) => {
    const { token } = await parent();
    return {
        group: api.get<Group>(`/groups/${id}`, fetch),

        live: getEvents(id, EventStatus.Started, fetch),

        upcoming: getEvents(id, EventStatus.Announced, fetch),

        // Although they're public, don't load unlisted events if the user is not logged in.
        unlisted: token ? getEvents(id, EventStatus.Unlisted, fetch) : null,

        // Although they're public, don't load concluded events if the user is not logged in.
        concluded: token ? getEvents(id, EventStatus.Concluded, fetch) : null
    };
};
