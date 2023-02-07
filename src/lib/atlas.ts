import { PUBLIC_CDN_URL } from '$env/static/public';
import api from './api';
import type User from './types/User';

type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

// Converts a media id to a url from our CDN
const picture = (id: string, size: ImageSize = 'medium'): string => {
    return `${PUBLIC_CDN_URL}/${id}/${size}`;
};

const getUserById = async (id: string) => {
    const user = await api.get<User>(`/users/${id}`, fetch);
    return user;
};

export { picture, getUserById };
