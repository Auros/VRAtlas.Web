import { PUBLIC_CDN_URL } from '$env/static/public';

type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

// Converts a media id to a url from our CDN
function picture(id: string, size: ImageSize = 'medium') {
    return `${PUBLIC_CDN_URL}/${id}/${size}`;
}

export { picture };
