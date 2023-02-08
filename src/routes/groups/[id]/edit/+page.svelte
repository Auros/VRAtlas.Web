<script lang="ts">
    import type { PageServerData, ActionData } from './$types';
    import { AtlasMetaTags, Container } from "$lib/components";
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
                preset: 'success',
                timeout: 5000
            });
        }
    }
</script>

<AtlasMetaTags title="Edit Group" description="Edit a group." />

<Container>
    <div class="card p-4" class:cursor-progress={uploading}>
        <header>
            <h2>Editing <span class="text-primary-600 dark:text-primary-300">{group.name}</span></h2>
        </header>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">
                <h3>Basic</h3>
                <input type="hidden" name="id" value={group.id} required />
                <label class="label">
                    <span>Description</span>
                    <textarea class="textarea" rows="4" name="description" placeholder="Supports Markdown" value={group.description} maxlength={2000} disabled={uploading} />
                </label>
                <hr class="!border-t-2 my-4" />
                <h3>Display</h3>
                <input type="hidden" name="current-icon" value={group.icon} required />
                <input type="hidden" name="current-banner" value={group.banner} required />
                <label class="label">
                    <span>Icon</span>
                    <input class="input" type="file" name="icon" disabled={uploading} />
                </label>
                <label class="label">
                    <span>Banner</span>
                    <input class="input" type="file" name="banner" disabled={uploading} />
                </label>
                <hr class="!border-t-2 my-4" />
                <div class="flex flex-row gap-2">
                    <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}>
                        Save
                    </button>
                    {#if uploading}
                        <div class="w-10 h-10">
                            <ProgressRadial stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                        </div>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</Container>