<script lang="ts">
    import type { PageServerData } from './$types';
    import { ProgressRadial, popup } from '@skeletonlabs/skeleton';
    import { AtlasMetaTags, Container, GroupCard } from '$lib/components';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';

    export let data: PageServerData;

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

<AtlasMetaTags title="New Event" description="Create a new event." />

<Container>
    <div class="flex md:flex-row flex-col gap-4">
        <div class="basis-1/3 flex flex-col gap-4">
            <div class="card p-4 basis-1/2">
                <h2>Create Event</h2>
                <hr class="!border-t-2 my-4" />
                <p>
                    Events are the core of the VR Atlas. Create one to publicize your event! You can customize the description, times, and more once you create
                    the event.
                </p>
                <br />
                <p>You are creating an event for the group <span class="text-primary-400"><b>{data.group.name}</b></span>.</p>
            </div>
            <div class="card basis-1/2 overflow-hidden md:order-last order-first">
                <GroupCard group={data.group} clickable={false} />
            </div>
        </div>
        <div class="flex-grow">
            <div class="card p-4" class:cursor-progress={uploading}>
                <form method="POST" use:enhance={upload}>
                    <div class="space-y-2">
                        <input type="hidden" name="group" value={data.group.id} required />
                        <label class="label">
                            <span>Name</span>
                            <input class="input" type="text" name="name" placeholder="Event Name" required disabled={uploading} />
                        </label>
                        <label class="label">
                            <span use:popup={{ event: 'hover', target: 'visualTooltip' }}>Poster</span>
                            <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup="visualTooltip">
                                The visual associated with the event.
                                <div class="arrow variant-filled-primary" />
                            </div>
                            <span class="text-warning-500">*Recommended Aspect Ratio - 3:4</span>
                            <input class="input" type="file" name="poster" required disabled={uploading} />
                        </label>
                        <hr class="!border-t-2 my-4" />
                        <div class="flex flex-row gap-2">
                            <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Create </button>
                            {#if uploading}
                                <div class="w-10 h-10">
                                    <ProgressRadial stroke={80} meter="stroke-primary-500 dark:stroke-surface-5" />
                                </div>
                            {/if}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</Container>
