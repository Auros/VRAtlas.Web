import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    cookies.delete('token'); // Deletes the cookie. After navigation we force a page reload.
}) satisfies PageServerLoad;
