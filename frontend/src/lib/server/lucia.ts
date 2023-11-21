// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { prisma as client } from '$lib/server/prisma';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(client),
	getUserAttributes(databaseUser) {
		return {
			userId: databaseUser.id,
			username: databaseUser.username
		};
	}
});

export type Auth = typeof auth;
