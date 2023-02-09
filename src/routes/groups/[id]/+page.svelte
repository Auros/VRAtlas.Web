<script lang="ts">
    import type { PageData } from './$types';
    import { picture, nameForRole } from '$lib';
    import { GroupMemberRole } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    import { invalidateAll } from '$app/navigation';
    import type { ActionResult } from '@sveltejs/kit';
    import { applyAction, deserialize } from '$app/forms';
    import { Container, AtlasMetaTags, AtlasMarkdown } from '$lib/components';

    export let data: PageData;

    let modifyingMember = false;
    $: group = data.group;

    // If the current local user can modify this group. Used to show the Edit button.
    $: canEdit = isOwner || isManager;
    $: isOwner = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Owner);
    $: isManager = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Manager);

    const memberRoleChanged = async (userId: string, role: GroupMemberRole) => {
        modifyingMember = true;
        const data = new FormData();
        data.append('id', group.id);
        data.append('userId', userId);
        data.append('role', nameForRole(role));
        
        const response = await fetch(`/groups/${group.id}`, {
            method: 'POST',
            body: data
        });

        const result: ActionResult = deserialize(await response.text());

        if (result.type === 'success') {
            await invalidateAll();
        }

        applyAction(result);
        modifyingMember = false;
    }

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
    <div class="card p-4 mt-8">
        <header>
            <h2>Members</h2>
        </header>
        <hr class="!border-t-2 my-4" />
        <div class="grid md:grid-cols-6 gap-4">
            {#each group.members as member (member.role)}
                <div class="card variant-glass-surface p-4">
                    <div class="flex flex-col items-center gap-2">
                        <Avatar src={picture(member.user.picture)} width="lg:w-32 md:w-16 w-32" />
                        <h3>{member.user.username}</h3>
                        {#if isOwner && (member.user.id !== data.localUser?.id)}
                            <select class="select" disabled={modifyingMember} class:cursor-progress={modifyingMember} bind:value={member.role} on:change={() => memberRoleChanged(member.user.id, member.role)}>
                                <option value={GroupMemberRole.Standard}>Standard</option>
                                <option value={GroupMemberRole.Manager}>Manager</option>
                            </select>
                        {:else}
                            <h6>{nameForRole(member.role)}</h6>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</Container>
