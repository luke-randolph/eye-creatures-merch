export type ColorOption = { hex: string; label: string; imageSlug: string };

export type Product = {
	id: number;
	slug: string;
	name: string;
	category: string;
	price: number;
	description: string | null;
	sizes: string[] | null;
	colors: ColorOption[] | null;
};

export type Category = { value: string; label: string };

export type CartItem = {
	productId: number;
	slug: string;
	name: string;
	price: number;
	size: string | null;
	color: ColorOption | null;
	quantity: number;
};
