type Picture = {
	img: { src: string; w: number; h: number };
	sources: Record<string, string>;
};

const modules = import.meta.glob<{ default: Picture }>('./assets/products/*.{png,jpg}', {
	eager: true,
	query: { enhanced: '' }
});

const bySlug: Record<string, Picture> = {};
for (const [path, mod] of Object.entries(modules)) {
	const match = path.match(/\/([^/]+)\.(png|jpg)$/);
	if (match) bySlug[match[1]] = mod.default;
}

export function getProductImage(slug: string): Picture | undefined {
	return bySlug[slug];
}
