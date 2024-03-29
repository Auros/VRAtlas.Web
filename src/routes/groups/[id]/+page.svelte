<script lang="ts">
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import { picture, nameForRole, api } from '$lib';
    import type { ActionResult } from '@sveltejs/kit';
    import { applyAction, deserialize } from '$app/forms';
    import { type Group, GroupMemberRole, type User } from '$lib/types';
    import { Avatar, ListBox, ListBoxItem, popup, toastStore } from '@skeletonlabs/skeleton';
    import { Container, AtlasMetaTags, AtlasMarkdown, EventCard, FollowButton } from '$lib/components';

    export let data: PageData;

    let selectedUser = '';
    let userSearchQuery = '';
    let modifyingMember = false;
    let usersInSearch: User[] = [];
    let userSearchTimer: NodeJS.Timeout;

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
        if (result.type === 'success') {
            toastStore.trigger({
                message: `Changed user's role to ${nameForRole(role)}`,
                background: 'variant-filled-success',
                timeout: 2000
            });
        }
    };

    // Debouncer for searching for users reactively
    const userSearch = () => {
        const value = userSearchQuery;
        clearTimeout(userSearchTimer);
        userSearchTimer = setTimeout(async () => {
            selectedUser = '';
            if (value === '') {
                usersInSearch = [];
                return;
            }
            try {
                // Fetches the relevant users based on the search, then filters out the ones that are already in the group.
                usersInSearch = (await api.get<User[]>(`/users/search?query=${value}`, fetch)).filter((u) => group.members.some((m) => m.user.id !== u.id));
            } catch {
                console.log('Error searching for users!');
            }
        }, 750);
    };

    const addSelectedUser = async () => {
        // Optimistically remove the selected user from the search
        usersInSearch = usersInSearch.filter((u) => u.id !== selectedUser);

        try {
            // Add the user
            data.group = await api.put<Group>(
                `/groups/members/add`,
                fetch,
                {
                    id: group.id,
                    userId: selectedUser,
                    role: GroupMemberRole.Standard
                },
                data.token ?? ''
            );

            // Trigger update on data prop
            data = data;

            // Show a toast the user.
            toastStore.trigger({
                message: `Invited user to group.`,
                background: 'variant-filled-success',
                timeout: 2000
            });
        } catch {
            console.log('Error adding user to group!');
        }
    };

    const removeMember = async (id: string) => {
        try {
            // Remove the user
            data.group = await api.put<Group>(
                `/groups/members/remove`,
                fetch,
                {
                    id: group.id,
                    userId: id,
                    role: GroupMemberRole.Standard
                },
                data.token ?? ''
            );

            // Trigger update on data prop
            data = data;

            // Show a toast the user.
            toastStore.trigger({
                message: `Removed user from group.`,
                background: 'variant-filled-warning',
                timeout: 2000
            });
        } catch (e) {
            console.log(e);
        }
    };
</script>

<AtlasMetaTags title={group.name} description={group.description} url={`/groups/${group.id}`} large={true} image={picture(group.banner, 'large')} twitter={true} />

