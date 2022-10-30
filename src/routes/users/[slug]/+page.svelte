<script lang="ts">
    import type { User } from "$lib/types/user";
    import type { PageData } from "./$types";
    import { token } from '$lib/stores/token'

    export let data: PageData;
</script>

<div class="bg-neutral-800 rounded-3xl p-4">
    <div class="">
        {data.user.id}
    </div>
</div>