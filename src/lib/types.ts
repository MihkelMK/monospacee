export type Post = {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	duration?: string;
	type: 'event' | 'project' | 'stream';
	published: boolean;
};

export type Cue = {
	slug: string;
	songs: Song[];
	length: string;
	size: string;
};

export type Song = {
	artist: string;
	title: string;
	start: number;
};

export type RecordingData = {
	title?: string;
	progress: number;
	duration?: number;
};

export type ImageInfo = {
	src: ImageSrc[];
	loading?: 'lazy' | 'eager';
	alt: string;
};

export type ImageSrc = {
	format: string;
	width: number;
	height: number;
	src: string;
};

export type PostEvent = Pick<Post, 'type'>;
