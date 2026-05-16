// Returns only color/state classes; the caller supplies `border` and shape (`rounded` / `rounded-full`).
export function pillClass(active: boolean): string {
	return active
		? 'border-white bg-white text-black'
		: 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white';
}
