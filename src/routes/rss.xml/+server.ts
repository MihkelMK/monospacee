import * as config from '$lib/config';
import type { Post } from '$lib/types';

export async function GET({ fetch }) {
	const response = await fetch('api/posts');
	const posts: Post[] = await response.json();

	const headers = { 'Content-Type': 'application/xml' };

	const xml = `
    <?xml version="1.0" encoding="UTF-8"?><rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
			<channel>
				<title>${config.title}</title>
        <googleplay:author>${config.author}</googleplay:author>
				<description>${config.description}</description>
        <googleplay:category text="Music"/>
        <language>et</language>
				<link>${config.url}</link>
				<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${posts
					.map(
						(post) => `
						<item>
							<title>${post.title}</title>
							<description>${post.description}</description>
							<link>${config.url}/${post.date}</link>
              <itunes:image href="${encodeURI(
			`${config.url}/api/og/?date=${post.date}&title=${post.title}&type=${post.type}`
		)
}"}/>
              <enclosure url="${config.url}/recordings/${post.date}.mp3" type="audio/mpeg" length="${
								post.audioSize
							}"/>
							<guid isPermaLink="true">${config.url}/${post.date}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
              <itunes:duration>${post.duration}</itunes:duration>
						</item>
					`
					)
					.join('')}
			</channel>
		</rss>
	`.trim();

	return new Response(xml, { headers });
}
