<script lang="ts">
    import { MetaTags } from 'svelte-meta-tags';

    export let title: string;
    export let description: string | undefined = undefined;
    export let url: string | undefined = undefined;
    export let image: string | undefined = undefined;
</script>

<MetaTags
    {title}
    titleTemplate="%s • VR Atlas"
    {description}
    openGraph={{
        type: 'website',
        title,
        description,
        url: url ? `/${url}` : undefined,
        images: image ? [{ url: image }] : undefined
    }}
/>
