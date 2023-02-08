<script lang="ts">
    import { marked } from 'marked';
    import DOMPurify from 'isomorphic-dompurify';

    export let text: string;
</script>

{@html DOMPurify.sanitize(marked(text))}