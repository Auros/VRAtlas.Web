<script lang="ts">
    import { MetaTags } from 'svelte-meta-tags';
    import { markdownToTxt } from 'markdown-to-txt';
    import { PUBLIC_SERVING_URL } from '$env/static/public';

    export let title: string;
    export let description: string | undefined = undefined;
    export let url: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let twitter = false;
    export let large = true;

    // Replace double lines with single lines to make formatted text descriptions smaller.
    $: cleanedDescription = description ? markdownToTxt(description.replace('\r\n\r\n', '\r\n')) : undefined;
</script>

<MetaTags
    {title}
    titleTemplate="%s • VR Atlas"
    description={cleanedDescription}
    twitter={twitter && image ? {
        cardType: large ? 'summary_large_image' : 'summary'
    } : undefined}
    openGraph={{
        type: 'website',
        title,
        url: url ? `${PUBLIC_SERVING_URL}${url}` : undefined,
        images: [{ url: image ?? `${PUBLIC_SERVING_URL}/icon.png` }],
        description: cleanedDescription,
    }}
/>
