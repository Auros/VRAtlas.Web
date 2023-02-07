<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { picture } from '$lib';
    import { fly } from 'svelte/transition';
    import type { LayoutData } from './$types';
    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { AppBar, AppShell, Avatar, ProgressRadial, menu } from '@skeletonlabs/skeleton';
    import { navigating } from '$app/stores';

    export let data: LayoutData;
</script>

<QueryClientProvider client={data.queryClient}>
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
                    {#if data.localUser}
                        <!-- Local User Context Menu -->
                        <span class="relative">
                            <button use:menu={{ menu: 'local-user-context-menu' }} type="button">
                                <Avatar src={picture(data.localUser.picture)} alt={`${data.localUser.username}'s Avatar`} title={data.localUser.username} />
                            </button>
                            <nav class="list-nav card p-4 w-48 shadow-xl" data-menu="local-user-context-menu" aria-label="Local User">
                                <ul role="group">
                                    <li role="menuitem">
                                        <a href={`/users/${data.localUser.id}`}> Profile </a>
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
                </svelte:fragment>
            </AppBar>
        </svelte:fragment>

        <!-- Main-->
        <main>
            <div class="transition-outer">
                {#key data.pathName && $navigating}
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
        </main>
    </AppShell>
</QueryClientProvider>

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
