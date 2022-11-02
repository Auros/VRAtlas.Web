import { atlasUrl } from '$lib/env';
import type { Context } from '$lib/types/Context';
import fetcher from '$lib/utilities/fetcher';
import { getTokenConfig } from '$lib/utilities/helpers';
import { invalid, redirect } from '@sveltejs/kit';
import axios from 'axios';
import FormData from 'form-data';
import type { Actions, PageServerData } from './$types';

interface UploadUrl {
    uploadUrl: string
}

interface UploadResponse {
    result : UploadResult
}

interface UploadResult {
    id: string
}

export const load: PageServerData = ({ cookies }) => {
    if (!cookies.get('token'))
        throw new Error("Unauthorized");
}

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const token = cookies.get('token');
        if (!token)
            return invalid(400, { missingAuthorizationCookie: true })

        const data = await request.formData();

        const name = data.get('name');
        const icon = data.get('icon') as File;
        const type = parseInt(data.get('type')?.toString() ?? '0');
        const description = data.get('description');

        const { uploadUrl } = await fetcher<UploadUrl>(atlasUrl('/upload/url'), { }, token)
        
        const array = await icon.arrayBuffer();
        const buffer = Buffer.from(array);
        const iconForm = new FormData();
        iconForm.append('file', buffer)

        const { result: { id: iconImageId }} = (await axios.post<UploadResponse>(uploadUrl, iconForm)).data;
        
        const { data: context } = await axios.post<Context>(atlasUrl('/contexts/create'), {
            name,
            type,
            description,
            iconImageId
        }, getTokenConfig(token))

        throw redirect(303, `/contexts/${context.id}`)
    }
}