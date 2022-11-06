import { writable } from 'svelte/store';
import type { User } from '$lib/types/User';

export const currentUser = writable<User | undefined>(undefined);
