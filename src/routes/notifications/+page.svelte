<script lang="ts">
    import dayjs from 'dayjs';
    import { api } from '$lib';
    import { page } from '$app/stores';
    import { notificationStore } from '$lib/stores';
    import RelativeTime from 'dayjs/plugin/relativeTime';
    import InfiniteLoading from 'svelte-infinite-loading';
    import { AtlasMetaTags, Container } from '$lib/components';
    import { EntityType, type Notification } from '$lib/types';
    import type { InfiniteEvent } from 'svelte-infinite-loading';

    dayjs.extend(RelativeTime);
    let cursor: string | null = null;
    let notifications: Notification[] = [];

    type Query = {
        notifications: Notification[];
        next: string | null;
        unread: number;
    };

    const infiniteHandler = async ({ detail: { loaded, complete } }: InfiniteEvent) => {
        const token = $page.data.token;
        if (!token) {
            complete();
            return;
        }

        const url = cursor ? `/notifications?cursor=${cursor}` : `/notifications`;
        const query = await api.get<Query>(url, fetch, token);
        notifications = [...notifications, ...query.notifications];
        notificationStore.set(query.unread);
        cursor = query.next;
        loaded();
        if (!query.next) {
            complete();
        }
    };

    const markAsRead = async (id: string) => {
        await api.put<unknown>('/notifications/read', fetch, { id }, $page.data.token);
        const query = await api.get<Query>('/notifications', fetch, $page.data.token);
        notificationStore.set(query.unread);
    };

    const getEntityName = (type?: EntityType) => {
        if (type === EntityType.Event) {
            return 'events';
        }
        if (type === EntityType.User) {
            return 'users';
        }
        if (type === EntityType.Group) {
            return 'groups';
        }
        return '';
    };
</script>

<AtlasMetaTags title={`Your Notifications`} description={`View your notifications.`} />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>Your Notifications</h2>
            </div>
        </div>
    </div>
    <br />
    <div class="flex flex-col gap-2">
        {#each notifications as notif}
            <a
                class="card card-hover p-4"
                on:click={() => markAsRead(notif.id)}
                class:variant-ghost-primary={!notif.read}
                class:variant-soft-surface={notif.read}
                href={`/${getEntityName(notif.entityType)}/${notif.entityId}${notif.key === 'EVENT_STAR_INVITED' ? '/invite' : ''}`}
            >
                <h4>{notif.title}</h4>
                <hr class="!border-t-2 my-2" />
                <p class="dark:text-surface-300 text-surface-600">
                    {notif.description}<b>{notif.key === 'EVENT_STAR_INVITED' ? ' Click to accept/deny.' : ''}</b>
                </p>
                <div class="text-sm">{new Date(notif.createdAt).toLocaleString()} ({dayjs(notif.createdAt).fromNow()})</div>
            </a>
        {/each}
    </div>
    <br />
    <InfiniteLoading on:infinite={infiniteHandler} />
</Container>
