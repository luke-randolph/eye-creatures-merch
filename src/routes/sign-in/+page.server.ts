import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo') || '/';
	if (locals.user) {
		throw redirect(303, redirectTo);
	}
	return { redirectTo };
};
