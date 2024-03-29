<script lang="ts">
    import type { PageServerData, ActionData } from './$types';
    import { AtlasMetaTags, Container, ImageInput } from '$lib/components';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { ProgressRadial, toastStore } from '@skeletonlabs/skeleton';

    export let data: PageServerData;
    export let form: ActionData;

    $: group = data.group;
    let uploading = false;

    const upload: SubmitFunction = () => {
        uploading = true;
        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update();

            if (!form?.success) {
                return;
            }
            toastStore.trigger({
                message: 'Successfully updated group.',
                background: 'variant-filled-success',
                timeout: 5000
            });
        };
    };
</script>

<AtlasMetaTags title="Edit Group" description="Edit a group." />

<Container>
    <div class="card p-4" class:cursor-progress={uploading}>
        <header>
            <div class="text-3xl">Editing <span class="text-primary-600 dark:text-primary-300">{group.name}</span></div>
        </header>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">
                <div>Basic</div>
                <input type="hidden" name="id" value={group.id} required />
                <label class="label">
                    <span>Description</span>
                    <textarea
                        class="textarea"
                        rows="4"
                        name="description"
                        placeholder="Supports Markdown"
                        value={group.description}
                        maxlength={1000}
                        disabled={uploading}
                    />
                </label>
                <hr class="!border-t-2 my-4" />
                <div class="text-2xl">Display</div>
                <ImageInput label="Icon" name="icon" aspectRatio="1:1" bind:disabled={uploading} />
                <ImageInput label="Banner" name="banner" aspectRatio="6:1" bind:disabled={uploading} />
                <hr class="!border-t-2 my-4" />
                <div class="flex flex-row gap-2">
                    <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Save </button>
                    {#if uploading}
                        <div class="w-10 h-10">
                            <ProgressRadial width="5" stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                        </div>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</Container>
