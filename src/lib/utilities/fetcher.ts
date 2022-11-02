import { token } from '$lib/stores/token';
import axios, { type AxiosRequestConfig } from 'axios';

export default async function <T>(url: string, config?: AxiosRequestConfig, overrideToken?: string): Promise<T> {

    let tokenValue: string | null = null;
    token.subscribe(t => tokenValue = t)();
    if (tokenValue || overrideToken) {
        config = { ...config, headers: { Authorization: `Bearer ${overrideToken ?? tokenValue}`}}
    }
    const response = await axios.get<T>(url, config);
    return response.data;
}