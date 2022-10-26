import axios from 'axios';
import { atlasUrl } from '$lib/env';
import type { LayoutServerData } from './$types';
import type { User } from '$lib/types/user';

export const load: LayoutServerData = async ({ cookies }) => {
    const token = cookies.get('token');
    let user: User | null = null;

    if (token) {
        const response = await axios.get<User>(atlasUrl('/users/@me'), {
            headers: { Authorization: `Bearer ${token}`}
        })
        user = response.data;
    }

    return {
        user
    }
}