<script lang="ts">
    import type { PageData } from './$types';
    import { Container, AtlasMetaTags, AtlasMarkdown } from '$lib/components';
    import { picture } from '$lib';
    import { Avatar } from '@skeletonlabs/skeleton';

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
        <div class="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
            {#each groups as group}
                <a href={`/groups/${group.id}`} class="card card-hover variant-glass-surface overflow-hidden">
                    <header>
                        <Avatar src={picture(group.icon)} width="2xl:w-16 xl:w-14 lg:w-16 md:w-24 w-16" class="absolute top-2 left-2" />
                        <img src={picture(group.banner)} alt={`${group.name}'s Banner'`} class="select-none object-cover bg-black/50 w-full aspect-[24/4]" />
                    </header>
                    <div class="p-4">
                        <h4>{group.name}</h4>
                        <hr class="!border-t-2 my-4" />
                        {#if group.description !== ''}
                            <p class="max-h-14 hover:max-h-full">
                                <AtlasMarkdown text={group.description} />
                            </p>
                        {:else}
                            <p><i>No description provided.</i></p>
                        {/if}
                    </div>
                </a>
            {/each}
        </div>
    </div>
</Container>
