<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	let canPlay: boolean = false;
	onMount(() => (canPlay = true));
</script>

<main class="w-screen flex-col justify-center px-4 text-center">
	{#if canPlay}
		<header class="pb-4">
			<h1 in:fly={{ y: 150, duration: 1250 }} class="text-6xl">User</h1>
			<p in:fly={{ y: 175, duration: 1400 }}>Log in or sign up</p>
		</header>
		<div class="grid" in:fly={{ y: 225, duration: 1425 }}>
			<div
				class="grid max-w-fit grid-flow-col grid-rows-1 items-center divide-x-2 divide-slate-700 justify-self-center">
				<div class="flex px-2.5">
					<button
						class="rounded-md bg-slate-800 px-4 py-1 text-xl shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-[1.075] hover:text-green-400 hover:shadow-md hover:shadow-green-400/25"
						>Log in</button>
				</div>
				<div class="flex px-2.5">
					<button
						class="rounded-md bg-slate-800 px-4 py-1 text-xl shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-[1.075] hover:text-green-400 hover:shadow-md hover:shadow-green-400/25"
						>Sign up</button>
				</div>
			</div>
		</div>
	{/if}
</main>
