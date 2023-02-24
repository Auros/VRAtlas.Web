<script lang="ts">
    import { marked, Renderer } from 'marked';
    import DOMPurify from 'isomorphic-dompurify';

    // Generate all links with blank target, allows open in new tab on click.
    const renderer = new Renderer();
    const linkRenderer = renderer.link;
    renderer.link = function (href, title, text) {
        const html = linkRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };

    export let text: string;
</script>

<!-- Add the target attribute to the sanitizer so we don't trim it away. -->
{@html DOMPurify.sanitize(marked(text, { renderer, breaks: true }), { ADD_ATTR: ['target'] })}
