<script lang="ts">
    import { onMount } from 'svelte';
    import type { ActionData, PageData } from './$types';
    import { AtlasMetaTags, Container } from '$lib/components';
    import { ProgressRadial, toastStore } from '@skeletonlabs/skeleton';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';

    export let data: PageData;
    export let form: ActionData;

    $: user = data.user;
    let uploading = false;
    let links: { id: number, value: string }[] = [];
    let linkIdIncrementer = 0;

    onMount(() => {
        user.links.forEach(l => {
            links.push({
                id: linkIdIncrementer++,
                value: l
            });
        })
        links = links;
    })

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
                preset: 'success',
                timeout: 5000
            });
        };
    }) satisfies SubmitFunction

</script>

<AtlasMetaTags title="Edit Profile" description={`Edit your profile.`} />

<Container>
    <div class="card p-4" class:cursor-progress={uploading}>
        <header>
            <h2>Editing <span class="text-primary-600 dark:text-primary-300">{user.username}</span></h2>
        </header>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">
                <label class="label">
                    <span>Bio</span>
                    <textarea
                        class="textarea"
                        rows="4"
                        name="biography"
                        value={user.biography}
                        maxlength={500}
                        disabled={uploading}
                    />
                </label>
                <p>Links <button type="button" on:click={() => {
                    links.push({
                        id: linkIdIncrementer++,
                        value: ''
                    })
                    links = links;
                }} disabled={links.length >= 10}><b>(+)</b></button></p>
                {#each links as link}
                    <div class="flex flex-row">
                        <label class="label flex-grow" for="link">
                            <input required type="url" title="Link" name="link" bind:value={link.value} disabled={uploading}>
                        </label>
                        <button
                            type="button"
                            class="btn-icon variant-filled-error scale-50"
                            on:click={() => links = links.filter(l => l.id !== link.id)}>
                            X
                        </button>
                    </div>
                {/each}
                <div class="label">
                    <strong>Default Event Notification Settings</strong>
                    <div class="space-y-2">
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
                <hr class="!border-t-2 my-4" />
                <div class="flex flex-row gap-2">
                    <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Save </button>
                    {#if uploading}
                        <div class="w-10 h-10">
                            <ProgressRadial stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                        </div>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</Container>