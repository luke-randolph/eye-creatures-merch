<script lang="ts">
	type Props = {
		value: number;
		onChange: (next: number) => void;
		min?: number;
	};

	let { value, onChange, min = 1 }: Props = $props();

	function decrement() {
		if (value > min) onChange(value - 1);
	}
	function increment() {
		onChange(value + 1);
	}
</script>

<div class="inline-flex items-center overflow-hidden rounded border border-neutral-700">
	<button
		type="button"
		onclick={decrement}
		disabled={value <= min}
		aria-label="Decrease quantity"
		class="px-3 py-1 text-lg text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
	>
		−
	</button>
	<span class="min-w-8 px-3 py-1 text-center tabular-nums" aria-live="polite">{value}</span>
	<button
		type="button"
		onclick={increment}
		aria-label="Increase quantity"
		class="px-3 py-1 text-lg text-neutral-300 hover:bg-neutral-800 hover:text-white"
	>
		+
	</button>
</div>
