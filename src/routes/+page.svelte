<script lang="ts">
    import hero from '$lib/images/hero.png'
    import type { PageData } from './$types';
    import { MetaTags } from 'svelte-meta-tags';
    import { Container, EventCollection } from '$lib/components';

    export let data: PageData;

</script>

<MetaTags title="Home" titleTemplate="%s • VR Atlas" description="The open source hub for finding events occurring in virtual reality." />

<div class="overflow-hidden lg:h-[480px] h-64 lg:bg-[center_top_-14rem] bg-cover" style={`background-image: url(${hero})`}>
    <div class="backdrop-blur-lg w-full h-full grid place-items-center text-center">
        <div class="space-y-8 drop-shadow-2xl">
            <h1 class="scale-150 "><b>VR Atlas</b></h1>
            <p>The open source hub for finding events occurring in virtual reality.</p>
        </div>
    </div>
</div>

<Container>
    <EventCollection type="Live" events={data.live?.events} />
    <EventCollection type="Upcoming" events={data.upcoming?.events} />
    <EventCollection type="Past" events={data.concluded?.events} />
</Container>