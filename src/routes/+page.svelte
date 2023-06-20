<script>
	import EventSplit from '$lib/components/EventSplit.svelte';
	import * as config from '$lib/config';
	import Img from '@zerodevx/svelte-img';

	import tehnoparunImg from '$lib/assets/KRNX_tehnoparun_27mai2023_49.jpg?run';
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content={config.description} />
	<meta property="og:description" content={config.description} />
	<meta property="og:url" content={config.url} />
	<meta property="og:site_name" content={config.site_name} />
</svelte:head>

<header>
	<hgroup>
		<h1>



			monospacee
			<ul>
				<li>
					<a href="https://www.instagram.com/mono_spacee/">
						<iconify-icon inline icon="mdi:instagram" />
					</a>
				</li>
				<li>
					<a href="https://www.youtube.com/@monospacee/streams">
						<iconify-icon inline icon="mdi:youtube" />
					</a>
				</li>
				<li>
					<a href="https://soundcloud.com/monospacee">
						<iconify-icon inline icon="mdi:soundcloud" />
					</a>
				</li>
			</ul>
		</h1>
		<h2>GPLv3 litsensiga DJ duo, kelle kerning sobib igale žanrile.</h2>
	</hgroup>
</header>

<main class="grid">
	<EventSplit title="Just nii, oo Tehnoparun" date="2023-05-27">
		<Img
			loading="eager"
			class="better-blur"
			src={tehnoparunImg}
			alt="Picture of a DJ wearing a gas mask. He is performing in an underground club. The stage is colored by pastel pink and blue."
		/>
	</EventSplit>
</main>

<style lang="scss">
	header {
		hgroup {
			text-align: center;
			width: fit-content;
			margin-inline: auto;
			margin-bottom: calc(var(--block-spacing-vertical) * 3);
			h1 {
				color: var(--primary);
				margin-bottom: var(--nav-element-spacing-vertical);
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
			}
			h2 {
				color: var(--h2-color);
				max-width: 65ch;
			}
		}
	}
</style>
