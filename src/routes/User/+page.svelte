<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	let canPlay: boolean = false,
		login: boolean = false,
		signup: boolean = false,
		base: boolean = true;
	onMount(() => (canPlay = true));

	function clicked(btnNum: number, back: boolean) {
		if (back === true) {
			base = true;
			if (btnNum === 1) {
				login = false;
			} else if (btnNum === 2) {
				signup = false;
			}
		} else {
			base = false;
			if (btnNum === 1) {
				login = true;
			} else if (btnNum === 2) {
				signup = true;
			}
		}
	}
</script>

<main class="w-screen flex-col justify-center px-4 text-center">
	{#if canPlay}
		{#if base}
			<section>
				<header class="pb-4">
					<h1 in:fly={{ y: 75, duration: 1050 }} class="text-6xl tracking-wide">User</h1>
					<p in:fly={{ y: 100, duration: 1200 }}>Log in or sign up</p>
				</header>
				<div class="grid" in:fly={{ y: 150, duration: 1225 }}>
					<div
						class="grid max-w-fit grid-flow-col grid-rows-1 items-center divide-x-2 divide-slate-700 justify-self-center">
						<div class="flex px-2.5">
							<button
								on:click={() => clicked(1, false)}
								class="rounded-md bg-slate-800 px-4 py-1 text-xl shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-[1.075] hover:text-green-400 hover:shadow-md hover:shadow-green-400/25"
								>Log in</button>
						</div>
						<div class="flex px-2.5">
							<button
								on:click={() => clicked(2, false)}
								class="rounded-md bg-slate-800 px-4 py-1 text-xl shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-[1.075] hover:text-green-400 hover:shadow-md hover:shadow-green-400/25"
								>Sign up</button>
						</div>
					</div>
				</div>
			</section>
		{/if}
		{#if login}
			<section class="grid justify-center">
				<h2 in:fly={{ y: 125, duration: 1250 }} class="flex justify-self-center">Login</h2>
				<form
					in:fly={{ y: 150, duration: 1300 }}
					class="grid w-96 grid-cols-2 grid-rows-2 gap-y-4 pt-4"
					on:submit|preventDefault>
					<div class="gridCell">
						<label for="email">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-6 w-6">
								<path
									fill-rule="evenodd"
									d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
									clip-rule="evenodd" />
							</svg>
						</label>
						<input
							type="email"
							id="email"
							placeholder="Email"
							required
							class="formIn hover:scale-105" />
					</div>
					<div class="gridCell">
						<label for="pass">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-6 w-6">
								<path
									fill-rule="evenodd"
									d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
									clip-rule="evenodd" />
							</svg>
						</label>
						<input
							type="password"
							id="pass"
							placeholder="Password"
							required
							class="formIn hover:scale-105" />
					</div>
					<div
						in:fly={{ y: 100, duration: 1350 }}
						class="col-span-2 flex justify-center justify-self-center pt-10 pb-5">
						<button
							class="grid grid-flow-col grid-rows-1 gap-x-2 rounded-md bg-green-600 py-1.5 px-3 text-lg shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-110 hover:shadow-md hover:shadow-green-600/25">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
							</svg>
							<span>Submit</span>
						</button>
					</div>
				</form>
				<div class="flex justify-center">
					<div
						in:fly={{ y: 250, duration: 1450 }}
						class="flex max-w-fit justify-center border-t-[1.5px] border-slate-700 pt-4">
						<button
							on:click={() => clicked(1, true)}
							class="grid grid-flow-col grid-rows-1 gap-x-2 rounded-md bg-red-600 py-1.5 px-3 text-lg shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-110 hover:shadow-md hover:shadow-red-600/25">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
							</svg>
							<span>Back</span>
						</button>
					</div>
				</div>
			</section>
		{:else if signup}
			<section class="grid justify-center">
				<h2 in:fly={{ y: 100, duration: 1250 }} class="flex justify-self-center">Sign up</h2>
				<form
					in:fly={{ y: 125, duration: 1300 }}
					class="grid w-96 grid-cols-2 grid-rows-3 gap-y-4 pt-4"
					on:submit|preventDefault>
					<div class="gridCell">
						<label for="email">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-6 w-6">
								<path
									fill-rule="evenodd"
									d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
									clip-rule="evenodd" />
							</svg>
						</label>
						<input
							type="email"
							id="email"
							placeholder="Email"
							required
							class="formIn hover:scale-105" />
					</div>
					<div class="gridCell">
						<label for="pass">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-6 w-6">
								<path
									fill-rule="evenodd"
									d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
									clip-rule="evenodd" />
							</svg>
						</label>
						<input
							type="password"
							id="pass"
							placeholder="Password"
							required
							class="formIn hover:scale-105" />
					</div>
					<div class="gridCell">
						<label for="pass2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-6 w-6">
								<path
									fill-rule="evenodd"
									d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
									clip-rule="evenodd" />
							</svg>
						</label>
						<input
							type="password"
							id="pass2"
							placeholder="Re-enter Password"
							required
							class="formIn hover:scale-105" />
					</div>
					<div
						in:fly={{ y: 100, duration: 1350 }}
						class="col-span-2 flex justify-center justify-self-center pt-10 pb-5">
						<button
							class="grid grid-flow-col grid-rows-1 gap-x-2 rounded-md bg-green-600 py-1.5 px-3 text-lg shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-110 hover:shadow-md hover:shadow-green-600/25">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
							</svg>
							<span>Submit</span>
						</button>
					</div>
				</form>
				<div class="flex justify-center">
					<div
						in:fly={{ y: 225, duration: 1450 }}
						class="flex max-w-fit justify-center border-t-[1.5px] border-slate-700 pt-4">
						<button
							on:click={() => clicked(2, true)}
							class="grid grid-flow-col grid-rows-1 gap-x-2 rounded-md bg-red-600 py-1.5 px-3 text-lg shadow-sm transition-all delay-75 duration-300 ease-in-out hover:scale-110 hover:shadow-md hover:shadow-red-600/25">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
							</svg>
							<span>Back</span>
						</button>
					</div>
				</div>
			</section>
		{/if}
	{/if}
</main>

<style>
	h2 {
		@apply max-w-fit text-5xl;
	}
	label {
		@apply grid max-w-fit content-center fill-red-400 text-red-400;
	}
	.formIn {
		@apply grow rounded-lg bg-slate-700 px-2 py-1 text-lg caret-green-400 shadow-md shadow-slate-700/50 outline-none transition-transform duration-200 ease-in;
	}
	.gridCell {
		@apply col-span-2 row-span-1 flex content-center gap-x-3;
	}
</style>
