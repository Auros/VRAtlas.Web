import { writable } from 'svelte/store';

export default writable<number | null>(null);