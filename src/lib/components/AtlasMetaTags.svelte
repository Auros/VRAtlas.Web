<script lang="ts">
    import { MetaTags } from 'svelte-meta-tags';
    import { PUBLIC_SERVING_URL } from '$env/static/public';

    export let title: string;
    export let description: string | undefined = undefined;
    export let url: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let twitter = false;
    export let large = true;
</script>

<MetaTags
    {title}
    titleTemplate="%s • VR Atlas"
    {description}
    twitter={twitter && image ? {
        cardType: large ? 'summary_large_image' : 'summary'
    } : undefined}
    openGraph={{
        type: 'website',
        title,
        description,
        url: url ? `${PUBLIC_SERVING_URL}${url}` : undefined,
        images: [{ url: image ?? `${PUBLIC_SERVING_URL}/icon.png` }]
    }}
/>
