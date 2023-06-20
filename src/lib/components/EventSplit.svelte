<script lang="ts">
	export let title: string;
	export let date: string;
</script>

<section>
	<div class="image">
		<slot />
	</div>
	<hgroup>
		<h2>{title}</h2>
		<h3>{date}</h3>
	</hgroup>
</section>

<style lang="scss">
	section {
		display: grid;
		place-items: center;
		gap: 0 1rem;
		--_titleColor: var(--secondary);

		&:nth-of-type(2n) {
			--_titleColor: var(--primary);
		}

		hgroup {
			grid-area: 1/1/2/2;
			text-align: center;
			transition: opacity var(--transition-slow);

			h2 {
				color: var(--_titleColor);
				line-height: 1.3;
			}

			h3 {
				color: var(--contrast);
			}
		}

		.image {
			z-index: -1;
			grid-area: 1/1/2/2;
			border-radius: calc(var(--border-radius) * 2);
			box-shadow: var(--card-box-shadow);
			overflow: hidden;
			object-fit: cover;
			aspect-ratio: 1/1;
			height: 100%;

			:global(img),
			:global(picture) {
				filter: opacity(0.8) brightness(0.9) saturate(0.6) blur(1px);
				transition: scale var(--transition-slow), filter var(--transition-slow);
				object-fit: cover;
				height: 100%;
				aspect-ratio: 1/1;
			}
		}

		&:hover,
		&:focus-within,
		&:active {
			hgroup {
				opacity: 0;
			}

			.image {
				:global(img),
				:global(picture) {
					filter: none;
					scale: 1.05;
				}
			}
		}
	}
</style>
