<script lang="ts">
	import '../app.css';
	import NavBtn from '$lib/navBtn.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let canPlay: boolean = false;
	onMount(() => (canPlay = true));
</script>

<div class="h-screen w-screen">
	<header
		class="z-40 grid h-16 w-screen grid-flow-col items-center rounded-b-lg bg-slate-800/95 px-3 py-1 backdrop-blur-[2px]">
		{#if canPlay}
			<span
				in:fly={{ x: -275, duration: 1250 }}
				class="ml-1 bg-gradient-to-br from-green-300 to-green-700 bg-clip-text text-5xl font-bold tracking-wider text-transparent"
				>ChatRoom</span>
			<nav
				in:fly={{ x: 275, duration: 1250 }}
				class="grid max-w-fit grid-flow-col grid-rows-1 items-center divide-x-[1px] divide-slate-700 justify-self-end">
				<NavBtn
					URL="/"
					SVG="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
					Time="1250" />
				<NavBtn
					URL="/About"
					SVG="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
					Time="1350" />
				<NavBtn
					URL="/Chat"
					SVG="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
					Time="1450" />
				<NavBtn
					URL="/User"
					SVG="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
					Time="1550" />
			</nav>
		{/if}
	</header>
	<slot />
</div>
