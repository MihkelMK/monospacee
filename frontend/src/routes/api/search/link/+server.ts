import { json } from '@sveltejs/kit';
import { CLIENT_ID } from '$env/static/private';
import { CLIENT_SECRET } from '$env/static/private';

async function getToken() {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'client_credentials'
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
		}
	});

	return await response.json();
}

async function lookupSong(access_token: string, id: string) {
	const url = `https://api.spotify.com/v1/tracks/${encodeURIComponent(
		id
	)}?market=EE`
	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + access_token }
	});

	return await response.json();
}

export async function POST({ request }) {
	const { id } = await request.json();

	const token = await getToken().then((response) => response.access_token);
	const searchData = await lookupSong(token, id);
	return json({ searchData }, { status: 201 });
}
