// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import type { PageLoad } from './$types';
export const prerender = true;
const logos = ["['_']", "['o']", "['-']", "['^']", "['͜']"];
const random = (mn: number, mx: number) => {
	return Math.random() * (mx - mn) + mn;
};
export const load = (() => {
	return {
		logo: logos[Math.floor(random(1, logos.length)) - 1]
	};
}) satisfies PageLoad;
