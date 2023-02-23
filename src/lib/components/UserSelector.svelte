<script lang="ts">
    import { api, picture } from '$lib';
    import type { User } from '$lib/types';
    import { createEventDispatcher } from 'svelte';
    import { Avatar, ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';

    export let text = 'Add User';
    export let ignore: string[] = [];

    let selectedUser = '';
    let userSearchQuery = '';
    let userSearchTimer: NodeJS.Timeout;
    let usersInSearch: User[] = [];

    const dispatch = createEventDispatcher();

    const addSelectedUser = async () => {
        const user = usersInSearch.find((u) => u.id === selectedUser) as User;

        // Optimistically remove the selected user from the search
        usersInSearch = usersInSearch.filter((u) => u.id !== selectedUser);

        dispatch('user-select', {
            user
        });
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
                // Fetches the relevant users based on the search, then filters out the user ids to ignore.
                usersInSearch = (await api.get<User[]>(`/users/search?query=${value}`, fetch)).filter((u) => !ignore.includes(u.id));
            } catch {
                console.log('Error searching for users!');
            }
        }, 750);
    };
</script>

<span class="relative">
    <button type="button" class="btn variant-ghost-primary" use:popup={{ event: 'click', target: 'add-user' }}>{text}</button>
    <div class="card p-4 w-96 h-64 space-y-4 z-10" data-popup="add-user">
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
        <button type="button" class="btn variant-ghost-primary absolute right-4" disabled={selectedUser === ''} on:click={addSelectedUser}>Add</button>
    </div>
</span>
