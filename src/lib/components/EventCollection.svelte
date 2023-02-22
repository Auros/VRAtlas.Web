<script lang="ts">
    import EventCard from './EventCard.svelte';
    import type { AtlasEvent } from '$lib/types';

    export let type: string;
    export let events: AtlasEvent[] | undefined;
    export let more: string | null = null;

</script>

<div class="card p-4 mt-8">
    <header>
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>{type} Events</h2>
            </div>
            {#if more}
                <a href={`/events?status=${more}`} type="button" class="btn variant-ghost-primary">View More</a>
            {/if}
        </div>
    </header>
    <hr class="!border-t-2 my-4" />
    {#if events && events.length}
        <div class="grid lg:grid-cols-6 grid-cols-3 gap-4">
            {#each events as event}
                <EventCard {event} />
            {/each}
        </div>
    {:else}
        <p><i>No Events Found</i></p>
    {/if}
</div>
