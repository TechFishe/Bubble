<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let canPlay: boolean = false;
	onMount(() => (canPlay = true));
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<main>
	<header class="text-center">
		{#if canPlay}
			<h1 in:fly={{ y: 150, duration: 1250 }} class="text-6xl tracking-wide">Welcome</h1>
			<p in:fly={{ y: 175, duration: 1400 }}>To the last social media site you'll ever need!</p>
		{/if}
	</header>
</main>
