<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<!-- Header -->
	<svelte:fragment slot="header">
		<nav>
			<p>Header</p>
		</nav>
	</svelte:fragment>

	<!-- Main-->
    <main class="container h-full mx-auto flex justify-center items-center">
		<slot />
	</main>

</AppShell>
