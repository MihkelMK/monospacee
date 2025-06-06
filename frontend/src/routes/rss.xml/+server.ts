import * as config from '$lib/config';
import type { Post } from '$lib/types';
import { escape } from 'html-escaper';

export async function GET({ fetch }) {
	const response = await fetch('/api/posts');
	const { posts }: { posts: Post[] } = await response.json();

	const headers = {
		'Content-Type': 'application/xml',
		'Cache-Control': 'public, immutable, no-transform, max-age=3600'
	};

	const xml = `
    <?xml version="1.0" encoding="UTF-8"?><rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
			<channel>
				<title>${config.title}</title>
        <googleplay:author>${config.author}</googleplay:author>
				<description>${config.description}</description>
				<copyright>&#169; ${new Date().getFullYear()} ${config.author}</copyright>
        <googleplay:category text="Music"/>
				<itunes:category text="Music"/>
				<itunes:explicit>yes</itunes:explicit>
				<itunes:author>${config.author}</itunes:author>
				<itunes:owner>
					<itunes:name>${config.author}</itunes:name>
					<itunes:email>${config.author}@kasterpalu.ee</itunes:email>
				</itunes:owner>
				<itunes:type>episodic</itunes:type>
				<itunes:image href="${escape(
					encodeURI(`${config.ogUrl}/big?title=${config.description.split('.')[0]}&type=main`)
				)}"/>
				<image>
					<url>
						${escape(encodeURI(`${config.ogUrl}/big?title=${config.description.split('.')[0]}&type=main`))}
					</url>
					<title>${config.title}</title>
					<link>${config.url}</link>
				</image>
				<content:encoded>
					<p>${config.description}</p>
				</content:encoded>
				<language>et</language>
				<link>${config.url}</link>
				<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${posts
					.filter((post: Post) => post.duration)
					.map(
						(post: Post) => `
						<item>
							<itunes:episodeType>full</itunes:episodeType>
							<title>${escape(post.title)}</title>
							<description>${escape(post.description)}</description>
							<link>${config.url}/${post.date}</link>
							<itunes:summary>${escape(post.description)}</itunes:summary>
							<itunes:image href="${escape(
								encodeURI(
									`${config.ogUrl}/big?date=${post.date}&title=${post.title}&type=${post.type}`
								)
							)}"/>
              				<enclosure url="${config.url}/recordings/${
												post.date
											}.mp3" type="audio/mpeg" length="${post.audioSize}"/>
							<guid isPermaLink="false">${config.url}/${post.date}</guid>
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
