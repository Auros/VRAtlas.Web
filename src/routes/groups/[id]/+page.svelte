<script lang="ts">
    import { picture } from '$lib';
    import type { PageData } from './$types';
    import { GroupMemberRole } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    import { Container, AtlasMetaTags, AtlasMarkdown } from '$lib/components';

    export let data: PageData;

    $: group = data.group;

    // If the current local user can modify this group. Used to show the Edit button.
    $: canEdit =
        data.localUser &&
        group.members.some((m) => (m.user.id === data.localUser?.id && m.role === GroupMemberRole.Owner) || m.role === GroupMemberRole.Manager);
</script>

<AtlasMetaTags title={group.name} description={group.description} url={`/groups/${group.id}`} />

<Container>
    <div class="card overflow-hidden">
        <header>
            <img src={picture(group.banner, 'large')} alt={`${group.name}'s Banner'`} class="select-none object-cover bg-black/50 w-full aspect-[24/4]" />
        </header>
        <div class="p-4">
            <div class="flex flex-row items-center gap-4">
                <Avatar src={picture(group.icon)} width="w-16" class="select-none" />
                <h1 class="flex-grow align-middle">{group.name}</h1>
                {#if canEdit}
                    <a href={`/groups/${group.id}/edit`} class="btn variant-ghost-primary w-20"> Edit </a>
                {/if}
            </div>
            <hr class="!border-t-2 my-4" />
            {#if group.description !== ''}
                <AtlasMarkdown text={group.description} />
            {:else}
                <p><i>No description provided.</i></p>
            {/if}
        </div>
    </div>
</Container>
