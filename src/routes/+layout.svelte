<script lang="ts">
    import '../theme.postcss';
    import '@skeletonlabs/skeleton/styles/all.css';
    import '../app.postcss';

    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<!-- Header -->
	<svelte:fragment slot="header">
		<nav class="bg-purple-500">
			<AppBar>
				<svelte:fragment slot="trail">
					<button class="btn variant-filled-primary btn-base">
						Log In
					</button>
				</svelte:fragment>
			</AppBar>
		</nav>
	</svelte:fragment>

	<!-- Main-->
    <main class="container h-full mx-auto flex justify-center items-center">
		<slot />
	</main>

</AppShell>
