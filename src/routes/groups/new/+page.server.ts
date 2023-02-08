import { api, uploadImage } from '$lib';
import type { Actions } from './$types';
import type Group from '$lib/types/Group';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies, request }) => {
        const token = cookies.get('token') as string;
        const data = await request.formData();

        const name = data.get('name');
        const description = data.get('description') ?? '';

        const icon = await uploadImage(data.get('icon') as FormDataEntryValue, token);
        const banner = await uploadImage(data.get('banner') as FormDataEntryValue, token);

        const group = await api.post<Group>(
            '/groups',
            fetch,
            {
                name,
                description,
                icon,
                banner
            },
            token
        );

        throw redirect(307, `/groups/${group.id}`);
    }
} satisfies Actions;
