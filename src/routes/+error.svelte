<script lang="ts">
    import { page } from '$app/stores';
    import { Container } from '$lib/components';

    $: errors = $page.error?.errors;
</script>

<Container>
    <div class="space-y-4">
        <div class="text-3xl">Error! ({$page.status})</div>
        {#if $page.error?.message}
            <p>{$page.error?.message}</p>
        {/if}
        {#if errors}
            <hr class="!border-t-2 my-4" />
            {#each errors as error}
                <p>{error}</p>
            {/each}
            <hr class="!border-t-2 my-4" />
            <a href={$page.url.toString()} class="btn variant-filled-primary">Refresh</a>
        {/if}
    </div>
</Container>
