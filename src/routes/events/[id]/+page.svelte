<script lang="ts">
    import dayjs from 'dayjs';
    import { api, picture } from '$lib';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import { modalStore } from '@skeletonlabs/skeleton';
    import RelativeTime from 'dayjs/plugin/relativeTime';
    import { EventStatus, GroupMemberRole } from '$lib/types';
    import { AtlasMarkdown, AtlasMetaTags, Container, FollowButton, GroupCard } from '$lib/components';
    import { Avatar, ProgressRadial, toastStore, type ModalSettings } from '@skeletonlabs/skeleton';

    dayjs.extend(RelativeTime);
    export let data: PageData;
    let performingAction = false;

    $: event = data.event;
    $: group = data.event.owner;

    // If the current local user can modify this group. Used to show the Edit button.
    $: canEdit = isOwner || isManager;
    $: isOwner = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Owner);
    $: isManager = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Manager);

    const confirm = (action: string, body: string, endpoint: string, message: string) => {
        const announcement: ModalSettings = {
            type: 'confirm',
            title: `${action} Event`,
            body: body,
            response: async (confirmed: boolean) => {
                if (!confirmed) {
                    // Do nothing
                    return;
                }
                performingAction = true;
                await api.put<void>(`/events/${endpoint}`, fetch, { id: event.id }, data.token ?? '');
                await invalidateAll();
                performingAction = false;
                toastStore.trigger({
                    message,
                    background: 'success'
                });
            }
        };
        modalStore.trigger(announcement);
    };

    const confirmAnnouncement = () => {
        confirm(
            'Announce',
            `Are you sure you want to announce the event "${event.name}"? This action cannot be undone, and it will notify everyone who follows all relevant topics (event, group, event stars, etc).`,
            'announce',
            'Successfully Announced Event'
        );
    };

    const confirmStart = () => {
        confirm(
            'Start',
            `Are you sure you want to start the event "${event.name}"? This action cannot be undone, and it will notify everyone who follows all relevant topics (event, group, event stars, etc).`,
            'start',
            'Successfully Started Event'
        );
    };

    const confirmConclude = () => {
        confirm('Conclude', `Are you sure you want to conclude the event "${event.name}"?`, 'conclude', 'Successfully Concluded Event');
    };
</script>

<AtlasMetaTags title={event.name} description={`An event hosted by ${group.name}`} />

<Container>
    <div class="flex md:flex-row flex-col gap-4">
        <div class="basis-1/4 flex flex-col gap-4">
            <!-- Event Poster -->
            <div class="card overflow-hidden">
                <header style={`background-image: url(${picture(event.media, 'large')})`}>
                    <div class="backdrop-blur-lg">
                        <img
                            src={picture(event.media, 'large')}
                            alt={`${event.name}'s Poster`}
                            class="select-none object-contain bg-black/50 w-full aspect-[3/4]"
                        />
                    </div>
                </header>
            </div>
            <!-- Group Card -->
            <div class="card overflow-hidden">
                <GroupCard {group} />
            </div>
        </div>
        <div class="basis-3/4 md:order-last order-first flex flex-col gap-4">
            <div class="card p-4">
                <div class="flex flex-row gap-4">
                    <!-- Event Title -->
                    <div class="flex-grow">
                        <h1>{event.name}</h1>
                    </div>
                    <FollowButton id={event.id} type={3} />
                    <!-- Editor Button -->
                    {#if canEdit}
                        {#if event.startTime}
                            <!-- Event start time is required for these actions -->
                            {#if performingAction}
                                <ProgressRadial stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                            {:else}
                                {#if event.status === EventStatus.Unlisted}
                                    <button on:click={confirmAnnouncement} class="btn variant-ghost-warning">Announce</button>
                                {/if}
                                {#if event.status === EventStatus.Announced}
                                    <button on:click={confirmStart} class="btn variant-ghost-warning">Start</button>
                                {/if}
                                {#if event.status === EventStatus.Started}
                                    <button on:click={confirmConclude} class="btn variant-ghost-warning">Conclude</button>
                                {/if}
                            {/if}
                        {/if}
                        <a href={`/events/${event.id}/edit`} class="btn variant-ghost-primary">Edit</a>
                    {/if}
                </div>
                <hr class="!border-t-2 my-4" />
                <!-- Time and Tags -->
                {#if event.startTime || event.tags.length}
                    <div class="flex flex-col gap-2">
                        {#if event.startTime}
                            <div>
                                <div class="text-lg">STARTS <b>@</b> {new Date(event.startTime).toLocaleString()} ({dayjs(event.startTime).fromNow()})</div>
                            </div>
                        {/if}
                        <div class="flex flex-row gap-2">
                            {#each event.tags as tag}
                                <span class="chip variant-filled-surface">{tag}</span>
                            {/each}
                        </div>
                    </div>
                    <hr class="!border-t-2 my-4" />
                {/if}
                <!-- Event Description -->
                <div class="dark:text-surface-200 text-surface-500">
                    {#if event.description !== ''}
                        <AtlasMarkdown text={event.description} />
                    {:else}
                        <p><i>No information provided.</i></p>
                    {/if}
                </div>
            </div>
            <!-- Event Stars -->
            <div class="grid lg:grid-cols-4 grid-cols-2 gap-4 md:order-last order-first">
                {#each event.stars.filter((s) => s.status === 1) as star}
                    <a href={`/users/${star.user.id}`} class="card card-hover p-2 flex flex-row">
                        <div class="flex-shrink">
                            <Avatar src={picture(star.user.picture)} width="w-14" />
                        </div>
                        <div class="flex-grow px-2">
                            <p><b>{star.user.username}</b></p>
                            <hr />
                            <p class="dark:text-purple-400 text-purple-600">{star.title ?? 'Event Star'}</p>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </div>
</Container>
