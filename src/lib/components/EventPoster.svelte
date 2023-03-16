<script lang="ts">
    import { picture } from '$lib';
    import { onMount } from 'svelte';
    import type { AtlasEvent } from "$lib/types";
    import { PUBLIC_VIDEO_URL } from '$env/static/public';

    type ImageSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

    export let posterSize: ImageSize = 'large';
    export let event: AtlasEvent;
    export let clickable = true;

    let tryVideo = !!event.video;
    let hasWebm = true;
    let hasMp4 = false;

    onMount(async () => {
        if (!event.video) {
            return;
        }

        const webmTest = await fetch(`${PUBLIC_VIDEO_URL}/${event.video}.webm`, { method: 'HEAD' });
        if (webmTest.ok) {
            const tester = document.createElement('video');
            hasWebm = tester.canPlayType('video/webm; codecs="vp9"') === 'probably';
            tester.remove();
        }
        
        if (!webmTest.ok || !hasWebm) {
            hasWebm = false;
            const mp4Test = await fetch(`${PUBLIC_VIDEO_URL}/${event.video}.mp4`, { method: 'HEAD' });
            hasMp4 = mp4Test.ok;
        }
        tryVideo = hasWebm || hasMp4;
    })
</script>

<header style={`background-image: url(${picture(event.media, posterSize)})`}>
    {#if clickable}
        <a href={`/events/${event.id}`} class="backdrop-blur-lg">
            {#if tryVideo}
                {#if hasWebm}
                    <video src={`${PUBLIC_VIDEO_URL}/${event.video}.webm`} playsinline autoplay muted loop class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                {:else}
                    <video src={`${PUBLIC_VIDEO_URL}/${event.video}.mp4`} playsinline autoplay muted loop class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                {/if}
            {:else}
                <img src={picture(event.media, posterSize)} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
            {/if}
        </a>
    {:else}
        <div class="backdrop-blur-lg">
            {#if tryVideo}
                {#if hasWebm}
                    <video src={`${PUBLIC_VIDEO_URL}/${event.video}.webm`} playsinline autoplay muted loop class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                {:else}
                    <video src={`${PUBLIC_VIDEO_URL}/${event.video}.mp4`} playsinline autoplay muted loop class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                {/if}
            {:else}
                <img src={picture(event.media, posterSize)} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
            {/if}
        </div>
    {/if}
</header>