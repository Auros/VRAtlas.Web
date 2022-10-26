import type { PageServerData } from './$types';

export const load: PageServerData = ({ cookies }) => {
    cookies.set("token", "", {
        httpOnly: true,
        path: '/',
        maxAge: 0
    })
}