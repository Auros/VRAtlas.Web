<script lang="ts">
    import { fade } from 'svelte/transition';
    import { clickOutside } from '$lib/events/click-outside';
    import { toggleTheme } from '$lib/utilities/themeToggler';
    import NavItem from './NavItem.svelte';
    import ProfileMenu from './ProfileMenu.svelte';
    import ProfileMenuItem from './ProfileMenuItem.svelte';
    import ProfileMenuSeparator from './ProfileMenuSeparator.svelte';
    import type { User } from '$lib/types/User';

    let userOpen = false;
    let mobileOpen = false;

    export let user: User | null = null;

</script>

<nav class=" bg-neutral-800 select-none">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button
                    on:click={() => (mobileOpen = !mobileOpen)}
                    type="button"
                    class="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg
                        class="block h-6 w-6"
                        class:hidden={mobileOpen}
                        class:block={!mobileOpen}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <svg
                        class="hidden h-6 w-6"
                        class:hidden={!mobileOpen}
                        class:block={mobileOpen}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div class="hidden sm:ml-6 sm:block">
                    <div class="flex space-x-4">
                        <NavItem name="Home" active={true} />
                        <NavItem name="Events" />
                        <NavItem name="Groups" />
                    </div>
                </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                    type="button"
                    class="rounded-full bg-neutral-800 p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800">
                    <span class="sr-only">View notifications</span>
                    <svg
                        class="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </button>

                <div use:clickOutside on:click_outside={() => (userOpen = false)} class="relative ml-3">
                    {#if user}
                        <div>
                            <button
                                on:click={() => (userOpen = !userOpen)}
                                id="user-menu-button"
                                type="button"
                                class="flex rounded-full bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
                                aria-expanded="false"
                                aria-haspopup="true">
                                <span class="sr-only">Open user menu</span>
                                <img
                                    class="h-8 w-8 rounded-full"
                                    src="https://avatars.githubusercontent.com/u/41306347"
                                    alt={`${user.name}'s Profile Icon`} />
                            </button>
                        </div>
                        {#if userOpen}
                            <div in:fade={{ duration: 100 }} out:fade={{ duration: 75 }}>
                                <ProfileMenu>
                                    <ProfileMenuItem name="Your Profile" />
                                    <ProfileMenuItem name="Toggle Theme" on:click={() => toggleTheme()} />
                                    <ProfileMenuSeparator />
                                    <ProfileMenuItem name="Log Out" href="/logout" />
                                </ProfileMenu>
                            </div>
                        {/if}
                    {:else}
                        <div>
                            <button
                                on:click={() => (userOpen = !userOpen)}
                                id="user-menu-button"
                                type="button"
                                class="rounded-full bg-neutral-800 p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
                                aria-expanded="false"
                                aria-haspopup="true">
                                <span class="sr-only">Open login menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </button>
                        </div>
                        {#if userOpen}
                            <div in:fade={{ duration: 100 }} out:fade={{ duration: 75 }}>
                                <ProfileMenu>
                                    <ProfileMenuItem name="Log In" href="/login" />
                                    <ProfileMenuSeparator />
                                    <ProfileMenuItem name="Toggle Theme" on:click={() => toggleTheme()} />
                                </ProfileMenu>
                            </div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    </div>

    {#key mobileOpen}
        <div class="sm:hidden" id="mobile-menu" class:hidden={!mobileOpen} transition:fade={{ duration: 100 }}>
            <div class="space-y-1 px-2 pt-2 pb-3">
                <NavItem name="Home" active={true} />
                <NavItem name="Events" />
                <NavItem name="Groups" />
            </div>
        </div>
    {/key}
</nav>
