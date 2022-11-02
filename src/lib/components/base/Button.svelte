<script lang="ts">
    export let href: string | undefined = undefined
    export let text: string = 'Button'
    export let type = 'button'

    export let success: boolean = false

    $: standard = !success;
</script>

{#if href} 
    <a href={href}>
        <button
            on:click
            type="button"
            class="py-2 px-4 rounded-full transition-colors"
            class:bg-stone-800={standard}
            class:hover:bg-stone-700={standard}
            class:text-neutral-200={standard}
            class:dark:bg-stone-200={standard}
            class:dark:hover:bg-stone-400={standard}
            class:dark:text-neutral-900={standard}
            class:bg-green-600={success}
            class:hover:bg-green-700={success}
            class:text-neutral-100={success}
            >
            {text}
        </button>
    </a>
{:else}
    <button
        on:click
        type={type}
        class="py-2 px-4 rounded-full transition-colors"
        class:bg-stone-800={standard}
        class:hover:bg-stone-700={standard}
        class:text-neutral-200={standard}
        class:dark:bg-stone-200={standard}
        class:dark:hover:bg-stone-400={standard}
        class:dark:text-neutral-900={standard}
        class:bg-green-600={success}
        class:hover:bg-green-700={success}
        class:text-neutral-100={success}
        >
        {text}
    </button>
{/if}