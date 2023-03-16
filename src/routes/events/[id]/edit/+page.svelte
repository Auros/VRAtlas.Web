<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import type { User } from '$lib/types';
    import { en } from 'svelty-picker/i18n';
    import type { PageServerData } from './$types';
    import { picture, uploadImage, uploadVideo } from '$lib';
    import SveltyPicker, { formatDate } from 'svelty-picker';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { AtlasMetaTags, Container, ImageInput, UserSelector } from '$lib/components';
    import { Avatar, InputChip, ProgressRadial, popup, toastStore } from '@skeletonlabs/skeleton';

    export let data: PageServerData;

    $: event = data.event;

    let endTime = '';
    let startTime = '';
    let now = new Date();
    let uploading = false;
    let tags: string[] = [];
    let videoChecked = false;
    let stars: { user: User; title: string }[] = event?.stars ?? [];
    let maximumDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90); // 90 days

    onMount(() => {
        stars = event.stars;
        tags = event.tags;
        startTime = event.startTime ?? '';
        endTime = event.endTime ?? '';
        videoChecked = !!event.video;
    });

    const upload: SubmitFunction = async ({ data, cancel }) => {
        uploading = true;
        const token = $page.data.token;

        try {
            const video = data.get('video');
            const poster = data.get('poster');

            if (video && (video as Blob).size !== 0) {
                const id = await uploadVideo(video, token ?? '');
                data.set('video', id);
            } else {
                data.delete('video');
            }

            if (poster && (poster as Blob).size !== 0) {
                console.log('poster good');
                const id = await uploadImage(poster, token ?? '');
                data.set('poster', id);
            } else {
                data.delete('poster');
            }
        } catch (e) {
            uploading = false;
            toastStore.trigger({
                message: 'Failed to upload resource. Did you go over the file limit?'
            })
            cancel();
        }

        return async ({ result, update }) => {
            await applyAction(result);
            uploading = false;
            await update();
        };
    };
</script>

<AtlasMetaTags title="Edit Event" description="Edit an event." />

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
                <ImageInput label="Poster" name="poster" aspectRatio="3:4" hoverText="The visual associated with the event." bind:disabled={uploading} />
                
                <label class="flex items-center space-x-2">
                    <input class="checkbox" type="checkbox" name="has-video" bind:checked={videoChecked} />
                    <p use:popup={{ event: 'hover', target: 'hasVideoTooltip' }}>
                        Use Video 
                    </p>
                    <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup="hasVideoTooltip">
                        You can upload a video file as an alternate poster display. It will be shown on most browsers.
                        <div class="arrow variant-filled-primary" />
                    </div>
                </label>

                {#if videoChecked}
                    <ImageInput
                        label="Video"
                        name="video"
                        aspectRatio="3:4"
                        maxFileSize="10 MB"
                        accept=".mp4,.webm"
                        hoverText="The video visual element associated with the event. If if it cannot be displayed in certain environments, it will fall back to the image poster." />
                {/if}

                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">
                    <span>Tags</span>
                    <InputChip
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
