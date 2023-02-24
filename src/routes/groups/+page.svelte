<script lang="ts">
    import type { PageData } from './$types';
    import { Container, AtlasMetaTags, GroupCard } from '$lib/components';

    export let data: PageData;

    $: groups = data.groups;
</script>

<AtlasMetaTags title="Your Groups" description="View the groups you've joined." />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <div class="text-3xl">Your Groups</div>
            </div>
            <div>
                <a href="/groups/new" class="btn variant-ghost-primary">New Group</a>
            </div>
        </div>
        <hr class="!border-t-2 my-4" />
        <div class="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
            {#each groups as group}
                <GroupCard {group} />
            {/each}
        </div>
    </div>
</Container>
