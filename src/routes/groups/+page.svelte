<script lang="ts">
    import type { PageData } from './$types';
    import { Container, AtlasMetaTags } from '$lib/components';

    export let data: PageData;

    $: groups = data.groups;

</script>

<AtlasMetaTags title="Your Groups" description="View the groups you've joined." />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>Your Groups</h2>
            </div>
            <div>
                <a href="/groups/new" class="btn variant-ghost-primary">New Group</a>
            </div>
        </div>
        <hr class="!border-t-2 my-4" />
        <div class="grid grid-cols-3 gap-4">
            {#each groups as group}
                <a href={`/groups/${group.id}`} class="card card-hover variant-glass-surface p-4">
                    <h4>{group.name}</h4>
                </a>
            {/each}
        </div>
    </div>
</Container>
