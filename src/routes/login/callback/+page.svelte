<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    onMount(async () => {
        if (!browser) {
            return;
        }
        goto('/');
    });
</script>
