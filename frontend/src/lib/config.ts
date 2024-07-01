import { dev } from '$app/environment';
import type { SocialLink } from '$lib/types';

export const title = 'monospacee';

export const description = 'DJ duo with a GPLv3 license. Coming soon to a terminal near you!';

export const site_name = 'monospacee';

export const ogUrl = dev ? 'http://localhost:5174' : 'https://og.monospac.ee';

export const url = dev ? 'http://localhost:5173' : 'https://monospac.ee';

export const author = 'monospacee';

export const socials: SocialLink[] = [
	{
		href: 'https://github.com/MihkelMK/monospacee',
		icon: 'github',
		label: 'sourcecode for this page'
	},
	{
		href: 'https://soundcloud.com/monospacee',
		icon: 'soundcloud',
		label: 'our soundcloud'
	},
	{
		href: 'https://www.youtube.com/@monospacee/streams',
		icon: 'youtube',
		label: 'our youtube'
	},
	{
		href: `${url}/rss.xml`,
		icon: 'rss-box',
		label: 'our rss feed'
	}
];
