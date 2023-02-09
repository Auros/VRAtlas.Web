import api from './api';
import type User from './types/User';
import { error } from '@sveltejs/kit';
import { GroupMemberRole } from './types';
import { PUBLIC_CDN_URL } from '$env/static/public';

type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

// Converts a media id to a url from our CDN
const picture = (id: string, size: ImageSize = 'medium'): string => {
    return `${PUBLIC_CDN_URL}/${id}/${size}`;
};

const getUserById = async (id: string) => {
    const user = await api.get<User>(`/users/${id}`, fetch);
    return user;
};

const uploadImage = async (blob: FormDataEntryValue, token: string) => {
    const { uploadUrl } = await api.get<{ uploadUrl: string }>('/upload/url', fetch, token);

    const form = new FormData();
    form.append('file', blob);

    const id = uploadUrl.substring(uploadUrl.lastIndexOf('/') + 1);
    const response = await fetch(uploadUrl, {
        method: 'POST',
        body: form
    });

    if (!response.ok) {
        console.log(await response.text());
        throw error(response.status, 'Could not upload image.');
    }

    return id;
};

const nameForRole = (role: GroupMemberRole) => {
    switch (role) {
        case GroupMemberRole.Manager:
            return "Manager";
        case GroupMemberRole.Owner:
            return "Owner";
        case GroupMemberRole.Standard:
            return "Standard";
    }
};

const roleForName = (role: string) => {
    switch (role) {
        case "Manager":
            return GroupMemberRole.Manager;
        case "Owner":
            return GroupMemberRole.Owner;
        case "Standard":
            return GroupMemberRole.Standard;
    }
};

export { picture, getUserById, uploadImage, nameForRole, roleForName };
