<script lang="ts">
    import type { PageData } from './$types';
    import type { User } from '$lib/types/user';
    import Box from '$lib/components/layout/Box.svelte';
    import Image from '$lib/components/base/Image.svelte';
    import { currentUser } from '$lib/stores/currentUser';

    export let data: PageData;

    let user: User = data.thisUser;
</script>

<div class="flex flex-row gap-4 md:flex-wrap-0 flex-wrap">
    <Box class="md:w-72 md:grow-0 grow">
        <div class="flex md:flex-col md:justify-center md:items-center gap-4">
            <Image class="md:w-52 md:h-52 w-24 h-24" circle={true} src={user.icon.full} alt={`${user.name}'s Profile Icon`} />
            <p class="text-2xl">{user.name}</p>
        </div>
    </Box>
    <Box class="grow w-96">
        <p>{JSON.stringify($currentUser)}</p>
    </Box>
</div>
