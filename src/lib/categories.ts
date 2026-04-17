const CATEGORY_LABELS: Record<string, string> = {
	shirt: 'Shirts',
	tape: 'Tapes',
	cd: 'CDs',
	stickers: 'Stickers'
};

export function categoryLabel(value: string): string {
	return CATEGORY_LABELS[value] ?? value;
}
