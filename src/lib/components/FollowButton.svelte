<script lang="ts">
    import api from '$lib/api';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { toastStore } from '@skeletonlabs/skeleton';

    enum EntityType {
        Unknown,
        User,
        Group,
        Event
    }

    export let id: string;
    export let type: EntityType;

    let processing = false;
    let isFollowing: boolean | null = null;

    // Check if the current user is following the relevant item.
    onMount(async () => {
        const token = $page.data.token;
        if (!token) {
            return;
        }

        const follow = await api.get<{ status: boolean }>(`/follows/${id}`, fetch, token);
        isFollowing = follow.status;
    });

    const clicked = async () => {
        processing = true;
        const token = $page.data.token;
        if (isFollowing) {
            // Unfollow the current entity
            try {
                await api.delete<unknown>(`/follows/${id}`, fetch, token);
                toastStore.trigger({
                    message: 'Unfollowed',
                    background: 'success'
                });
                isFollowing = false;
            } catch {
                toastStore.trigger({
                    message: 'Could not unfollow entity.',
                    background: 'error'
                });
            }
        } else {
            // Follow the current entity
            try {
                const metadata = await api.get('/notifications/@me', fetch, token);
                await api.post<unknown>(
                    `/follows`,
                    fetch,
                    {
                        id,
                        type,
                        metadata
                    },
                    token
                );
                toastStore.trigger({
                    message: 'Followed',
                    background: 'success'
                });
                isFollowing = true;
            } catch {
                toastStore.trigger({
                    message: 'Could not follow entity.',
                    background: 'error'
                });
            }
        }
        processing = false;
    };
</script>

<button
    class="btn"
    class:variant-ghost-primary={!isFollowing}
    class:variant-ghost-error={isFollowing === true}
    disabled={isFollowing === null || processing}
    on:click={clicked}
>
    {isFollowing ? 'Unfollow' : 'Follow'}
</button>
