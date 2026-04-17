type Picture = {
	img: { src: string; w: number; h: number };
	sources: Record<string, string>;
};

const modules = import.meta.glob<{ default: Picture }>('./assets/glitch/*.png', {
	eager: true,
	query: { enhanced: '' }
});

export const glitchFrames: Picture[] = Object.keys(modules)
	.sort()
	.map((k) => modules[k].default);
