<script lang="ts">
    import { api } from "$lib";
    import type { PageData } from "./$types";
    import InfiniteLoading from 'svelte-infinite-loading';
    import { EventStatus, type AtlasEvent } from '$lib/types';
    import type { InfiniteEvent } from 'svelte-infinite-loading';
    import { Container, AtlasMetaTags, EventCard } from "$lib/components";

    let cursor: string | null = null;
    let events: AtlasEvent[] = [];

    export let data: PageData;

    type Query = {
        events: AtlasEvent[],
        next: string | null
    }

    const infiniteHandler = (async ({ detail: { loaded, complete } }: InfiniteEvent) => {
        const url = cursor ? `/events?cursor=${cursor}&size=20&status=${data.status}` : `/events?size=20&status=${data.status}`;
        const query = await api.get<Query>(url, fetch);
        events  = [...events, ...query.events];
        cursor = query.next;
        loaded();
        if (!query.next) {
            complete();
        }
    });

    const getTitle = () => {
        const status = data.status;
        if (status === EventStatus.Announced) {
            return 'Upcoming Events';
        } else if (status === EventStatus.Started) {
            return 'Ongoing Events';
        } else if (status === EventStatus.Concluded) {
            return 'Past Events';
        }
    }

</script>

<AtlasMetaTags title={`Events`} description={`View events on the VR Atlas.`} />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>{getTitle()}</h2>
            </div>
        </div>
    </div>
    <br />
    <div class="grid md:grid-cols-4 grid-cols-2 gap-2">
        {#each events as event}
            <EventCard event={event} />
        {/each}
    </div>
    <br />
    <InfiniteLoading on:infinite={infiniteHandler} />
</Container>