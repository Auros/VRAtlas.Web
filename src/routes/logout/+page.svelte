<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { invalidateAll } from '$app/navigation';

    onMount(async () => {
        if (!browser) {
            return;
        }

        await invalidateAll();

        // Force a page reload
        window.location.href = '/';
    });
</script>

<p>Logout</p>
