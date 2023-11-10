import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    songs: await prisma.song.findMany()
  }
}

export const actions: Actions = {
	addSong: async ({ request }) => {
		const { title, artist } = Object.fromEntries(await request.formData()) as {
			title: string;
			artist: string;
		};

		try {
			await prisma.song.create({
				data: {
					title,
					artist
				}
			});
		} catch (err) {
			console.log(err);
			return fail(500, { message: 'Could not add song.' });
		}

		return {
			status: 201
		};
	}
};
