<script>
    import '../app.css';
    import Navbar from '$lib/components/nav/Navbar.svelte';
</script>

<svelte:head>
    <title>The Atlas</title>
</svelte:head>

<Navbar />
<slot />

<style>
    :global(html) {
        background-color: #f5f5f5;
        transition: background-color 0.15s;
    }
    :global(html.dark) {
        background-color: #171717;
    }
</style>
