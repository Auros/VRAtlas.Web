<script lang="ts">
    import dayjs from 'dayjs';
    import { picture } from '$lib';
    import type { AtlasEvent } from '$lib/types';
    import AtlasMarkdown from './AtlasMarkdown.svelte';
    import RelativeTime from 'dayjs/plugin/relativeTime';

    type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

    dayjs.extend(RelativeTime);
    export let event: AtlasEvent;
    export let posterSize: ImageSize = 'large';

</script>

<div class="card card-hover variant-glass-surface hover:overflow-visible overflow-hidden">
    <header style={`background-image: url(${picture(event.media, posterSize)})`}>
        <a href={`/events/${event.id}`} class="backdrop-blur-lg">
            <img src={picture(event.media, posterSize)} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
        </a>
    </header>
    <div class="p-4">
        <h4><b>{event.name}</b></h4>
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
