<script lang="ts">
    import { AtlasMetaTags } from '$lib/components';
    import Container from '$lib/components/Container.svelte';
</script>

<AtlasMetaTags title="Your Groups" description="View the groups you've joined." />

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>Your Groups</h2>
            </div>
            <div>
                <a href="/" class="btn variant-ghost-primary">New Group</a>
            </div>
        </div>
        <hr class="!border-t-2 my-4" />
    </div>
</Container>
