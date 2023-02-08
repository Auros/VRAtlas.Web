<script lang="ts">
    import { PUBLIC_SERVING_URL } from '$env/static/public';
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
        url: url ? `${PUBLIC_SERVING_URL}${url}` : undefined,
        images: image ? [{ url: image }] : undefined
    }}
/>
