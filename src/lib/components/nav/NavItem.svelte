<script lang="ts">
    export let href = '/';
    export let name = 'Item';
    export let currentPage = '/';

    $: active = href === currentPage;
</script>

<a
    {href}
    class:text-white={active}
    class:bg-neutral-900={active}
    class:text-neutral-300={!active}
    class:hover:text-white={!active}
    class:hover:bg-neutral-700={!active}
    class="block px-3 py-2 rounded-md text-base font-medium"
    aria-current={active ? 'page' : undefined}>
    {name}
</a>
