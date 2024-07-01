import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	return {
		userId: session.user.userId,
		username: session.user.username
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const currentPass = formData.get('password');
		const newPass = formData.get('new_password');
		const confirmPass = formData.get('confirm_password');
		// basic check
		if (typeof newPass !== 'string' || newPass.length < 6 || newPass.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		if (typeof confirmPass !== 'string' || confirmPass.length < 6 || confirmPass.length > 255 || confirmPass !== newPass) {
			return fail(400, {
				message: 'New passwords need to match'
			});
		}

		try {
			// find user by key
			// and validate password
			const key = await auth.useKey('username', username.toLowerCase(), currentPass);
			await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			const user = await auth.getUser(userId);
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('username', user.username, newPass);
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
			throw redirect(302, '/manage');
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist
				// or invalid password
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
