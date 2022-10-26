<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let mounted = false;
    $: user = $page.data.user;

    onMount(async () => {
        mounted = true;
        await new Promise(r => setTimeout(r, 1000))
        goto('/')
    })

</script>

<svelte:head>
    <title>Login | VRAtlas</title>
</svelte:head>

<div class="flex flex-col justify-center items-center space-y-4 transition-all duration-150 ease-in" class:opacity-0={!mounted} class:opacity-100={mounted}>
    {#if user}
        <p class="text-2xl">Logged In as <span class="text-purple-600"><b>{user.name}</b></span></p>
        <img class="w-48 rounded-2xl" src={user.icon.full} alt={`${user.name}'s Profile Icon`} />
    {/if}
    <p class="text-2xl">Redirecting...</p>
</div>