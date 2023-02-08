import { api } from '$lib';
import type { Group } from '$lib/types';
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params: { slug }, fetch }) => {
    return {
        group: api.get<Group>(`/groups/${slug}`, fetch)
    }
}