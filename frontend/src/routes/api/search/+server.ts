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

async function search(access_token: string, title: string, artist: string, offset: number) {
	const url = `https://api.spotify.com/v1/search?q=remaster%2520track:${encodeURIComponent(
		title
	)}$2520artist:${encodeURIComponent(
		artist
	)}&type=track&market=EE&limit=5&offset=${offset}&include_external=audio`;

	const response = await fetch(url, {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + access_token }
	});

	return await response.json();
}

export async function POST({ request }) {
	const { title, artist, offset } = await request.json();

	const token = await getToken().then((response) => response.access_token);
	const searchData = await search(token, title, artist, offset);
	return json({ searchData }, { status: 201 });
}
