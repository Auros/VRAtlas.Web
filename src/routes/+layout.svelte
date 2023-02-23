<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { picture } from '$lib';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fly } from 'svelte/transition';
    import type { LayoutData } from './$types';
    import { browser } from '$app/environment';
    import { Bell } from '@steeze-ui/heroicons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { navigating, page } from '$app/stores';
    import type { Notification } from '$lib/types';
    import { notificationStore } from '$lib/stores';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { HubConnectionBuilder } from '@microsoft/signalr';
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { AppBar, AppShell, Avatar, ProgressRadial, Toast, popup, Modal, toastStore, storePopup } from '@skeletonlabs/skeleton';

    export let data: LayoutData;
    let animatedPageTransitions = false;
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    // If the user's browser requests reduced motion, disable the page transition animation.
    onMount(async () => {
        let doTransitions = window.matchMedia(`(prefers-reduced-motion: reduce)`) === undefined;
        if (!doTransitions) {
            doTransitions = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches !== true;
        }
        animatedPageTransitions = doTransitions;

        // Don't connect to the notification hub unless we're logged in and are in the browser
        if (!browser || !data.token) {
            return;
        }

        // Live notification handling via SignalR
        const options = data.token ? { accessTokenFactory: () => data.token as string } : {};
        const connection = new HubConnectionBuilder().withUrl(`${PUBLIC_API_URL}/hub/atlas`, options).build();

        try {
            connection.on('notificationReceived', (data: Notification) => {
                toastStore.trigger({
                    message: data.title,
                    classes: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-purple-800 text-white',
                    timeout: 10000,
                    action: {
                        label: 'View',
                        response: () => goto('/notifications')
                    }
                });
            });

            await connection.start();
            console.log('Connected to VR Atlas Notification Hub');
        } catch (e) {
            console.error('Failed to connect to VR Atlas Notification Hub', e);
        }
    });
</script>

<Modal />
<Toast />

<AppShell>
    <!-- Header -->
    <svelte:fragment slot="header">
        <AppBar class="h-20">
            <svelte:fragment slot="lead">
                <a href="/">
                    <h3 class="select-none">
                        <b>VR Atlas</b>
                    </h3>
                </a>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <div class="flex flex-row items-center text-center gap-4">
                    <div class="hidden md:flex p-2 variant-ghost-primary rounded-md select-none"
                        use:popup={{ event: 'hover', target: 'timeTooltip', placement: 'bottom' }}>{Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </div>
                    <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup="timeTooltip">
                        All times on the website are localized to this time zone.
                    </div>
                    {#if data.localUser}
                        <a href="/notifications" class="relative mr-2">
                            {#await data.streamed.notifQuery}
                                <!-- Loading... -->
                            {:then value}
                                {#if value?.unread || $notificationStore}
                                    <span class="badge variant-filled-primary absolute bottom-4">{$notificationStore ?? value?.unread}</span>
                                {/if}
                            {/await}
                            <Icon src={Bell} class="w-8 h-8 dark:text-[#e4e4e4] text-[#303030]" />
                        </a>
                        <!-- Local User Context Menu -->
                        <span class="relative">
                            <button use:popup={{ event: 'click', target: 'local-user-context-menu' }} type="button">
                                <Avatar
                                    src={picture(data.localUser.picture)}
                                    alt={`${data.localUser.username}'s Avatar`}
                                    title={data.localUser.username}
                                    class="select-none"
                                />
                            </button>
                            <nav class="list-nav card p-4 w-48 shadow-xl" data-popup="local-user-context-menu" aria-label="Local User">
                                <ul role="group">
                                    <li role="menuitem">
                                        <a href={`/users/${data.localUser.id}`}> Profile </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href={`/groups`}> Groups </a>
                                    </li>
                                    <li role="menuitem">
                                        <form method="POST" action="/logout">
                                            <button type="submit" class="option w-full"> Logout </button>
                                        </form>
                                    </li>
                                </ul>
                            </nav>
                        </span>
                    {:else}
                        <!-- Login Button -->
                        <a href="/login" class="btn variant-filled-primary btn-base"> Log In </a>
                    {/if}
                </div>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- Main-->
    <main>
        {#if animatedPageTransitions}
            <div class="transition-outer">
                {#key $page.url.pathname || $navigating}
                    <div class="transition-inner">
                        <div in:fly={{ x: -5, duration: 120, delay: 120 }} out:fly={{ x: 5, duration: 120 }}>
                            {#if $navigating}
                                <div class="container mx-auto flex justify-center items-center my-24">
                                    <div class="w-40 h-40">
                                        <ProgressRadial stroke={60} meter="stroke-primary-500" />
                                    </div>
                                </div>
                            {:else}
                                <slot />
                            {/if}
                        </div>
                    </div>
                {/key}
            </div>
        {:else}
            <slot />
        {/if}
    </main>
</AppShell>

<style>
    .transition-outer {
        display: grid;
        grid-template: 1fr 1fr;
    }
    .transition-inner {
        grid-row: 1;
        grid-column: 1;
    }
</style>
