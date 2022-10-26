<script lang="ts">
    import { onMount } from 'svelte';

    let mounted = false;

    onMount(async () => {
        mounted = true;
        await new Promise(r => setTimeout(r, 1000))

        // Easy way to refresh the page
        if (window)
            window.location.href = '/';
    })

</script>

<svelte:head>
    <title>Log Out | VRAtlas</title>
</svelte:head>

<div class="flex flex-col justify-center items-center space-y-4 transition-all duration-150 ease-in" class:opacity-0={!mounted} class:opacity-100={mounted}>
    <p class="text-2xl">Logging out...</p>
</div>