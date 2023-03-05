<script lang="ts">
    import { api, picture } from "$lib";
    import type { User } from "$lib/types";
    import type { PageData } from "./$types";
    import InfiniteLoading from 'svelte-infinite-loading';
    import { AtlasMetaTags, Container } from "$lib/components";
    import type { InfiniteEvent } from 'svelte-infinite-loading';
    import { Avatar, Tab, TabGroup } from "@skeletonlabs/skeleton";
    import { goto } from "$app/navigation";

    export let data: PageData;
    
    let tabSet: number = 1;
    let users: User[] = data.followers.users;
    let cursor: string | null = data.followers.next;
    
    $: user = data.user;

    const infiniteHandler = async ({ detail: { loaded, complete } }: InfiniteEvent) => {
        const token = data.token;
        if (!token || !cursor) {
            complete();
            return;
        }

        const url = `/users/${data.user.id}/profile/followers?cursor=${cursor}`;
        const query = await api.get<{ users: User[], next: string }>(url, fetch, token);
        users = [...users, ...query.users];
        cursor = query.next;
        loaded();
        if (!query.next) {
            complete();
            cursor = null;
        }
    };
</script>

<AtlasMetaTags title={`${user.username}'s Follows`} description={`Check out who is following ${user.username}.`} image={picture(user.picture, 'medium')} />

<Container>
    <TabGroup justify="justify-center">
        <Tab on:click={() => goto(`/users/${user.id}/following`)} bind:group={tabSet} name="tab1" value={0}>Following</Tab>
        <Tab on:click={() => goto(`/users/${user.id}/followers`)} bind:group={tabSet} name="tab2" value={1}>Followers</Tab>
    </TabGroup>
    <br />
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <div class="text-3xl">{user.username}'s Followers</div>
            </div>
        </div>
    </div>
    <br />
    <div class="grid lg:grid-cols-3 grid-cols-1 gap-4 md:order-last order-first flex-shrink">
        {#each users as user}
            <a href={`/users/${user.id}`} class="card card-hover p-2 flex flex-row flex-shrink">
                <div class="flex-shrink">
                    <Avatar src={picture(user.picture)} width="w-14" />
                </div>
                <div class="flex-grow px-2">
                    <p><b>{user.username}</b></p>
                </div>
            </a>
        {/each}
    </div>
    {#if cursor}
        <InfiniteLoading on:infinite={infiniteHandler} />
    {/if}
</Container>