<script lang="ts">
	import '../app.css';
	import NavBtn from '$lib/navBtn.svelte';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	const prerender = true;

	let canPlay: boolean = false,
		fishTalk: boolean = false;
	onMount(() => (canPlay = true));
	onMount(() =>
		setTimeout(() => {
			fishTalk = true;
		}, 1150)
	);
</script>

<div class="h-screen w-screen">
	<header
		class="z-40 grid h-16 w-screen grid-flow-col items-center rounded-b-lg bg-slate-800/95 px-3 py-1 backdrop-blur-[2px]">
		{#if canPlay}
			<section
				class="grid max-w-fit grid-cols-2 grid-rows-1 divide-x-[1.5px] divide-slate-700 text-green-400">
				<span
					in:fly={{ x: -275, duration: 1250 }}
					class="ml-1 grid max-w-fit select-none items-center pr-1.5 text-5xl font-bold tracking-wider"
					>Bubble
				</span>
				<div class="flex max-w-fit pl-1.5">
					<svg
						in:fly={{ x: -225, duration: 1150 }}
						version="1.0"
						xmlns="http://www.w3.org/2000/svg"
						width="3.25rem"
						height="3.25rem"
						viewBox="0 0 225 225"
						preserveAspectRatio="xMidYMid meet">
						<g
							transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
							fill="currentColor"
							stroke="currentColor">
							<path
								d="M1015 1908 c-148 -38 -276 -75 -282 -80 -25 -20 -15 -55 22 -77 49 -29 75 -75 75 -136 0 -76 -7 -88 -65 -123 -30 -18 -91 -60 -136 -95 -45 -34 -90 -68 -99 -75 -14 -10 -21 -6 -49 37 -69 108 -194 186 -313 198 -58 5 -68 3 -87 -16 -30 -30 -26 -60 19 -144 91 -168 104 -268 55 -415 -16 -46 -43 -109 -62 -140 -46 -75 -51 -104 -24 -131 43 -43 197 -18 302 50 54 35 117 106 138 157 l13 31 61 -48 c139 -109 245 -168 397 -222 96 -34 105 -39 112 -67 5 -20 3 -58 -7 -104 -19 -94 -19 -104 5 -128 17 -17 33 -20 120 -20 83 0 108 4 143 21 107 54 170 120 206 214 l18 47 94 25 c117 30 255 96 334 160 61 50 144 145 173 198 26 50 20 114 -18 181 -99 177 -235 299 -420 377 -36 16 -71 31 -78 35 -8 4 -22 31 -32 60 -55 156 -188 283 -312 297 -20 2 -143 -25 -303 -67z m353 -44 c28 -14 70 -46 91 -71 39 -44 88 -130 79 -139 -3 -2 -60 1 -126 8 -170 17 -306 -5 -474 -77 -16 -6 -18 -1 -18 36 -1 50 -21 112 -44 138 -15 17 -5 21 201 74 120 30 223 56 229 56 5 1 33 -11 62 -25z m167 -308 c237 -52 399 -162 524 -356 23 -35 44 -74 47 -87 13 -51 -132 -215 -249 -282 -139 -79 -304 -115 -532 -115 -157 0 -177 2 -260 28 -157 48 -333 147 -479 271 -38 32 -74 55 -84 53 -10 -2 -32 -34 -53 -76 -58 -117 -145 -189 -252 -208 l-39 -7 35 69 c98 195 103 353 16 532 -18 37 -35 71 -37 76 -3 4 6 5 19 1 90 -26 188 -103 254 -200 49 -70 66 -71 142 -4 170 150 372 263 553 310 89 23 280 21 395 -5z m-62 -947 c-8 -31 -71 -96 -123 -128 -43 -27 -60 -31 -119 -31 l-70 0 10 32 c5 18 9 58 9 88 l0 55 149 0 c136 1 148 0 144 -16z" />
							<path
								d="M1649 1231 c-20 -20 -29 -39 -29 -61 0 -43 47 -90 90 -90 43 0 90 47 90 90 0 22 -9 41 -29 61 -40 39 -82 39 -122 0z" />
						</g>
					</svg>
					{#if fishTalk}
						<svg
							in:fade
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="relative right-1.5 h-7 w-7">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
						</svg>
					{/if}
				</div>
			</section>
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
	{#if canPlay}
		<section class="absolute bottom-0 flex w-screen justify-center" in:fade={{ duration: 1150 }}>
			<footer
				class="mt-5 inline-block w-[97.5%] divide-x-[1px] border-t-2 border-slate-700 py-2.5 px-5">
				<small class="select-none pr-2 italic text-green-400"
					>Copyright &copy; TechFishe 2023</small>
				<small class="px-2"
					>Check us out on <a
						href="https://github.com/TechFishe/Bubble"
						target="_blank"
						rel="noopener noreferrer"
						class="underline transition-colors delay-75 duration-150 ease-in hover:text-orange-600"
						>GitHub!</a
					></small>
				<small class="px-2"
					>Personal site: <a
						href="https://techfishe.vercel.app"
						target="_blank"
						rel="noopener noreferrer"
						class="underline transition-colors delay-75 duration-150 ease-in hover:text-fuchsia-500"
						>TechFishe.com</a
					></small>
			</footer>
		</section>
	{/if}
</div>
