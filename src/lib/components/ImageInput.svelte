<script lang="ts">
    import { popup } from "@skeletonlabs/skeleton";

    export let label: string;
    export let name: string;
    export let disabled = false;
    export let required = false;
    export let aspectRatio: string;
    export let hoverText: string | undefined = undefined;

</script>
<label class="label">
    <span class="test" use:popup={{ event: 'hover', target: `visualTooltip-${name}` }}>{label}</span>
    <span class="text-warning-500 text-sm">Recommended Aspect Ratio - {aspectRatio}, Maximum 5 MB</span>
    <input class="input" type="file" name={name} disabled={disabled} accept=".gif,.png,.jpg,.jpeg,.jfif" required={required} />
    <div class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl" data-popup={`visualTooltip-${name}`}>
        {hoverText}
        <div class="arrow variant-filled-primary" />
    </div>
</label>