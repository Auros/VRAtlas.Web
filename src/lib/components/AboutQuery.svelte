<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon';
    import { AccordionItem } from "@skeletonlabs/skeleton";
    import { QuestionMarkCircle } from '@steeze-ui/heroicons';
    import type { IconSource } from "@steeze-ui/heroicons/types";

    export let src: IconSource | null = null;
    export let title: string;
    
</script>

<AccordionItem>
    <svelte:fragment slot="lead">
        <Icon src={src ?? QuestionMarkCircle} class="w-6 h-6" />
    </svelte:fragment>
    <svelte:fragment slot="summary">
        <b>{title}</b>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <slot />
    </svelte:fragment>
</AccordionItem>