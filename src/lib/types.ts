export type Product = {
	id: number;
	slug: string;
	name: string;
	price: number;
	description: string | null;
	image: string;
	sizes: string[] | null;
};

export type CartItem = {
	productId: number;
	slug: string;
	name: string;
	price: number;
	image: string;
	size: string | null;
	quantity: number;
};
