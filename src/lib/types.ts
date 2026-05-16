export type ColorOption = {
	hex: string;
	label: string;
	imageUrl: string;
	imageSrcset?: string;
};

export type Product = {
	id: string;
	slug: string;
	name: string;
	category: string;
	price: number;
	description: string | null;
	sizes: string[] | null;
	imageUrl: string;
	imageSrcset?: string;
	colors: ColorOption[] | null;
};

export type Category = { value: string; label: string };

export type CartItem = {
	productId: string;
	slug: string;
	name: string;
	price: number;
	imageUrl: string;
	size: string | null;
	color: ColorOption | null;
	quantity: number;
};
