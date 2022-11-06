<script lang="ts">
    import type { Context } from '$lib/types';
    import Button from '$lib/components/base/Button.svelte';

    interface Data { contexts: Context[] }

    export let data: Data;

</script>

<div class="space-y-4">
    <h1 class="text-2xl">Contexts</h1>

    <div class="inline-flex gap-4">
        <Button text="Create New Context" href="/contexts/create" />
    </div>

    {#each data.contexts as context}
        <p class="text-2xl">{context.name}</p>
    {/each}

</div>
