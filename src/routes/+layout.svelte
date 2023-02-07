<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { picture } from '$lib';
    import type { LayoutData } from './$types';
    import { AppBar, AppShell, Avatar, menu } from '@skeletonlabs/skeleton';

    export let data: LayoutData;
</script>

<AppShell>
    <!-- Header -->
    <svelte:fragment slot="header">
        <AppBar class="h-20">
            <svelte:fragment slot="trail">
                {#if data.localUser}
                    <span class="relative">
                        <button use:menu={{ menu: 'local-user-context-menu' }} type="button">
                            <Avatar src={picture(data.localUser.picture)} alt={`${data.localUser.username}'s Avatar`} title={data.localUser.username} />
                        </button>
                        <nav class="list-nav card p-4 w-48 shadow-xl" data-menu="local-user-context-menu" aria-label="Local User">
                            <ul role="group">
                                <li role="menuitem">
                                    <a href="/"> Profile </a>
                                </li>
                                <li role="menuitem">
                                    <a href="/logout" class="option w-full"> Logout </a>
                                </li>
                            </ul>
                        </nav>
                    </span>
                {:else}
                    <a href="/login" class="btn variant-filled-primary btn-base"> Log In </a>
                {/if}
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <!-- Main-->
    <main class="container h-full mx-auto flex justify-center items-center">
        <slot />
    </main>
</AppShell>
