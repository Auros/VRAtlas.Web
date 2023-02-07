<script lang="ts">
    import type { PageData } from './$types';
    import { AtlasMetaTags, Container } from '$lib/components';
    import { createQuery } from '@tanstack/svelte-query';
    import { type User, getUserById, picture } from '$lib';

    export let data: PageData;

    const user = createQuery<User, Error>({
        queryKey: ['user', data.userId],
        queryFn: () => getUserById(data.userId, fetch),
        refetchOnWindowFocus: 'always'
    });
</script>

{#if $user.data}
    <AtlasMetaTags title={$user.data.username} description={`View ${$user.data.username}'s profile.'`} image={picture($user.data.picture, 'medium')} />
{:else}
    <AtlasMetaTags title="Not Found" description="User does not exist." />
{/if}

<Container>
    {#if $user.data}
        <div class="card card-hover p-4">
            <div class="flex flex-row gap-4">
                <div class="md:basis-1/6 basis-1/4">
                    <img
                        src={picture($user.data.picture, 'large')}
                        alt={`${$user.data.username}'s Avatar'`}
                        class="w-full rounded-2xl"
                        width="128"
                        height="128"
                    />
                </div>
                <div class="flex-grow">
                    <h2>{$user.data.username}</h2>
                </div>
            </div>
        </div>
    {/if}
</Container>
