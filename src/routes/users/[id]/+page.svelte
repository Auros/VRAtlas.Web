<script lang="ts">
    import { picture } from '$lib';
    import type { PageData } from './$types';
    import { Link } from '@steeze-ui/heroicons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { AtlasMetaTags, Container, FollowButton } from '$lib/components';
    import { Github, Soundcloud, Bandcamp, Twitter, Spotify, Youtube, Twitch } from '@steeze-ui/simple-icons';

    export let data: PageData;

    $: user = data.user;
</script>

<AtlasMetaTags title={user.username} description={user.biography ?? `View ${user.username}'s profile.`} image={picture(user.picture, 'medium')} />

<Container>
    <div class="card card-hover p-4">
        <div class="flex flex-row gap-4">
            <div class="md:basis-1/6 basis-1/4">
                <img src={picture(user.picture, 'large')} alt={`${user.username}'s Avatar'`} class="w-full rounded-2xl" width="128" height="128" />
            </div>
            <div class="flex-grow flex flex-col gap-2">
                <div class="flex-grow">
                    <div class="flex flex-row gap-2">
                        <h2 class="flex-grow">{user.username}</h2>
                        {#if user.id === data.localUser?.id}
                            <a href={`/users/${user.id}/edit`} class="btn variant-ghost-primary">Edit Profile</a>
                        {:else}
                            <FollowButton id={user.id} type={1} />
                        {/if}
                    </div>
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
</Container>
