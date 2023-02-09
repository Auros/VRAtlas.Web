<script lang="ts">
    import { picture } from "$lib";
    import type { AtlasEvent } from "$lib/types";
    import AtlasMarkdown from "./AtlasMarkdown.svelte";

    export let event: AtlasEvent;
</script>

<div class="card card-hover variant-glass-surface hover:overflow-visible overflow-hidden">
    <header style={`background-image: url(${picture(event.media, 'large')})`}>
        <a href={`/events/${event.id}`} class="backdrop-blur-lg">
            <img src={picture(event.media, 'large')} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
        </a>
    </header>
    <div class="p-4">
        <h3><b>{event.name}</b></h3>
        <hr class="!border-t-2 my-4" />
        {#if event.description !== ''}
            <p class="max-h-64 overflow-auto">
                <AtlasMarkdown text={event.description} />
            </p>
        {:else}
            <p><i>No information provided.</i></p>
        {/if}
    </div>
</div>