import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { Song } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	let songs: Song[] = [];

	try {
		songs = await prisma.song.findMany();
	} catch (err) {
		console.log(err);
	}

	return {
		userId: session.user.userId,
		username: session.user.username,
		songs: songs,
		party: 'placeholder'
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to home
	},
	removeSong: async ({ request }) => {
		const { id } = Object.fromEntries(await request.formData()) as {
			id: string;
		};
		
    if (!id) {
      return fail(400, {message: 'Invalid request'})
    }

    try {
      await prisma.song.delete({
        where: {
          id: Number(id)
        }
      })
    } catch (err) {
      console.log(err)
      return fail(500, {
        message: "Something went wrong removing that song.",
      })
    }

    return {
      status: 200, message: "Song removed."
    }
	}
};
