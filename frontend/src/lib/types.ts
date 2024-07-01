export type Post = {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	duration?: string;
	type: PostEvent;
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
	title?: string;
	link?: ImageLink;
};

export type ImageSrcObject = {
  img: ImageSrc,
  sources: Record<string, ImageSrc>
};

export type ImageSrc = {
  src: string;
  w: number;
  h?: number;
}

export type PostEvent = 'event' | 'project' | 'stream';

export type ImageLink = {
	href: string;
	text?: string;
};

export type SocialLink = {
	href: string;
	label?: string;
	icon: string;
};

export type SpotifySearchResult = {
	album: SpotifyAlbum;
	artists: SpotifyArtist[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: SpotifyExternalIDS;
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	is_playable: boolean;
	name: string;
	popularity: number;
	preview_url: null | string;
	track_number: number;
	type: string;
	uri: string;
};

export type SpotifyAlbum = {
	album_type: string;
	artists: SpotifyArtist[];
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	images: SpotifyImage[];
	is_playable: boolean;
	name: string;
	release_date: Date;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
};

export type SpotifyArtist = {
	external_urls: SpotifyExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

export type SpotifyExternalUrls = {
	spotify: string;
};

export type SpotifyImage = {
	height: number;
	url: string;
	width: number;
};

export type SpotifyExternalIDS = {
	isrc: string;
};
