<script lang="ts">
    export let href: string | undefined = undefined;
    export let name = 'Profile Menu Item';
    export let active = false;
</script>

<a
    on:click
    {href}
    class:bg-neutral-100={active}
    class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200"
    role="menuitem"
    tabindex="-1"
    class:cursor-pointer={href === undefined} >
    {name}
</a>
