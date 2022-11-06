<!--suppress CssUnusedSymbol -->
<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';
    import { token } from '$lib/stores/token';
    import { currentUser } from '$lib/stores/currentUser';
    import Navbar from '$lib/components/nav/Navbar.svelte';
    import Container from '$lib/components/layout/Container.svelte';

    export let data: any;

    onMount(() => {
        token.set(data.token);
        currentUser.set(data.currentUser);
    });
</script>

<svelte:head>
    <title>Home | VRAtlas</title>
</svelte:head>

<div class="transition-colors duration-150">
    <Navbar user={$currentUser} currentPath={data.path} />
    <div class="dark:text-neutral-200">
        <Container>
            <slot />
        </Container>
    </div>
</div>

<style>
    :global(html) {
        background-color: #f5f5f5;
        transition: background-color 0.15s;
    }
    :global(html.dark) {
        background-color: #171717;
    }
</style>
