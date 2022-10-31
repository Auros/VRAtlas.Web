<script lang="ts">
    export let rounded = true;
    export let circle = false;
    export let src: string;
    export let alt: string;

</script>

<img
    class:rounded-2xl={rounded}
    class:rounded-full={circle}
    class={`${$$props.class}`}
    src={src}
    alt={alt} />