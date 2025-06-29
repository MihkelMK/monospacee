<script lang="ts">
	import * as config from '$lib/config';
	import { keybind } from '$lib/utils';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Post, PostType } from '$lib/types';
	import ArticleList from '$lib/components/ArticleList.svelte';
	import { postFeed, visiblePostTypes } from '$lib/store.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import Socials from '$lib/components/Socials.svelte';
	import type { PageServerData } from './$types';
	import { getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
	let loading = $state(true);

	const INITIAL_POSTS = 1;

	let nextFrom = data?.nextFrom ?? null;
	postFeed.setPosts(data.posts);

	let limit = $state(INITIAL_POSTS);

	function morePostsAvailable() {
		return limit < postFeed.posts.length || nextFrom;
	}

	function toggleVisible(type: PostType) {
		if ($visiblePostTypes.includes(type))
			$visiblePostTypes = $visiblePostTypes.filter((t) => t !== type);
		else visiblePostTypes.set([...$visiblePostTypes, type]);
	}

	let footer: HTMLElement | undefined = $state();

	onMount(() => {
		if (browser) {
			const handleIntersect = (
				entries: IntersectionObserverEntry[],
				observer: IntersectionObserver
			) => {
				entries.forEach((entry) => {
					if (!morePostsAvailable()) {
						observer.unobserve(entry.target);
					}

					showMorePosts();
				});
			};

			const options = { threshold: 0.4, rootMargin: '-100% 0% 100%' };

			const observer = new IntersectionObserver(handleIntersect, options);

			if (footer) {
				observer.observe(footer);
			}
			loading = false;
		}
	});

	async function showMorePosts() {
		try {
			const newLimit = limit + 1;

			if (newLimit <= postFeed.posts.length) {
				limit = newLimit;
			} else if (nextFrom) {
				loading = true;
				const response = await fetch(`/api/posts?start=${nextFrom}&end=10&lang=${getLocale()}`, {
					method: 'GET',
					credentials: 'same-origin'
				});

				const newData = await response.json();

				const newFeed: Post[] = newData.posts;
				const newNext = newData.nextFrom;

				postFeed.addPosts(newFeed);

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
	}} />

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
	}} />

<header>
	<hgroup>
		<h1 class="glow-sm">monospacee</h1>
		<Socials class="landing" data={config.socials} />
		<h2 class="glow glow-sm contrast" style="margin-top: var(--typography-spacing-top)">
			{m['landing.subtitle']()}
		</h2>
	</hgroup>
</header>

<main>
	<section class="feed">
		<h3 class="glow-sm contrast">⇣ Posts ⇣</h3>
		<fieldset>
			<label
				for="eventSwitch"
				class={`${$visiblePostTypes.includes('event') ? 'glow-sm secondary' : ''}`}>
				<input
					bind:group={$visiblePostTypes}
					value="event"
					type="checkbox"
					id="eventSwitch"
					name="postTypes"
					role="switch" />
				<span style="font-size: 0;">
					<span
						style="font-size: initial;"
						class={`${$visiblePostTypes.includes('event') ? 'glow secondary' : ''}`}>
						[E]
					</span>
					<span style="font-size: initial;">vents</span>
				</span>
			</label>
			<label
				for="projectSwitch"
				class={`${$visiblePostTypes.includes('project') ? 'glow-sm contrast' : ''}`}>
				<input
					bind:group={$visiblePostTypes}
					value="project"
					type="checkbox"
					id="projectSwitch"
					name="postTypes"
					role="switch" />
				<span style="font-size: 0;">
					<span
						style="font-size: initial;"
						class={`${$visiblePostTypes.includes('project') ? 'glow contrast' : ''}`}>
						[P]
					</span>
					<span style="font-size: initial;">rojects</span>
				</span>
			</label>
			<label
				for="streamSwitch"
				class={`${$visiblePostTypes.includes('stream') ? 'glow-sm primary' : ''}`}>
				<input
					bind:group={$visiblePostTypes}
					value="stream"
					type="checkbox"
					id="streamSwitch"
					name="postTypes"
					role="switch" />
				<span style="font-size: 0;">
					<span
						style="font-size: initial;"
						class={`${$visiblePostTypes.includes('stream') ? 'glow primary' : ''}`}>
						[S]
					</span>
					<span style="font-size: initial;">treams</span>
				</span>
			</label>
		</fieldset>
	</section>
	<section class="feed">
		{#if postFeed.posts}
			<ArticleList posts={postFeed.posts.slice(0, limit)} />
		{:else}
			<article class="post" aria-busy="true"></article>
		{/if}
		{#if loading}
			<article class="post" aria-busy="true"></article>
		{/if}
	</section>
</main>

<footer bind:this={footer}></footer>

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
				margin-bottom: calc(var(--nav-element-spacing-vertical) / 4);
			}
		}
	}

	main {
		min-height: 20dvh;
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
		width: min(90%, 45rem);
		margin-inline: auto;

		label {
			span {
				--accent-color: var(--muted-color);

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

		#projectSwitch {
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
