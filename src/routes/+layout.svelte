<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { picture } from '$lib';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import type { LayoutData } from './$types';
    import { navigating, page } from '$app/stores';
    import { AppBar, AppShell, Avatar, ProgressRadial, Toast, tooltip, menu } from '@skeletonlabs/skeleton';

    let animatedPageTransitions = false;

    // If the user's browser requests reduced motion, disable the page transition animation.
    onMount(
        () =>
            (animatedPageTransitions =
                window.matchMedia(`(prefers-reduced-motion: reduce)`) !== undefined || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches !== true)
    );

    export let data: LayoutData;
</script>

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
                    <pre use:tooltip={{ content: 'All times on the website are localized to this time zone.', position: 'bottom' }}>{Intl.DateTimeFormat().resolvedOptions().timeZone}</pre>
                    {#if data.localUser}
                        <!-- Local User Context Menu -->
                        <span class="relative">
                            <button use:menu={{ menu: 'local-user-context-menu' }} type="button">
                                <Avatar
                                    src={picture(data.localUser.picture)}
                                    alt={`${data.localUser.username}'s Avatar`}
                                    title={data.localUser.username}
                                    class="select-none"
                                />
                            </button>
                            <nav class="list-nav card p-4 w-48 shadow-xl" data-menu="local-user-context-menu" aria-label="Local User">
                                <ul role="group">
                                    <li role="menuitem">
                                        <a href={`/users/${data.localUser.id}`}> Profile </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href={`/groups`}> Groups </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href="/logout" class="option w-full"> Logout </a>
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
                {#key $page.url.pathname && $navigating}
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
