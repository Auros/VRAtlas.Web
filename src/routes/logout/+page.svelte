<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(() => {
        if (!browser) {
            return;
        }

        // Force a page reload
        window.location.href = '/';
    });
</script>

<p>Logout</p>
