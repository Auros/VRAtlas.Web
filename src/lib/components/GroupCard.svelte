<script lang="ts">
    import { picture } from '$lib';
    import type { Group } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    import { AtlasMarkdown } from '$lib/components';

    export let group: Group;
    export let clickable = true;
</script>

<a href={clickable ? (group.identity ?? `/groups/${group.id}`) : undefined} target={group.identity ? '_blank' : undefined} rel={group.identity ? 'noreferrer' : undefined} class="card card-hover variant-glass-surface overflow-hidden">
    <header class="relative">
        <Avatar src={picture(group.icon)} width="2xl:w-16 xl:w-14 lg:w-16 md:w-24 w-16" class="absolute top-2 left-2 hidden xl:flex" />
        <img src={picture(group.banner)} alt={`${group.name}'s Banner'`} class="select-none object-cover bg-black/50 w-full aspect-[24/4]" />
    </header>
    <div class="p-4">
        <div class="text-xl">{group.name}</div>
        <hr class="!border-t-2 my-4" />
        {#if group.description !== ''}
            <p class="max-h-36 overflow-auto">
                <AtlasMarkdown text={group.description} />
            </p>
        {:else}
            <p><i>No description provided.</i></p>
        {/if}
    </div>
</a>
