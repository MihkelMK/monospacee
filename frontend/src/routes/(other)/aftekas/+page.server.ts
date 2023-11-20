import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { ActionFailure, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		return {
			songs: await prisma.song.findMany()
		};
	} catch (err) {
		return {
			songs: []
		};
	}
};

export const actions: Actions = {
	search: async ({ request, fetch }) => {
		const { title, artist, offset } = Object.fromEntries(await request.formData()) as {
			title: string;
			artist: string;
			offset: number;
		};

		try {
			const fixedOffset = offset - 5 ?? 0;
			const response = await fetch('/api/search', {
				method: 'POST',
				body: JSON.stringify({ title, artist, offset: fixedOffset }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();

			const tracks = data.searchData.tracks.items;
			const filteredTracks = tracks.filter(
				(value, index, self) =>
					index ===
					self.findIndex(
						(t) => t.name === value.name && t.artists.at(0).name === value.artists.at(0).name
					)
			);

			if (filteredTracks.length === 0) {
				return fail(404, { title, artist, tracks: [], message: 'Spotify did not find any songs.' });
			}

			return { status: 201, tracks: filteredTracks };
		} catch (err) {
			console.log(err);
			return fail(500, { message: 'Something went wrong.' });
		}
	},
	link: async ({ request, fetch }) => {
		const { url } = Object.fromEntries(await request.formData()) as {
			url: string;
		};

		try {
			const id = url.split('/')?.at(-1)?.split('?')?.at(0);
			const response = await fetch('/api/search/link', {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();

			const tracks = [data.searchData];

			if (tracks.length === 0) {
				return fail(404, { url, tracks: [], message: 'Error in link.' });
			}

			return { status: 201, tracks: tracks };
		} catch (err) {
			console.log(err);
			return fail(500, { message: 'Something went wrong.' });
		}
	},
	submit: async ({ request }) => {
		const { title, artist, spotifyID } = Object.fromEntries(await request.formData()) as {
			title: string;
			artist: string;
			spotifyID: string;
		};

		if (!title || !artist || !spotifyID || title === '' || artist === '' || spotifyID === '') {
			return fail(500, { message: 'Bad request, missing info.' });
		}

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
			status: 201,
			message: 'Song added successfully.'
		};
	}
};
