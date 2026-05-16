<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'outline' | 'success';
	type Size = 'sm' | 'lg';

	type Props = {
		variant?: Variant;
		size?: Size;
		href?: string;
		class?: string;
		children: Snippet;
	} & Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'class' | 'children'>;

	let {
		variant = 'primary',
		size = 'sm',
		href,
		class: extra = '',
		children,
		...rest
	}: Props = $props();

	const VARIANTS: Record<Variant, string> = {
		primary: 'bg-white text-black hover:bg-neutral-200',
		outline: 'border border-neutral-700 text-white hover:bg-neutral-900',
		success: 'bg-success text-white'
	};
	const SIZES: Record<Size, string> = {
		sm: 'px-4 py-2',
		lg: 'px-6 py-3'
	};

	let className = $derived(
		'inline-flex items-center justify-center rounded font-bold tracking-wide transition ' +
			`disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`
	);
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is resolved by the caller -->
	<a {href} class={className} {...rest}>{@render children()}</a>
{:else}
	<button type="button" class={className} {...rest}>{@render children()}</button>
{/if}