<Container>
    <div class="card overflow-hidden">
        <header>
            <img src={picture(group.banner, 'large')} alt={`${group.name}'s Banner'`} class="select-none object-cover bg-black/50 w-full aspect-[24/4]" />
        </header>
        <div class="p-4">
            <div class="flex sm:flex-row flex-col items-center gap-4">
                <Avatar src={picture(group.icon)} width="w-16" class="select-none" />
                <h1 class="flex-grow align-middle">{group.name}</h1>
                <div class="flex flex-row gap-4">
                    <FollowButton id={group.id} type={2} />
                    {#if canEdit}
                        <a href={`/groups/${group.id}/edit`} class="btn variant-ghost-primary w-20 sm:order-none order-last"> Edit </a>
                        <a href={`/groups/${group.id}/event`} class="btn variant-ghost-primary w-40"> New Event </a>
                    {/if}
                </div>
            </div>
            <hr class="!border-t-2 my-4" />
            {#if group.description !== ''}
                <AtlasMarkdown text={group.description} />
            {:else}
                <p><i>No description provided.</i></p>
            {/if}
        </div>
    </div>
    {#if group.members.length}
        <div class="card p-4 mt-8">
            <header>
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <div class="text-3xl">Members</div>
                    </div>
                    {#if canEdit}
                        <div>
                            <span class="relative">
                                <button type="button" class="btn variant-ghost-primary" use:popup={{ event: 'click', target: 'add-member' }}>Add Member</button>
                                <div class="card p-4 w-96 h-64 space-y-4 z-10" data-popup="add-member">
                                    <input bind:value={userSearchQuery} class="input" type="text" placeholder="Search for users..." on:input={() => userSearch()} />
                                    <div class="h-28 overflow-auto">
                                        <ListBox>
                                            {#each usersInSearch as user}
                                                <ListBoxItem bind:group={selectedUser} name={user.id} value={user.id} on:click={() => (selectedUser = user.id)}>
                                                    <svelte:fragment slot="lead">
                                                        <Avatar src={picture(user.picture, 'small')} width="w-10" />
                                                    </svelte:fragment>
                                                    {user.username}
                                                </ListBoxItem>
                                            {/each}
                                        </ListBox>
                                    </div>
                                    <button
                                        type="button"
                                        class="btn variant-ghost-primary absolute right-4"
                                        disabled={selectedUser === ''}
                                        on:click={addSelectedUser}>Add</button
                                    >
                                </div>
                            </span>
                        </div>
                    {/if}
                </div>
            </header>
            <hr class="!border-t-2 my-4" />
            <div class="grid md:grid-cols-6 gap-4">
                {#each group.members as member}
                    <div class="card variant-glass-surface p-4">
                        <div class="flex flex-col items-center gap-2">
                            <a href={`/users/${member.user.id}`}>
                                <Avatar src={picture(member.user.picture)} width="lg:w-32 md:w-16 w-32" />
                            </a>
                            <div class="text-2xl">{member.user.username}</div>
                            {#if isOwner && member.user.id !== data.localUser?.id}
                                <select
                                    class="select"
                                    disabled={modifyingMember}
                                    class:cursor-progress={modifyingMember}
                                    bind:value={member.role}
                                    on:change={() => memberRoleChanged(member.user.id, member.role)}
                                >
                                    <option value={GroupMemberRole.Standard}>Standard</option>
                                    <option value={GroupMemberRole.Manager}>Manager</option>
                                </select>
                                <button
                                    type="button"
                                    class="btn-icon variant-filled-error scale-50 absolute right-0 top-0"
                                    on:click={() => removeMember(member.user.id)}>X</button
                                >
                            {:else}
                                <div class="text-lg">{nameForRole(member.role)}</div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
    {#if data.live.events.length}
        <div class="card p-4 mt-8">
            <header>
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <div class="text-3xl">Ongoing Events</div>
                    </div>
                </div>
            </header>
            <hr class="!border-t-2 my-4" />
            <div class="grid md:grid-cols-4 gap-4">
                {#each data.live.events as event}
                    <EventCard {event} />
                {/each}
            </div>
        </div>
    {/if}
    {#if data.upcoming.events.length}
        <div class="card p-4 mt-8">
            <header>
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <div class="text-3xl">Upcoming Events</div>
                    </div>
                </div>
            </header>
            <hr class="!border-t-2 my-4" />
            <div class="grid md:grid-cols-4 gap-4">
                {#each data.upcoming.events as event}
                    <EventCard {event} />
                {/each}
            </div>
        </div>
    {/if}
    {#if data.unlisted && canEdit && data.unlisted.events.length}
        <div class="card p-4 mt-8">
            <header>
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <div class="text-3xl">Unlisted Events</div>
                    </div>
                </div>
            </header>
            <hr class="!border-t-2 my-4" />
            <div class="grid md:grid-cols-6 gap-4">
                {#each data.unlisted.events as event}
                    <EventCard {event} />
                {/each}
            </div>
        </div>
    {/if}
    {#if data.concluded && data.concluded.events.length}
        <div class="card p-4 mt-8">
            <header>
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <div class="text-3xl">Past Events</div>
                    </div>
                </div>
            </header>
            <hr class="!border-t-2 my-4" />
            <div class="grid md:grid-cols-6 gap-4">
                {#each data.concluded.events as event}
                    <EventCard {event} />
                {/each}
            </div>
        </div>
    {/if}
</Container>
