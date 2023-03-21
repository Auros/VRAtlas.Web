<script lang="ts">
    import type { PageData } from './$types';
    import hero from '$lib/images/hero-blur-lite.webp';
    import { AtlasMetaTags, Container, EventCollection } from '$lib/components';

    export let data: PageData;
</script>

<AtlasMetaTags title={`Home`} description={`The open source hub for finding events in virtual reality.`} />

<div class="overflow-hidden lg:h-[480px] h-64 lg:bg-[center_top_-14rem] bg-cover" style={`background-image: url(${hero})`}>
    <div class="backdrop-blur-lg w-full h-full grid place-items-center text-center">
        <div class="text-white space-y-8 drop-shadow-2xl">
            <h1 class="scale-150 bg-gradient-to-br from-purple-300 via-purple-600 to-purple-900 bg-clip-text text-transparent box-decoration-clone">
                <b>VR Atlas</b>
            </h1>
            <p>The open source hub for finding events in virtual reality.</p>
        </div>
    </div>
</div>

<Container>
    <div class="mr-2">
        <EventCollection type="Live" events={data.live} more={'started'} />
        <EventCollection type="Upcoming" events={data.upcoming} more={'announced'} />
        <EventCollection type="Past" events={data.past} more={'concluded'} />
    </div>
</Container>
