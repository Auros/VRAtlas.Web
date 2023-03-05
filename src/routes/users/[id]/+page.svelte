<script lang="ts">
    import { api, picture } from '$lib';
    import type { Group } from '$lib/types';
    import type { PageData } from './$types';
    import { Link } from '@steeze-ui/heroicons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import InfiniteLoading, { type InfiniteEvent } from 'svelte-infinite-loading';
    import { AtlasMetaTags, Container, FollowButton, GroupCard } from '$lib/components';
    import { Github, Soundcloud, Bandcamp, Twitter, Spotify, Youtube, Twitch } from '@steeze-ui/simple-icons';

    export let data: PageData;

    let groups: Group[] = data.followed?.groups ?? [];
    let cursor: string | undefined = data.followed?.next;
    
    $: user = data.user;
    $: metadata = data.metadata;
    
    const infiniteHandler = async ({ detail: { loaded, complete } }: InfiniteEvent) => {
        const token = data.token;
        if (!token || !cursor) {
            complete();
            return;
        }

        const url = `/users/${data.user.id}/profile/groups?cursor=${cursor}`;
        const query = await api.get<{ groups: Group[], next: string }>(url, fetch, token);
        groups = [...groups, ...query.groups];
        cursor = query.next;
        loaded();
        if (!query.next) {
            complete();
            cursor = undefined;
        }
    };
</script>

<AtlasMetaTags title={user.username} description={user.biography ?? `View ${user.username}'s profile.`} image={picture(user.picture, 'medium')} />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="md:basis-1/6 basis-1/4">
                <img src={picture(user.picture, 'large')} alt={`${user.username}'s Avatar'`} class="w-full rounded-2xl" width="128" height="128" />
            </div>
            <div class="flex-grow flex flex-col gap-2">
                <div class="flex-grow">
                    <div class="flex flex-row gap-2">
                        <div class="text-3xl flex-grow">{user.username}</div>
                        {#if user.id === data.localUser?.id}
                            <a href={`/users/${user.id}/edit`} class="btn variant-ghost-primary">Edit Profile</a>
                        {:else}
                            <FollowButton id={user.id} type={1} />
                        {/if}
                    </div>
                    {#if metadata}
                        <div class="text-sm flex flex-row gap-4">
                            <a href={`/users/${user.id}/following`}><b>{metadata.following}</b> Following</a>
                            <a href={`/users/${user.id}/followers`}><b>{metadata.followers}</b> Followers</a>
                        </div>
                    {/if}
                    {#if user.biography}
                        <p>{user.biography}</p>
                    {:else}
                        <p><i>No Bio Provided</i></p>
                    {/if}
                </div>
                <div class="flex flex-wrap gap-2">
                    {#each data.user.links as link}
                        <a href={link} target="_blank" rel="noreferrer">
                            {#if link.includes('github.com')}
                                <Icon src={Github} class="w-8 h-8 text-[#e4e4e4]" />
                            {:else if link.includes('soundcloud.com')}
                                <Icon src={Soundcloud} class="w-8 h-8 text-[#FF3300]" />
                            {:else if link.includes('bandcamp.com')}
                                <Icon src={Bandcamp} class="w-8 h-8 text-[#408294]" />
                            {:else if link.includes('twitter.com')}
                                <Icon src={Twitter} class="w-8 h-8 text-[#1DA1F2]" />
                            {:else if link.includes('spotify.com')}
                                <Icon src={Spotify} class="w-8 h-8 text-[#1DB954]" />
                            {:else if link.includes('youtube.com')}
                                <Icon src={Youtube} class="w-8 h-8 text-[#FF0000]" />
                            {:else if link.includes('twitch.tv')}
                                <Icon src={Twitch} class="w-8 h-8 text-[#9146FF]" />
                            {:else}
                                <Icon src={Link} class="w-8 h-8" />
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <br />
    {#if groups.length}
        <div class="card p-4">
            <div class="flex flex-row gap-4">
                <div class="flex-grow">
                    <div class="text-3xl">Followed Groups</div>
                </div>
            </div>
            <hr class="!border-t-2 my-4" />
            <div class="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
                {#each groups as group}
                    <GroupCard {group} />
                {/each}
            </div>
        </div>
        {#if cursor}
            <br />
            <InfiniteLoading on:infinite={infiniteHandler} />
        {/if}
    {/if}
</Container>
