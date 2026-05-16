export function formatAmount(cents: number, currency: string): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency.toUpperCase()
	}).format(cents / 100);
}

export function formatDate(date: Date | string, month: 'short' | 'long' = 'short'): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month,
		day: 'numeric'
	});
}
