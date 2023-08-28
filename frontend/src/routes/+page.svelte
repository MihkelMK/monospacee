<script lang="ts">
	import * as config from '$lib/config';
	import { keybind } from '$lib/utils';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import ArticleList from '$lib/components/ArticleList.svelte';
	import { feed, visiblePostTypes } from './store.js';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
	let loading = true;

	const INITIAL_POSTS = 1;

	let nextFrom = data?.nextFrom ?? null;
	feed.set(data.posts);

	let limit = INITIAL_POSTS;

	function morePostsAvailable() {
		return limit < $feed.length || nextFrom;
	}

	function toggleVisible(type: string) {
		if ($visiblePostTypes.includes(type))
			$visiblePostTypes = $visiblePostTypes.filter((t) => t !== type);
		else visiblePostTypes.set([...$visiblePostTypes, type]);
	}

	let footer: HTMLElement;

	onMount(() => {
		if (browser) {
			const handleIntersect = (entries: any[], observer: IntersectionObserver) => {
				entries.forEach((entry) => {
					if (!morePostsAvailable()) {
						observer.unobserve(entry.target);
					}

					showMorePosts();
				});
			};

			const options = { threshold: 0.4, rootMargin: '-100% 0% 100%' };

			const observer = new IntersectionObserver(handleIntersect, options);

			observer.observe(footer);
			loading = false;
		}
	});

	$: showMorePosts;

	async function showMorePosts() {
		try {
			const newLimit = limit + 1;

			if (newLimit <= $feed.length) {
				limit = newLimit;
			} else if (nextFrom) {
				loading = true;
				const response = await fetch(`/api/posts?start=${nextFrom}&end=10`, {
					method: 'GET',
					credentials: 'same-origin'
				});

				const newData = await response.json();

				const newFeed: Post[] = newData.posts;
				const newNext = newData.nextFrom;

				feed.set([...$feed, ...newFeed]);

				nextFrom = newNext ?? null;

				limit = newLimit;
				loading = false;
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<MetaTags
	title="Welcome"
	titleTemplate={'%s | ' + config.title}
	description={config.description}
	canonical={config.url + '/'}
	openGraph={{
		url: config.url + '/',
		title: 'Welcome | ' + config.title,
		description: config.description,
		type: 'website',
		locale: 'et_EE',
		images: [
			{
				url: encodeURI(`${config.ogUrl}/?title=${config.description.split('.')[0]}&type=main`),
				secureUrl: encodeURI(
					`${config.ogUrl}/?title=${config.description.split('.')[0]}&type=main`
				),
				width: 1200,
				height: 630,
				alt: 'A graphic design introducing the landing page of by the DJ duo, monospacee.',
				type: 'image/png'
			}
		],
    		siteName: config.site_name

	}}
	twitter={{
		cardType: 'summary',
		title: config.title,
		description: config.description,
		image: encodeURI(`${config.ogUrl}/?title=${config.description.split('.')[0]}&type=main`),
		imageAlt: 'A graphic design introducing the landing page of by the DJ duo, monospacee.'
	}}
/>

<svelte:window
	use:keybind={{
		binds: ['Control', 'p'],
		on_bind: () => toggleVisible('project')
	}}
	use:keybind={{
		binds: ['Control', 'e'],
		on_bind: () => toggleVisible('event')
	}}
	use:keybind={{
		binds: ['Control', 's'],
		on_bind: () => toggleVisible('stream')
	}}
/>

<header>
	<hgroup>
		<h1 class="glow-sm">
			<span> monospacee </span>
			<ul>
				<li>
					<a href="https://soundcloud.com/monospacee" aria-label="our soundcloud">
						<iconify-icon inline icon="mdi:soundcloud" />
					</a>
				</li>
				<li>
					<a href="https://www.youtube.com/@monospacee/streams" aria-label="our youtube">
						<iconify-icon inline icon="mdi:youtube" />
					</a>
				</li>
				<!-- 				<li>
					<a href="https://github.com/MihkelMK/monospacee">
						<iconify-icon inline={true} icon="mdi:github" />
					</a>
				</li> -->
				<li>
					<a
						target="_blank"
						referrerpolicy="no-referrer"
						href={`${config.url}/rss.xml`}
						aria-label="our rss feed"
					>
						<iconify-icon inline icon="mdi:rss-box" />
					</a>
				</li>
			</ul>
		</h1>
		<h2 class="glow glow-sm contrast">
			GPLv3 litsensiga DJ duo, kelle kerning sobib igale žanrile.
		</h2>
	</hgroup>
</header>

<main>
	<section class="feed">
		<h3 class="glow-sm contrast">⇣ Posts ⇣</h3>
		<fieldset>
			<label
				for="projectSwitch"
				class={`${$visiblePostTypes.includes('project') ? 'glow-sm' : ''}`}
			>
				<input
					bind:group={$visiblePostTypes}
					value="project"
					type="checkbox"
					id="projectSwitch"
					name="postTypes"
					role="switch"
				/>
				<span class={`${$visiblePostTypes.includes('project') ? 'glow primary' : ''}`}>[P]</span
				>rojects
			</label>
			<label
				for="eventSwitch"
				class={`${$visiblePostTypes.includes('event') ? 'glow-sm secondary' : ''}`}
			>
				<input
					bind:group={$visiblePostTypes}
					value="event"
					type="checkbox"
					id="eventSwitch"
					name="postTypes"
					role="switch"
				/>
				<span class={`${$visiblePostTypes.includes('event') ? 'glow secondary' : ''}`}>[E]</span
				>vents
			</label>
			<label
				for="streamSwitch"
				class={`${$visiblePostTypes.includes('stream') ? 'glow-sm contrast' : ''}`}
			>
				<input
					bind:group={$visiblePostTypes}
					value="stream"
					type="checkbox"
					id="streamSwitch"
					name="postTypes"
					role="switch"
				/>
				<span class={`${$visiblePostTypes.includes('stream') ? 'glow contrast' : ''}`}>[S]</span
				>reams
			</label>
		</fieldset>
		{#if $feed}
			<ArticleList posts={$feed.slice(0, limit)} />
		{:else}
			<article class="post" aria-busy="true" />
		{/if}
		{#if loading}
			<article class="post" aria-busy="true" />
		{/if}
	</section>
</main>

<footer bind:this={footer} />

<style lang="scss">
	header {
		display: grid;
		place-content: center;
		height: calc(71vh - var(--nav-element-spacing-vertical) - var(--block-spacing-vertical));
		hgroup {
			text-align: center;
			width: fit-content;

			h1 {
				color: var(--primary);
				margin-bottom: var(--nav-element-spacing-vertical);
			}
			ul {
				display: inline;
				margin-bottom: 0;
				padding-left: 0;
				font-size: 0.75em;
			}
			li {
				display: inline;
				margin-bottom: 0;
			}
			h2 {
				color: var(--h2-color);
				max-width: 65ch;
			}

			@media screen and (max-width: 768px) {
				span {
					margin-bottom: var(--typography-spacing-vertical);
				}

				ul {
					display: block;
				}
			}
		}
	}

	footer {
		display: flex;
		justify-content: center;
	}

	h3 {
		text-align: center;
	}

	fieldset {
		display: flex;
		justify-content: space-evenly;
		color: var(--contrast);

		label {
			span {
				--accent-color: var(--muted-color);
				transition: color var(--transition);

				&.secondary {
					--accent-color: var(--secondary);
				}
				&.contrast {
					--accent-color: var(--color);
				}
				&.primary {
					--accent-color: var(--primary);
				}
				color: var(--accent-color);
			}
		}

		#streamSwitch {
			--switch-checked-background-color: var(--muted-color);
		}

		#eventSwitch {
			--switch-checked-background-color: color-mix(in srgb, var(--secondary) 85%, #000);
		}

		@media screen and (max-width: 768px) {
			label {
				display: grid;
				place-items: center;
				gap: 0.75rem 0;
			}
			input {
				grid-column: span 2;
				margin: 0;
				grid-row: 2;
			}
		}
	}
</style>
