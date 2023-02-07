import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

const api = {
    get: <T>(url: string, fetcher: typeof fetch, token?: string) => request<T>(fetcher, url, undefined, token),
    post: <TBody extends BodyInit, T>(url: string, fetcher: typeof fetch, body: TBody) =>
        request<T>(fetcher, url, {
            method: 'POST',
            body
        }),
    put: <TBody extends BodyInit, T>(url: string, fetcher: typeof fetch, body: TBody) =>
        request<T>(fetcher, url, {
            method: 'PUT',
            body
        })
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
        // TODO: If it's a validation error, include it in the thrown error.
        throw error(response.status);
    }
    return (await response.json()) as T;
}

export default api;
