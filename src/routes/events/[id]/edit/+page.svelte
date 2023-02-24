<script lang="ts">
    import { picture } from '$lib';
    import { onMount } from 'svelte';
    import type { User } from '$lib/types';
    import { en } from 'svelty-picker/i18n';
    import type { PageServerData } from './$types';
    import SveltyPicker, { formatDate } from 'svelty-picker';
    import { Container, UserSelector } from '$lib/components';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { Avatar, InputChip, ProgressRadial, popup } from '@skeletonlabs/skeleton';

    export let data: PageServerData;

    $: event = data.event;

    let endTime = '';
    let startTime = '';
    let now = new Date();
    let uploading = false;
    let tags: string[] = [];
    let stars: { user: User; title: string }[] = event?.stars ?? [];
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
        <div class="text-3xl">Edit Event <span class="text-primary-400">{event.name}</span></div>
        <hr class="!border-t-2 my-4" />
        <form method="POST" use:enhance={upload}>
            <div class="space-y-4">
                <!-- Basic -->

                <input type="hidden" name="id" value={event.id} required />
                <label class="label" for="name">
                    <span>Name</span>
                    <input
                        id="name"
                        class="input"
                        type="text"
                        name="name"
                        placeholder="Event Name"
                        value={event.name}
                        maxlength={128}
                        required
                        disabled={uploading}
                    />
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
                <input type="hidden" name="previousposter" value={event.media} />
                <label class="label">
                    <span use:popup={{ event: 'hover', target: 'visualTooltip' }}>Poster</span>
                    <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup="visualTooltip">
                        The visual associated with the event.
                        <div class="arrow variant-filled-primary" />
                    </div>
                    <span class="text-warning-500 text-sm">Recommended Aspect Ratio - 3:4, Maximum 5 MB</span>
                    <input class="input" type="file" name="poster" disabled={uploading} />
                </label>

                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>Tags</span>
                    <InputChip
                        disabled
                        name="tags"
                        bind:value={tags}
                        allowUpperCase
                        validation={(value) => tags.length <= 50 && value.length <= 64 && !tags.map((t) => t.toLowerCase()).includes(value.toLowerCase())}
                    />
                </label>

                {#each tags as tag}
                    <input name="tag" value={tag} type="hidden" />
                {/each}

                <!-- Event Stars -->

                <div class="flex flex-row gap-2">
                    <div class="text-2xl">Stars</div>
                    {#if stars.length <= 25}
                        <UserSelector
                            text="Add Star"
                            ignore={stars.map((s) => s.user.id)}
                            on:user-select={(e) => {
                                stars.push({ user: e.detail.user, title: '' });
                                stars = stars;
                            }}
                        />
                    {/if}
                </div>

                <div class="grid md:grid-cols-6 gap-4">
                    {#each stars as { user, title }}
                        <input type="hidden" name="star-id" value={user.id} />
                        <div class="card variant-glass-surface p-4">
                            <div class="flex flex-col items-center gap-2">
                                <a href={`/users/${user.id}`}>
                                    <Avatar src={picture(user.picture)} width="lg:w-32 md:w-16 w-32" />
                                </a>
                                <div class="text-2xl">{user.username}</div>
                                <label class="label" for="star-title">
                                    <input
                                        id="star-title"
                                        class="input"
                                        type="text"
                                        name="star-title"
                                        placeholder="Title"
                                        maxlength={64}
                                        bind:value={title}
                                        disabled={uploading}
                                    />
                                </label>
                                <button
                                    type="button"
                                    class="btn-icon variant-filled-error scale-50 absolute right-0 top-0"
                                    on:click={() => (stars = stars.filter((s) => s.user.id !== user.id))}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Time -->

                <div class="text-2xl">Time</div>

                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>Start Time</span>
                    <SveltyPicker
                        name="event-start-raw"
                        inputClasses="input"
                        format="yyyy-mm-ddThh:ii:ss"
                        startDate={now}
                        endDate={maximumDate}
                        bind:value={startTime}
                        required
                    />
                </label>

                {#if startTime !== '' && new Date(startTime).getTime() > 1}
                    <input type="hidden" name="event-start" value={new Date(startTime).toISOString()} />
                    <p>{formatDate(new Date(startTime), 'DD, MM d, yyyy @ H:i P', en, 'standard')}</p>
                {/if}

                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>End Time</span>
                    <SveltyPicker
                        name="event-end-raw"
                        inputClasses="input"
                        format="yyyy-mm-ddThh:ii:ss"
                        startDate={startTime}
                        endDate={maximumDate}
                        disabled={startTime === '' || new Date(startTime).getTime() <= 1}
                        bind:value={endTime}
                        required
                    />
                </label>

                {#if endTime !== '' && new Date(endTime).getTime() > 1}
                    <input type="hidden" name="event-end" value={new Date(endTime).toISOString()} />
                    <p>{formatDate(new Date(endTime), 'DD, MM d, yyyy @ H:i P', en, 'standard')}</p>
                {/if}

                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" name="auto-start" checked={data.event.autoStart} />
                    <p use:popup={{ event: 'hover', target: 'autoStartTooltip' }}>
                        Auto Start
                    </p>
                    <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup="autoStartTooltip">
                        With this on, the event will automatically start once it reaches its Start Time, sending notifications to those who follow it.
                        <div class="arrow variant-filled-primary" />
                    </div>
                </label>

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
