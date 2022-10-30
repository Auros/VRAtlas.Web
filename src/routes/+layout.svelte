<script>
    import '../app.css';
    import { page } from '$app/stores';
    import { token } from '$lib/stores/token';
    import Navbar from '$lib/components/nav/Navbar.svelte';
    import Container from '$lib/components/layout/Container.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        token.set($page.data.token)
    })
</script>

<svelte:head>
    <title>Home | VRAtlas</title>
</svelte:head>

<div class="transition-colors duration-150">
    <Navbar user={$page.data.user} currentPath={$page.data.pathName} />
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
