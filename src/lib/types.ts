export type Post = {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	duration?: string;
	type: PostType;
	published: boolean;
	audioSize: string;
};

export type Cue = {
	slug: string;
	songs: Song[];
	length?: string;
	size?: string;
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
	title?: string;
	link?: ImageLink;
};

export type ImageSrc = {
	format: string;
	width: number;
	height: number;
	src: string;
};

export type PostType = 'event' | 'project' | 'stream';

export type ImageLink = {
	href: string;
	text?: string;
};

export type SocialLink = {
	href: string;
	label?: string;
	icon: string;
};
