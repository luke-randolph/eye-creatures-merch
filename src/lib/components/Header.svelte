<script lang="ts">
	import { resolve } from '$app/paths';
	import logoWhite from '$lib/assets/logo-white.png?enhanced';
	import { glitchFrames } from '$lib/glitchFrames';
	import { cart } from '$lib/stores/cart.svelte';
	import ProfileMenu from '$lib/components/ProfileMenu.svelte';
	import { ShoppingCart, User as UserIcon } from 'lucide-svelte';
	import type { User } from 'better-auth';

	let { user }: { user: User | null } = $props();

	const baseLogoSrc = logoWhite.img.src;
	const glitchSrcs = glitchFrames.map((f) => f.img.src);

	let hovering = $state(false);
	let animating = $state(false);
	let frameIndex = $state(0);

	let currentSrc = $derived(animating ? glitchSrcs[frameIndex] : baseLogoSrc);

	// On hover, play the glitch frames once (1 → last), then revert to the base logo.
	// Re-hovering replays from frame 1.
	$effect(() => {
		if (!hovering || glitchSrcs.length === 0) return;
		frameIndex = 0;
		animating = true;
		let i = 0;
		const id = setInterval(() => {
			i++;
			if (i >= glitchSrcs.length) {
				clearInterval(id);
				animating = false;
				return;
			}
			frameIndex = i;
		}, 80);
		return () => {
			clearInterval(id);
			animating = false;
		};
	});
</script>

<!-- Preload every glitch frame so the first hover is instant -->
<div style="display: none" aria-hidden="true">
	{#each glitchSrcs as src (src)}
		<img {src} alt="" />
	{/each}
</div>

<header class="border-b border-neutral-800">
	<div class="mx-auto grid max-w-6xl grid-cols-2 items-center px-4 py-4">
		<div class="flex">
			<a
				href={resolve('/')}
				class="inline-block"
				aria-label="Eye Creatures home"
				onmouseenter={() => (hovering = true)}
				onmouseleave={() => (hovering = false)}
				onfocus={() => (hovering = true)}
				onblur={() => (hovering = false)}
			>
				<img src={currentSrc} alt="Eye Creatures" class="h-16 w-auto" />
			</a>
		</div>

		<div class="flex items-center justify-end gap-1">
			{#if user}
				<ProfileMenu {user} />
			{:else}
				<a
					href={resolve('/sign-in')}
					aria-label="Sign in"
					class="inline-flex items-center rounded p-2 text-neutral-200 hover:bg-neutral-900 hover:text-white"
				>
					<UserIcon class="h-6 w-6" aria-hidden="true" />
				</a>
			{/if}
			<a
				href={resolve('/cart')}
				aria-label="Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})"
				class="relative inline-flex items-center rounded p-2 text-neutral-200 hover:bg-neutral-900 hover:text-white"
			>
				<ShoppingCart class="h-6 w-6" aria-hidden="true" />
				{#if cart.totalItems > 0}
					<span
						class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-black tabular-nums"
					>
						{cart.totalItems}
					</span>
				{/if}
			</a>
		</div>
	</div>
</header>
