<script lang="ts">
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { Container, AtlasMetaTags, ImageInput } from '$lib/components';
    import { ProgressRadial } from '@skeletonlabs/skeleton';

    let uploading = false;

    const upload: SubmitFunction = () => {
        uploading = true;
        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update();
        };
    };
</script>

<AtlasMetaTags title="New Group" description="Create a new group." />

<Container>
    <div class="card p-4" class:cursor-progress={uploading}>
        <div class="text-3xl">Create New Group</div>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-2">
                <label class="label">
                    <span>Name</span>
                    <input class="input" type="text" name="name" placeholder="Group Name" maxlength={128} required disabled={uploading} />
                </label>
                <label class="label">
                    <span>Description</span>
                    <textarea class="textarea" rows="4" name="description" placeholder="Supports Markdown" maxlength={2000} disabled={uploading} />
                </label>
                <ImageInput label="Icon" name="icon" aspectRatio="1:1" required={true} bind:disabled={uploading} />
                <ImageInput label="Banner" name="banner" aspectRatio="6:1" required={true} bind:disabled={uploading} />
            </div>
            <hr class="!border-t-2 my-4" />
            <div class="flex flex-row gap-2">
                <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Create </button>
                {#if uploading}
                    <div class="w-10 h-10">
                        <ProgressRadial width="5" stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                    </div>
                {/if}
            </div>
        </form>
    </div>
</Container>
