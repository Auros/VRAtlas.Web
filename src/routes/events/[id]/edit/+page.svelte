<script lang="ts">
    import { picture } from '$lib';
    import { onMount } from 'svelte';
    import type { User } from '$lib/types';
    import { en } from 'svelty-picker/i18n';
    import type { PageServerData } from './$types';
    import SveltyPicker, { formatDate } from 'svelty-picker';
    import { Container, UserSelector } from '$lib/components';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { Avatar, InputChip, ProgressRadial, tooltip } from '@skeletonlabs/skeleton';

    export let data: PageServerData;

    $: event = data.event;
    $: group = data.event.owner;

    let endTime = '';
    let startTime = '';
    let now = new Date();
    let uploading = false;
    let tags: string[] = [];
    let stars: { user: User }[] = event?.stars ?? [];
    let maximumDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90); // 90 days

    onMount(() => {
        stars = event.stars;
        tags = event.tags;
        startTime = event.startTime ?? '';
        endTime = event.endTime ?? '';
    });

    const upload: SubmitFunction = () => {
        uploading = true;
        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update();
        };
    };
    
</script>

<Container>
    <div class="card p-4">
        <h2>Edit Event <span class="text-primary-400">{event.name}</span></h2>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">

                <!-- Basic -->

                <input type="hidden" name="id" value={event.id} required />
                <label class="label" for="name">
                    <span>Name</span>
                    <input id="name" class="input" type="text" name="name" placeholder="Event Name" value={event.name} required disabled={uploading} />
                </label>
                <label class="label">
                    <span>Description</span>
                    <textarea
                        class="textarea"
                        rows="8"
                        name="description"
                        placeholder="Supports Markdown"
                        value={event.description}
                        maxlength={2000}
                        disabled={uploading}
                    />
                </label>
                <input type="hidden" name="previousposter" value={event.media}>
                <label class="label">
                    <span use:tooltip={{ content: 'The visual associated with the event.' }}>Poster</span>
                    <span class="text-warning-500 text-sm">Recommended Aspect Ratio - 3:4</span>
                    <input class="input" type="file" name="poster" disabled={uploading} />
                </label>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>Tags</span>
                    <InputChip name="tags" bind:value={tags} allowUpperCase validation={(value) => !tags.map(t => t.toLowerCase()).includes(value.toLowerCase())} />
                </label>
                {#each tags as tag}
                    <input name="tag" value={tag} type="hidden">
                {/each}

                <!-- Event Stars -->

                <div class="flex flex-row gap-2">
                    <h3>Stars</h3>
                    <UserSelector text="Add Star" ignore={stars.map(s => s.user.id)} on:user-select={e => {
                        stars.push({ user: e.detail.user });
                        stars = stars;
                    }} />
                </div>

                <div class="grid md:grid-cols-6 gap-4">
                    {#each stars as { user }}
                        <input type="hidden" name="star" value={user.id}>
                        <div class="card variant-glass-surface p-4">
                            <div class="flex flex-col items-center gap-2">
                                <a href={`/users/${user.id}`}>
                                    <Avatar src={picture(user.picture)} width="lg:w-32 md:w-16 w-32" />
                                </a>
                                <h3>{user.username}</h3>
                                <button
                                    type="button"
                                    class="btn-icon variant-filled-error scale-50 absolute right-0 top-0"
                                    on:click={() => stars = stars.filter(s => s.user.id !== user.id)}>
                                    X
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
                
                <!-- Time -->
                
                <h3>Time</h3>

                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>Start Time</span>
                    <SveltyPicker
                        name="event-start-raw"
                        inputClasses="form-control"
                        format="yyyy-mm-ddThh:ii:ss"
                        startDate={now}
                        endDate={maximumDate}
                        bind:value={startTime}
                        required />
                </label>

                {#if startTime !== '' && new Date(startTime).getTime() > 1}
                <input type="hidden" name="event-start" value={new Date(startTime).toISOString()}>
                    {formatDate(new Date(startTime), 'DD, MM d, yyyy @ H:i P', en, 'standard')}
                {/if}
                
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>End Time</span>
                    <SveltyPicker
                        name="event-end-raw"
                        inputClasses="form-control"
                        format="yyyy-mm-ddThh:ii:ss"
                        startDate={startTime}
                        endDate={maximumDate}
                        disabled={startTime === '' || (new Date(startTime).getTime() <= 1 )}
                        bind:value={endTime}
                        required />
                </label>

                {#if endTime !== '' && new Date(endTime).getTime() > 1}
                    <input type="hidden" name="event-end" value={new Date(endTime).toISOString()}>
                    {formatDate(new Date(endTime), 'DD, MM d, yyyy @ H:i P', en, 'standard')}
                {/if}

                <hr class="!border-t-2 my-4" />
                <div class="flex flex-row gap-2">
                    <button type="submit" class="btn variant-filled-primary w-32" disabled={uploading}> Save </button>
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