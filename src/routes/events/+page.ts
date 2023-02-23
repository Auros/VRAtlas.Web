import { EventStatus } from '$lib/types';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
    const statusText = url.searchParams.get('status')?.toLowerCase();
    let status = EventStatus.Announced;
    if (statusText === 'started') {
        status = EventStatus.Started;
    } else if (statusText === 'concluded') {
        status = EventStatus.Concluded;
    }

    return {
        status
    };
}) satisfies PageLoad;
