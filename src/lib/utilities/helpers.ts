import type { User } from "$lib/types/user";
import type { AxiosRequestConfig } from "axios";

export function hasPermission(user: User | null, permission: string) {
    return !user || user.roles.some(r => r.permissions.includes(permission) || r.permissions.includes('special.administrator'))
}

export function getTokenConfig(token: string): AxiosRequestConfig {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}