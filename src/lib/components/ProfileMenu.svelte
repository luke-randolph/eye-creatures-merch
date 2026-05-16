<script lang="ts">
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { ChevronDown, User as UserIcon } from 'lucide-svelte';
	import type { User } from 'better-auth';

	let { user }: { user: User } = $props();

	let open = $state(false);
	let menuEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLButtonElement | null>(null);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}

	function onDocumentClick(e: MouseEvent) {
		if (!open) return;
		if (menuEl && !menuEl.contains(e.target as Node)) close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			close();
			triggerEl?.focus();
		}
	}

	// Close once focus leaves the menu entirely (e.g. tabbing past the last item).
	function onFocusOut(e: FocusEvent) {
		if (!open) return;
		if (menuEl && !menuEl.contains(e.relatedTarget as Node)) close();
	}

	async function signOut() {
		await authClient.signOut();
		close();
		await invalidateAll();
	}
</script>

<svelte:window onclick={onDocumentClick} onkeydown={onKeydown} />

<div bind:this={menuEl} class="relative" onfocusout={onFocusOut}>
	<button
		bind:this={triggerEl}
		type="button"
		onclick={toggle}
		aria-haspopup="true"
		aria-expanded={open}
		aria-label="Account menu"
		class="inline-flex items-center gap-1 rounded p-2 text-neutral-200 hover:bg-neutral-900 hover:text-white"
	>
		<UserIcon class="h-6 w-6" aria-hidden="true" />
		<ChevronDown class="h-4 w-4" aria-hidden="true" />
	</button>

	{#if open}
		<div
			class="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 shadow-lg"
		>
			<div class="border-b border-neutral-800 px-4 py-3">
				<p class="truncate font-medium text-white">{user.name || user.email}</p>
				{#if user.name}
					<p class="truncate text-xs text-neutral-400">{user.email}</p>
				{/if}
			</div>
			<a
				href={resolve('/orders')}
				onclick={close}
				class="block px-4 py-2 hover:bg-neutral-900 hover:text-white"
			>
				My orders
			</a>
			<button
				type="button"
				onclick={signOut}
				class="block w-full px-4 py-2 text-left hover:bg-neutral-900 hover:text-white"
			>
				Sign out
			</button>
		</div>
	{/if}
</div>
