import { json } from '@sveltejs/kit';
import { Song } from '$lib/types';
import { Cue } from '$lib/types';

function timecodeToSeconds(timecode: string | undefined) {
	if (!timecode) return null;

	const splits = timecode.split(':');

	const minutes = Number(splits.at(0));
	const seconds = Number(splits.at(1));

	return seconds + minutes * 60;
}

async function parseCue(cueFile: string) {
	const slug = cueFile.match('FILE ".*" WAVE')?.at(0)?.split('"').at(1);
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
		title: song.at(0),
		artist: song.at(1),
		start: song.at(2)
	}));

	const cue: Cue = { slug, songs };
	return cue;
}

export async function GET({ params, setHeaders }) {
	setHeaders({
		'cache-control': 'max-age=60'
	});

	const file = `/static/recordings/${params.slug}`;
	const cues = import.meta.glob('/static/recordings/*.cue', { as: 'raw' });
	const cueStream = cues[file];
	const cueBody = await cueStream();

	const parsedCue: Cue = await parseCue(cueBody);
	return json(parsedCue);
}
