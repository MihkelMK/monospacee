export type Categories = 'dnb' | 'dj';

export type Post = {
	title: string;
	description: string;
	date: string;
	categories: Categories[];
	published: boolean;
};

export type Cue = {
	slug: string;
	songs: Song[];
  length: string;
  size: string
};

export type Song = {
	artist: string;
	title: string;
	start: number;
};
