<script lang="ts">
    import { picture } from '$lib';
    import type { PageData } from './$types';
    import { AtlasMetaTags, Container } from '$lib/components';

    export let data: PageData;

    $: user = data.user;
</script>

<AtlasMetaTags title={user.username} description={`View ${user.username}'s profile.'`} image={picture(user.picture, 'medium')} />

<Container>
    <div class="card card-hover p-4">
        <div class="flex flex-row gap-4">
            <div class="md:basis-1/6 basis-1/4">
                <img src={picture(user.picture, 'large')} alt={`${user.username}'s Avatar'`} class="w-full rounded-2xl" width="128" height="128" />
            </div>
            <div class="flex-grow">
                <h2>{user.username}</h2>
            </div>
        </div>
    </div>
</Container>
