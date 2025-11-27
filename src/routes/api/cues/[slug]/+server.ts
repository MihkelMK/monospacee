import { json, error } from '@sveltejs/kit';
import type { Song } from '$lib/types';
import type { Cue } from '$lib/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

function timecodeToSeconds(timecode: string | undefined) {
	if (!timecode) return null;

	const splits = timecode.split(':');

	const minutes = Number(splits.at(0));
	const seconds = Number(splits.at(1));

	return seconds + minutes * 60;
}

function parseCue(cueFile: string) {
	const slug = cueFile.match('FILE ".*" WAVE')?.at(0)?.split('"').at(1) as string;
	const songData = cueFile
		.split('TRACK')
		.slice(1)
		.map((song) =>
			song
				.split('\n')
				.slice(1, -1)
				.map((line) =>
					line.includes('"')
						? line.split('"').at(1)
						: timecodeToSeconds(line.match('[0-9]+:[0-9]+:[0-9]+')?.at(0))
				)
		);

	const songs: Song[] = songData.map((song) => ({
		title: song.at(0) as string,
		artist: song.at(1) as string,
		start: song.at(2) as number
	}));

	const cue: Cue = { slug, songs };
	return cue;
}

export async function GET({ params, setHeaders }) {
	setHeaders({
		'cache-control': 'public, immutable, no-transform, max-age=3600'
	});

	try {
		const cuePath = join(process.cwd(), 'build/client/recordings', params.slug);
		const cueBody = await readFile(cuePath, 'utf-8');

		const parsedCue: Cue = parseCue(cueBody);
		return json(parsedCue);
	} catch (err) {
		throw error(404, 'Cue file not found');
	}
}
