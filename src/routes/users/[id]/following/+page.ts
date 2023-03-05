import { api, getUserById } from "$lib";
import type { User } from "$lib/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params: { id }, fetch }) => {
    const { token } = await parent();
    return {
        user: getUserById(id, fetch),
        following: api.get<{ users: User[], next: string }>(`/users/${id}/profile/following`, fetch, token)
    }
}