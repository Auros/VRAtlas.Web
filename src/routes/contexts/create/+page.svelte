<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Box from '$lib/components/layout/Box.svelte';
    import Button from '$lib/components/base/Button.svelte';

    export let form: ActionData;
    let type = 1;
</script>

<div class="flex justify-center">
    <Box class="md:w-3/5 w-full">
        <form class="flex flex-col p-4 gap-4" use:enhance>
            <h1 class="text-2xl font-semibold">Create Context</h1>
            {#if form?.missingAuthorizationCookie}<p class="text-red-500">Missing Authorization Requirement</p>{/if}
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                    required />
            </div>
            <div>
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Description</label>
                <textarea
                    id="description"
                    name="description"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white"
                    required />
            </div>
            <div>
                <label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Type</label>
                <div class="flex items-center mb-2">
                    <input
                        id="type-option-1"
                        bind:group={type}
                        type="radio"
                        name="type"
                        value={1}
                        class="w-4 h-4 border-gray-300 focus:ring-2  dark:bg-gray-700 "
                        checked />
                    <label for="type-option-1" class="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Game </label>
                </div>
                <div class="flex items-center mb-2">
                    <input
                        id="type-option-2"
                        bind:group={type}
                        type="radio"
                        name="type"
                        value={2}
                        class="w-4 h-4 border-gray-300 focus:ring-2 dark:bg-gray-700 "
                        checked />
                    <label for="type-option-2" class="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Stream </label>
                </div>
            </div>
            <div>
                <label for="icon" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Upload file</label>
                <input
                    id="icon"
                    name="icon"
                    type="file"
                    class="
                    block w-full text-sm
                    text-neutral-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-2xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-neutral-50 file:text-neutral-700
                    file:dark:bg-neutral-700 file:dark:text-neutral-200
                    hover:file:bg-neutral-300 transition mb-2
                " />
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-300">The recommended aspect ratio for the context icon is 1:1</div>
            </div>
            <div>
                <Button type="submit" text="Create" success={true} />
            </div>
        </form>
    </Box>
</div>
