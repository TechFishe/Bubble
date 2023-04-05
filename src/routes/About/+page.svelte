<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let canPlay: boolean = false,
		showDots: boolean = true;
	onMount(() => (canPlay = true));
</script>

<svelte:head>
    <title>About</title>
</svelte:head>

<main class="w-screen flex-col justify-center px-4 text-center">
	{#if canPlay}
		<header class="pb-4">
			<h1 in:fly={{ y: 150, duration: 1250 }} class="text-6xl tracking-wide">About</h1>
			<p in:fly={{ y: 175, duration: 1400 }}>Get to know me a little bit :)</p>
		</header>
		<section in:fly={{ y: 250, duration: 1250 }}>
			<h2 class="justify-center text-4xl tracking-wide">
				<span class="border-t-2 border-slate-700 pt-1">About The Site</span>
			</h2>
			<p class="flex-cols px-10">
				This website is made as a project idea I got at 3 AM one night to test my limits in web
				design. The idea was to have a chat app made with Svelte and TailwindCSS and have the
				backend be handled by Firebase and Firestore for the database.
			</p>
			<div class="flex justify-center">
				{#if showDots}
					<button on:click={() => (showDots = false)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-8 w-8 text-green-400">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
						</svg>
					</button>
				{:else}
					<p in:fly={{ x: 150, duration: 1000 }} class="select-none text-green-400">
						And that's exactly what I did.
					</p>
				{/if}
			</div>
		</section>
	{/if}
</main>
