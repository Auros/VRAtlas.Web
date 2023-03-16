<script lang="ts">
    import { api } from '$lib';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { ProfileStatus } from '$lib/types';
    import type { ActionData, PageData } from './$types';
    import { PUBLIC_VAPID_KEY } from '$env/static/public';
    import { AtlasMetaTags, Container } from '$lib/components';
    import { ProgressRadial, toastStore } from '@skeletonlabs/skeleton';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';

    export let data: PageData;
    export let form: ActionData;

    $: user = data.user;
    let uploading = false;
    let linkIdIncrementer = 0;
    let canSubscribeToNotifications = false;
    let links: { id: number; value: string }[] = [];

    onMount(async () => {
        user.links.forEach((l) => {
            links.push({
                id: linkIdIncrementer++,
                value: l
            });
        });
        links = links;

        const query = await navigator.permissions.query({ name: 'notifications' });
        if (query.state !== 'granted') {
            canSubscribeToNotifications = true;
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        console.log(`[VR Atlas - Website] Web Push Notification Subscription: ${subscription ? 'Active' : 'Inactive'}`)
        canSubscribeToNotifications = !subscription;
    });

    const upload = (() => {
        uploading = true;
        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update({ reset: false });

            if (!form?.success) {
                return;
            }
            toastStore.trigger({
                message: 'Successfully updated profile.',
                background: 'success',
                timeout: 5000
            });
            await goto(`/users/${user.id}`);
        };
    }) satisfies SubmitFunction;


    const setupSubscription = (async () => {
        const prompt = await Notification.requestPermission();
        if (prompt !== 'granted') {
            return;
        }
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
        }
        subscription = await registration.pushManager.subscribe({
            applicationServerKey: PUBLIC_VAPID_KEY,
            userVisibleOnly: true
        });
        await api.post<unknown>(`/notifications/web`, fetch, subscription, data.token ?? '');
        new Notification('VR Atlas', {
            body: 'Web push notifications are now enabled!'
        });
    });
</script>

<AtlasMetaTags title="Edit Profile" description={`Edit your profile.`} />

<Container>
    <div class="card p-4" class:cursor-progress={uploading}>
        <header>
            <div class="text-3xl">Editing <span class="text-primary-600 dark:text-primary-300">{user.username}</span></div>
        </header>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">
                <label class="label">
                    <span>Bio</span>
                    <textarea class="textarea" rows="4" name="biography" value={user.biography} maxlength={500} disabled={uploading} />
                </label>
                <p>
                    Links <button
                        type="button"
                        on:click={() => {
                            links.push({
                                id: linkIdIncrementer++,
                                value: ''
                            });
                            links = links;
                        }}
                        disabled={links.length >= 10}><b>(+)</b></button
                    >
                </p>
                {#each links as link}
                    <div class="flex flex-row">
                        <label class="label flex-grow" for="link">
                            <input class="input" type="url" title="Link" name="link" bind:value={link.value} disabled={uploading} required />
                        </label>
                        <button type="button" class="btn-icon variant-filled-error scale-50" on:click={() => (links = links.filter((l) => l.id !== link.id))}>
                            X
                        </button>
                    </div>
                {/each}
                <fieldset>
                    <div class="label">
                        <strong>Default Event Notification Settings</strong>
                        <div class="space-y-2">
                            {#if canSubscribeToNotifications}
                                <button on:click={setupSubscription} type="button" class="btn variant-ghost-primary">Enable Web Push Notifications</button>
                            {/if}
                            <label class="flex items-center space-x-2">
                                <input class="checkbox" type="checkbox" name="at-start" checked={data.defaultNotificationSettings.atStart} />
                                <p>On Event Start</p>
                            </label>
                            <label class="flex items-center space-x-2">
                                <input class="checkbox" type="checkbox" name="at-thirty-minutes" checked={data.defaultNotificationSettings.atThirtyMinutes} />
                                <p>30 Minutes Before</p>
                            </label>
                            <label class="flex items-center space-x-2">
                                <input class="checkbox" type="checkbox" name="at-one-hour" checked={data.defaultNotificationSettings.atOneHour} />
                                <p>1 Hour Before</p>
                            </label>
                            <label class="flex items-center space-x-2">
                                <input class="checkbox" type="checkbox" name="at-one-day" checked={data.defaultNotificationSettings.atOneDay} />
                                <p>1 Day Before</p>
                            </label>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <div class="label">
                        <strong>Profile Status</strong>
                        <div class="space-y-2">
                            <label class="flex items-center space-x-2">
                                <input class="radio" type="radio" name="profile-status" value={ProfileStatus.Public} bind:group={user.profileStatus} />
                                <p>Public</p>
                            </label>
                            <label class="flex items-center space-x-2">
                                <input class="radio" type="radio" name="profile-status" value={ProfileStatus.Private} bind:group={user.profileStatus} />
                                <p>Private</p>
                            </label>
                        </div>
                    </div>
                </fieldset>
                <hr class="!border-t-2 my-4" />
                <div class="flex flex-row gap-2">
                    <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Save </button>
                    {#if uploading}
                        <div class="w-10 h-10">
                            <ProgressRadial width="5" stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                        </div>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</Container>
