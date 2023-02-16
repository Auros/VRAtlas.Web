<script lang="ts">
    import { onMount } from "svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { browser } from "$app/environment";

    onMount(async () => {
        if (!browser) {
            return;
        }
        await invalidateAll();
        goto('/');
    })
</script>

<p>hi</p>