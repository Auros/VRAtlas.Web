<script lang="ts">
    import dayjs from 'dayjs';
    import { EventPoster } from '.';
    import type { AtlasEvent } from '$lib/types';
    import AtlasMarkdown from './AtlasMarkdown.svelte';
    import RelativeTime from 'dayjs/plugin/relativeTime';

    type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

    dayjs.extend(RelativeTime);
    export let event: AtlasEvent;
    export let posterSize: ImageSize = 'large';
</script>

<div class="card card-hover variant-glass-surface hover:overflow-visible overflow-hidden">
    <EventPoster event={event} posterSize={posterSize} />
    <div class="p-4">
        <div class="text-xl text-center"><b>{event.name}</b></div>
        <hr class="!border-t-2 my-4" />
        {#if event.startTime}
            <div class="text-center flex flex-col">
                <span class="text-xl">{dayjs(event.startTime).format('ddd, MMM D').toUpperCase()}</span>
                <span class="text-xl">{dayjs(event.startTime).format('h:mm A')}</span>
            </div>
            <hr class="!border-t-2 my-4" />
        {/if}
        {#if event.description !== ''}
            <p class="max-h-64 overflow-auto">
                <AtlasMarkdown text={event.description} />
            </p>
        {:else}
            <p><i>No information provided.</i></p>
        {/if}
    </div>
</div>
