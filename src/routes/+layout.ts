import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data: { token, localUser } }) => {
    return {
        localUser,
        token
    };
};
