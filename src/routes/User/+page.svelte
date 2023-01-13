<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    let canPlay:boolean = false;
    onMount(() => canPlay = true);
</script>

<main class="w-screen flex-col justify-center px-4 text-center">
    {#if canPlay}
        <header class="pb-4">
            <h1 in:fly={{ y: 150, duration: 1250 }} class="text-6xl">User</h1>
            <p in:fly={{ y: 175, duration: 1400 }}>Log in or sign up</p>
        </header>
        <div class="grid">
            <div class="grid grid-flow-col max-w-fit items-center justify-self-center divide-x-2 grid-rows-1 divide-slate-700">
                <div class="px-2 flex">
                    <button class="bg-slate-800 text-xl rounded-md px-4 py-1">Log in</button>
                </div>
                <div class="px-2 flex">
                    <button class="bg-slate-800 text-xl rounded-md px-4 py-1">Sign up</button>
                </div>
            </div>
        </div>
    {/if}
</main>