<script lang="ts">
    import { picture } from '$lib';
    import type { PageData } from './$types';
    import { GroupMemberRole } from '$lib/types';
    import { AtlasMarkdown, AtlasMetaTags, Container, GroupCard } from '$lib/components';

    export let data: PageData;

    $: event = data.event;
    $: group = data.event.owner;

    // If the current local user can modify this group. Used to show the Edit button.
    $: canEdit = isOwner || isManager;
    $: isOwner = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Owner);
    $: isManager = data.localUser && group.members.some((m) => m.user.id === data.localUser?.id && m.role === GroupMemberRole.Manager);
    
</script>

<AtlasMetaTags title={event.name} description={`An event hosted by ${group.name}`} />

<Container>
    <div class="flex md:flex-row flex-col gap-4">
        <div class="basis-1/4 flex flex-col gap-4">
            <div class="card hover:overflow-visible overflow-hidden">
                <header style={`background-image: url(${picture(event.media, 'large')})`}>
                    <div class="backdrop-blur-lg">
                        <img src={picture(event.media, 'large')} alt={`${event.name}'s Poster`} class="select-none object-contain bg-black/50 w-full aspect-[3/4]" />
                    </div>
                </header>
            </div>
            <div class="card overflow-hidden">
                <GroupCard group={group} />
            </div>
        </div>
        <div class="flex-grow md:order-last order-first">
            <div class="card p-4">
                <div class="flex flex-row gap-4">
                    <div class="flex-grow">
                        <h1>{event.name}</h1>
                    </div>
                    {#if canEdit}
                        <button type="button" class="btn variant-ghost-primary">Edit</button>
                    {/if}
                </div>
                <hr class="!border-t-2 my-4" />
                <div class="h-96 max-h-[600px]">
                    {#if event.description !== ''}
                        <AtlasMarkdown text={event.description} />
                    {:else}
                        <p><i>No information provided.</i></p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Container>