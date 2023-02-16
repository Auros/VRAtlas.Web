import { error } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

const api = {
    get: <T>(url: string, fetcher: typeof fetch, token?: string) => request<T>(fetcher, url, undefined, token),
    post: <T>(url: string, fetcher: typeof fetch, body: unknown, token: string) =>
        request<T>(
            fetcher,
            url,
            {
                method: 'POST',
                body: JSON.stringify(body)
            },
            token
        ),
    put: <T>(url: string, fetcher: typeof fetch, body: unknown, token: string) =>
        request<T>(
            fetcher,
            url,
            {
                method: 'PUT',
                body: JSON.stringify(body)
            },
            token
        )
};

async function request<T>(fetcher: typeof fetch, url: string, init?: RequestInit, token?: string) {
    init ??= {};
    const headers: [string, string][] = [];
    if (init.body) {
        headers.push(['Content-Type', 'application/json']);
    }
    if (token) {
        headers.push(['Authorization', `Bearer ${token}`]);
    }
    init.headers = headers;
    const response = await fetcher(`${PUBLIC_API_URL}${url}`, init);
    if (!response.ok) {
        const text = await response.text();
        // TODO: If it's a validation error, include it in the thrown error.
        throw error(response.status, text);
    }
    if (response.status === 204) {
        return { } as T;
    }

    return (await response.json()) as T;
}

export default api;
