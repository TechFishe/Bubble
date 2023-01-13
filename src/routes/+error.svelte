<script lang="ts">
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { onMount } from 'svelte';

	let canPlay: boolean = false;
	onMount(() => (canPlay = true));
</script>

<main class="w-screen flex-col justify-center px-4 text-center">
    {#if canPlay}
        <header>
            <h1 in:fly={{ y: 150, duration: 1250 }} class="text-6xl font-bold tracking-wider py-2">Error :(</h1>
	    	<p in:fly={{ y: 175, duration: 1400 }}>I'm sorry, but there was an error somewhere along the way. Please make sure you have the right URL entered and try again.
                <br>If the problems persist please contact me <a href="mailto:barkej226148@prescott.k12.wi.us" target="_blank" rel="noopener noreferrer" class="underline transition-colors duration-150 ease-in hover:text-green-400">here</a> and I'll try and fix it soon :)</p>
        </header>
        <div>
            <h2 in:fly={{ y: 200, duration: 1300 }} class="text-5xl font-bold tracking-wide pt-5 pb-1"><span class="border-t-2 border-slate-700 pt-1">Error code:</span></h2>
            <p in:fly={{ y: 225, duration: 1450 }}>{$page.error?.message}</p>
        </div>
    {/if}
</main>