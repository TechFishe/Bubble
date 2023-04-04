<script lang="ts">
	import { fly } from 'svelte/transition';
	export let URL: string,
		SVG: string =
			'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
		Time: string = '1250';
</script>

<div>
	<a href={URL} class="flex px-5">
		<button
			in:fly={{ x: 275, duration: Number(Time) }}
			class="group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="transition-color h-8 w-8 delay-75 duration-150 ease-in group-hover:text-green-400">
				<path stroke-linecap="round" stroke-linejoin="round" d={SVG} />
			</svg>
		</button>
	</a>
</div>
