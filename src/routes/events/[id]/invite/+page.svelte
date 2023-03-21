<script lang="ts">
    import { goto } from '$app/navigation';
    import { toastStore } from '@skeletonlabs/skeleton';
    import type { ActionData, PageData } from './$types';
    import { AtlasMetaTags, Container, EventCard } from '$lib/components';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { onMount } from 'svelte';

    let uploading = false;
    export let data: PageData;
    export let form: ActionData;

    let accepted = false;
    onMount(() => (accepted = false));

    const upload = (({ data: formData }) => {
        uploading = true;
        if (accepted) {
            formData.append('accept', 'true');
        }
        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update({ reset: false });

            if (!form?.success) {
                return;
            }
            toastStore.trigger({
                message: `Successfully ${accepted ? 'accepted' : 'rejected'} event invite`,
                background: accepted ? 'variant-filled-success' : 'variant-filled-error',
                timeout: 5000
            });
            await goto(`/events/${data.event.id}`);
        };
    }) satisfies SubmitFunction;
</script>

<AtlasMetaTags title="Invites" description={`View pending invites.`} />

<Container>
    <div class="w-full h-full grid place-items-center space-y-4">
        <div class="text-center">
            <div class="text-2xl">You have been invited</div>
            <p>...to star at <span class="dark:text-primary-400 text-primary-600">{data.event.name}</span></p>
        </div>
        <form method="POST" use:enhance={upload}>
            <div class="flex flex-row gap-4">
                <button type="submit" class="btn variant-ghost-error w-32">Reject</button>
                <button type="submit" on:click={() => (accepted = true)} class="btn variant-ghost-success w-32">Accept</button>
            </div>
        </form>
        <EventCard event={data.event} />
    </div>
</Container>
