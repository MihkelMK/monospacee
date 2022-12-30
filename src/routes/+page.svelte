<script>
	import Console from './Console.svelte';
	import Kern from './Kern.svelte';

	let kernSilm = 0;
	let kernSuu = '-';

	/**
	 * @param {{ (e: MouseEvent): void; apply?: any; }} func
	 * @param {number} duration
	 */
	function throttle(func, duration) {
		let shouldWait = false;

		return function (/** @type {any[]} */ ...args) {
			if (!shouldWait) {
				// @ts-ignore
				func.apply(this, args);

				shouldWait = true;

				setTimeout(function () {
					shouldWait = false;
				}, duration);
			}
		};
	}

	const arvutaNurk = (
		/** @type {number} */ cx,
		/** @type {number} */ cy,
		/** @type {number} */ ex,
		/** @type {number} */ ey
	) => {
		const dy = ey - cy;
		const dx = ex - cx;
		const rad = Math.atan2(dy, dx); // (-Pie, Pie]
		const deg = (rad * 180) / Math.PI; // rads to degs, (-180, 180]
		return deg;
	};

	const muudaSuud = (/** @type {MouseEvent} */ e) => {
		// @ts-ignore
		if (e.target.localName == 'a') {
			kernSuu = '。';
		} else kernSuu = '-';
	};

	const liigutaSilmi = (/** @type {MouseEvent} */ e) => {
		const hiirX = e.clientX;
		const hiirY = e.clientY;

		// @ts-ignore
		const rect = document.querySelector('h1').getBoundingClientRect();
		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = arvutaNurk(hiirX, hiirY, ankurX, ankury) + 90;
		kernSilm = Math.round(nurk / 30) * 30;
	};
</script>

<svelte:head>
	<title>monospacee</title>
	<meta name="description" content="SoonTM to a terminal near you" />
</svelte:head>

<section
	on:mousemove={liigutaSilmi}
	on:mousemove={throttle(function (e) {
		muudaSuud(e);
	}, 100)}
>
	<Kern silmaNurk={kernSilm} suu={kernSuu} />
	<Console />
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		margin-top: 5vh;
	}
</style>
