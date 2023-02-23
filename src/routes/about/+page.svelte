<script>
    import { Container } from '$lib/components';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { QuestionMarkCircle } from '@steeze-ui/heroicons';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<Container>
    <div class="card p-4">
        <div class="flex flex-row gap-4">
            <div class="flex-grow">
                <h2>About</h2>
            </div>
        </div>
        <hr class="!border-t-2 my-4" />
        <p>
            The VR Atlas is an open-source project created and maintained by <a href="https://github.com/Auros" target="_blank" rel="noreferrer">Auros Nexus</a
            >. It aims to provide an easy way for people involved in virtual reality to find more events taking place in VR, while also enabling developer and
            community participation to enhance the platform.
        </p>
        <hr class="!border-t-2 my-4" />
        <Accordion duration={200}>
            <AccordionItem>
                <svelte:fragment slot="lead">
                    <Icon src={QuestionMarkCircle} class="w-6 h-6" />
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <b>Question</b>
                </svelte:fragment>
                <svelte:fragment slot="content">Answer</svelte:fragment>
            </AccordionItem>
        </Accordion>
    </div>
</Container>
