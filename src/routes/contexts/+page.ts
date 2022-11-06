import type { PageLoad } from './$types';
import { fetcher } from '$lib/utilities';
import type { Context } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
    const data = await fetcher<Context[]>('/contexts', undefined, fetch);
    return {
        contexts: data
    }
}