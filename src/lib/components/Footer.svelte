<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import eyeGif from '$lib/assets/eye.gif';

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');

	// Simple Icons SVG paths. Inline to avoid a dependency; replace if a brand
	// updates their mark.
	const ICON_PATHS = {
		appleMusic:
			'M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.227.555.05 1.11.066 1.667.066h11.03a12.5 12.5 0 0 0 1.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 0 0 1.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.045-1.773-.6-1.943-1.536a1.88 1.88 0 0 1 1.038-2.022c.323-.16.67-.25 1.018-.324.378-.082.758-.153 1.134-.243.274-.066.457-.24.51-.532a.637.637 0 0 0 .01-.114c0-1.914 0-3.827-.002-5.74a.604.604 0 0 0-.026-.169c-.035-.124-.126-.2-.25-.23a.698.698 0 0 0-.246-.013c-.39.053-.78.114-1.167.174l-4.442.685h-.024c-.256.05-.382.22-.382.48v.65c0 2.442.003 4.883 0 7.322-.004.25-.053.497-.135.735a1.99 1.99 0 0 1-1.377 1.254c-.32.094-.65.15-.98.166-.914.047-1.713-.563-1.898-1.463-.162-.775.14-1.582 1.017-2.002.42-.2.87-.3 1.322-.387.33-.063.66-.123.983-.205.44-.11.655-.352.655-.784V5.755c0-.126.038-.242.07-.36.046-.147.15-.25.28-.302.055-.024.113-.04.17-.053L9.89 3.904 14.77 2.96l1.826-.284c.34-.054.647.167.74.507.05.183.07.375.07.565-.002 2.12-.005 4.24 0 6.36z',
		spotify:
			'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
		youtube:
			'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
		bandcamp: 'M0 18.75l7.437-13.5H24l-7.438 13.5H0z',
		facebook:
			'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
		instagram:
			'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'
	};

	type SocialLink = { href: string; label: string; path: string };

	const tuneIn: SocialLink[] = [
		{
			href: 'https://music.apple.com/us/artist/eye-creatures/1438939977',
			label: 'Apple Music',
			path: ICON_PATHS.appleMusic
		},
		{
			href: 'https://open.spotify.com/artist/652jOvfVIuxXvCeuaxbiAD',
			label: 'Spotify',
			path: ICON_PATHS.spotify
		},
		{ href: 'https://www.youtube.com/@eyecreatures', label: 'YouTube', path: ICON_PATHS.youtube },
		{ href: 'https://eyecreatures.bandcamp.com/', label: 'Bandcamp', path: ICON_PATHS.bandcamp }
	];

	const followUs: SocialLink[] = [
		{ href: 'https://eyecreatures.bandcamp.com/', label: 'Bandcamp', path: ICON_PATHS.bandcamp },
		{ href: 'https://www.youtube.com/@eyecreatures', label: 'YouTube', path: ICON_PATHS.youtube },
		{ href: 'https://www.facebook.com/eyecreatures', label: 'Facebook', path: ICON_PATHS.facebook },
		{
			href: 'https://www.instagram.com/eyecreaturesband',
			label: 'Instagram',
			path: ICON_PATHS.instagram
		}
	];
</script>

<footer class="mt-16 border-t border-neutral-800">
	<div class="mx-auto grid max-w-6xl grid-rows-2 items-center px-4 py-6 sm:grid-rows-1">
		<div class="flex justify-center sm:hidden">
			{#if !reducedMotion.current}
				<img src={eyeGif} alt="" aria-hidden="true" class="h-18 w-auto" />
			{/if}
		</div>

		<div class="flex justify-between">
			<div class="text-center sm:text-left">
				<p class="mb-3 text-xs font-semibold tracking-widest text-white uppercase">Tune in:</p>
				<div class="flex justify-center gap-3 sm:justify-start">
					{#each tuneIn as link (link.label)}
						<a
							href={link.href}
							target="_blank"
							rel="external noopener noreferrer"
							aria-label={link.label}
							class="text-neutral-400 transition hover:text-white"
						>
							<svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true">
								<path d={link.path} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<div class="hidden justify-center sm:flex">
				{#if !reducedMotion.current}
					<img src={eyeGif} alt="" aria-hidden="true" class="h-18 w-auto" />
				{/if}
			</div>

			<div class="text-center sm:text-right">
				<p class="mb-3 text-xs font-semibold tracking-widest text-white uppercase">Follow us:</p>
				<div class="flex justify-center gap-3 sm:justify-end">
					{#each followUs as link (link.label)}
						<a
							href={link.href}
							target="_blank"
							rel="external noopener noreferrer"
							aria-label={link.label}
							class="text-neutral-400 transition hover:text-white"
						>
							<svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true">
								<path d={link.path} />
							</svg>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
