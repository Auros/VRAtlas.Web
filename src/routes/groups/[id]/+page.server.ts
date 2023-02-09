import { api, roleForName } from "$lib";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ cookies, request, fetch }) => {
        const token = cookies.get('token') as string;
        const data = await request.formData();

        const id = data.get('id');
        const userId = data.get('userId');
        const role = roleForName(data.get('role') as string);

        await api.put<unknown>('/groups/members/add', fetch, {
            id,
            userId,
            role
        }, token);
    }
} satisfies Actions