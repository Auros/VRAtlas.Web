<script>
    import { Accordion } from '@skeletonlabs/skeleton';
    import { Container, AboutQuery, AtlasMetaTags } from '$lib/components';
    import { Eye, BugAnt, Calendar, LightBulb, ArchiveBox, CodeBracket, EnvelopeOpen } from '@steeze-ui/heroicons';
</script>

<AtlasMetaTags title={`About`} description={`Learn more about the VR Atlas.`} />

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
            <AboutQuery src={Calendar} title="How can I create an event?">
                Use the <code>Log In</code> button, create a <code>New Group</code> or be invited to a Group, and press the <code>New Event</code> button on the Group Page.
                This idea and concept was built with finding events in <a href="https://vrchat.com" target="_blank" rel="noreferrer">VRChat</a>
                in mind, but it can be used for <b>any kind of event</b> related to <b>VR</b>.
            </AboutQuery>
            <AboutQuery src={CodeBracket} title="Where can I view the source code?">
                The project is split up on GitHub between the
                <a href="https://github.com/Auros/VRAtlas.API" target="_blank" rel="noreferrer">back end</a>
                and the
                <a href="https://github.com/Auros/VRAtlas.Web" target="_blank" rel="noreferrer">front end</a>.
                Pull requests are open and encouraged, however if you're implementing a large feature, let the maintainer know first.
            </AboutQuery>
            <AboutQuery src={BugAnt} title="I found a bug! What should I do?">
                If you've discovered something wrong with the website
                (looks broken at certain resolutions, doesn't work for you, can't perform an action, something doesn't look right, etc.),
                please report it <a href="https://github.com/Auros/VRAtlas.Web/issues/new/choose" target="_blank" rel="noreferrer">here</a> by creating
                an account on GitHub and submitting an issue.
            </AboutQuery>
            <AboutQuery src={LightBulb} title="I have a feature request.">
                Have an idea that you think would fit well for the VR Atlas? Suggest it
                <a href="https://github.com/Auros/VRAtlas.Web/issues/new/choose" target="_blank" rel="noreferrer">here</a>.
                Keep in mind of the scope of the feature, but don't be afraid to suggest any idea (small or large). Everything will be considered.
            </AboutQuery>
            <AboutQuery src={ArchiveBox} title="Does this website collect any data?">
                The only thing that is collected is everything that you explicitly consent. There are <b>zero</b> trackers, analytic cookies, etc.
            </AboutQuery>
            <AboutQuery src={Eye} title="Will there ever be ads on this website?">
                <b>NO</b>. There will NEVER be ads associated with this project as long as it's being run by me (Auros). I have pledged to never include
                ads or absolute paywalls in anything I (Auros) create that is free and open-source.
            </AboutQuery>
            <AboutQuery src={EnvelopeOpen} title="Why are there Follow buttons?">
                VR Atlas has a notification system built into the API which allows users to receive updates from certain topics. Right now, you can only receive real-time updates
                while on the main website, however the system is very extensible. Discord DM and Email reminders are planned for the future.
            </AboutQuery>
        </Accordion>
    </div>
</Container>
