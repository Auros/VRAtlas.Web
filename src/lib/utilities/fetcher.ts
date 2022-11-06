import { atlasApiUrl } from '../env';
import { token as tokenStore } from '$lib/stores/token';

export default async function <T>(
    url: string,
    token?: string,
    fetchFunction?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<T | null> {
    if (!token) {
        tokenStore.subscribe(t => (token = t))();
    }

    let headers: Headers | undefined;
    if (token) {
        headers = new Headers({
            Authorization: `Bearer ${token}`
        });
    }

    if (!fetchFunction) {
        fetchFunction = fetch;
    }
    if (url.startsWith('/')) {
        url = atlasApiUrl + url;
    }

    const response = await fetchFunction(url, {
        headers
    });

    if (response.ok)
        return (await response.json()) as any;
    return null;
}
