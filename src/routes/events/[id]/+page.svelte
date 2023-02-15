<script lang="ts">
    import { picture } from '$lib';
    import type { PageData } from './$types';
    import { GroupMemberRole } from '$lib/types';
    import { AtlasMarkdown, AtlasMetaTags, Container, GroupCard } from '$lib/components';
    import { Avatar } from '@skeletonlabs/skeleton';

    export let data: PageData;

    $: event = data.event;
    $: group = data.event.owner;

    // If the current local user can modify this group. Used to show the Edit button.
    $: canEdit = isOwner || isManager;
    $: isOwner = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Owner);
    $: isManager = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Manager);
    
</script>

<AtlasMetaTags title={event.name} description={`An event hosted by ${group.name}`} />

<Container>
    <div class="flex md:flex-row flex-col gap-4">
        <div class="basis-1/4 flex flex-col gap-4">
            <div class="card overflow-hidden">
                <header style={`background-image: url(${picture(event.media, 'large')})`}>
                    <div class="backdrop-blur-lg">
                        <img src={picture(event.media, 'large')} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                    </div>
                </header>
            </div>
            <div class="card overflow-hidden">
                <GroupCard group={group} />
            </div>
        </div>
        <div class="basis-3/4 md:order-last order-first flex flex-col gap-4">
            <div class="card p-4">
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <h1>{event.name}</h1>
                    </div>
                    {#if canEdit}
                        <a href={`/events/${event.id}/edit`} class="btn variant-ghost-primary">Edit</a>
                    {/if}
                </div>
                <hr class="!border-t-2 my-4" />
                <div class="text-surface-200">
                    {#if event.description !== ''}
                        <AtlasMarkdown text={event.description} />
                    {:else}
                        <p><i>No information provided.</i></p>
                    {/if}
                </div>
            </div>
            <div class="grid lg:grid-cols-4 grid-cols-2 gap-4 md:order-last order-first">
                {#each event.stars.filter(s => s.status === 1) as star}
                    <a href={`/users/${star.user.id}`} class="card card-hover p-2 flex flex-row">
                        <div class="flex-shrink">
                            <Avatar src={picture(star.user.picture)} width="w-14" />
                        </div>
                        <div class="flex-grow px-2">
                            <p><b>{star.user.username}</b></p>
                            <hr />
                            <p class="text-purple-400">{star.title ?? 'Event Star'}</p>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </div>
</Container>