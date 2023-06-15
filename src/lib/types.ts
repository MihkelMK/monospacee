export type Categories = 'dnb' | 'dj';

export type Post = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: Categories[];
	published: boolean;
	cue: string[][];
};
