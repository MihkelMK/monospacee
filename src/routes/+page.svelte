<script>
	import ThemePicker from './ThemePicker.svelte';
	import Kern from './Kern.svelte';
	import Console from './Console.svelte';

	const consoleTargetRegex = new RegExp('.*console.*');
	const outputTargetRegex = new RegExp('.*output.*');
	const commandTargetRegex = new RegExp('.*command.*');

	let kernSilmNurk = 0;
	let silmadPaigal = false;
	let kernSilmV = "'";
	let kernSilmP = "'";
	let kernSuu = '◡';

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
		if (
			// @ts-ignore
			consoleTargetRegex.test(e.target.className) ||
			// @ts-ignore
			outputTargetRegex.test(e.target.className) ||
			// @ts-ignore
			commandTargetRegex.test(e.target.className)
		) {
			kernSuu = 'ₒ';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
			// @ts-ignore
		} else if (e.target.localName == 'select' || e.target.localName == 'option') {
			kernSuu = '◡';
			kernSilmV = "˶'";
			kernSilmP = "'˶";
			silmadPaigal = true;
			kernSilmNurk = 0;
		} else {
			kernSuu = '◡';
			kernSilmV = "'";
			kernSilmP = "'";
			silmadPaigal = false;
		}
	};

	const liigutaSilmi = (/** @type {MouseEvent} */ e) => {
		if (silmadPaigal) return;
		const hiirX = e.clientX;
		const hiirY = e.clientY;

		// @ts-ignore
		const rect = document.querySelector('h1').getBoundingClientRect();
		const ankurX = rect.left + rect.width / 2;
		const ankury = rect.top + rect.height / 2;

		const nurk = arvutaNurk(hiirX, hiirY, ankurX, ankury) + 90;
		kernSilmNurk = Math.round(nurk / 30) * 30;
	};
</script>

<svelte:head>
	<title>monospacee</title>
	<meta name="description" content="SoonTM to a terminal near you" />
</svelte:head>

<div
	class="wrapper"
	on:mousemove={liigutaSilmi}
	on:mousemove={throttle(function (e) {
		muudaSuud(e);
	}, 100)}
>
	<ThemePicker />
	<section>
		<Kern silmaNurk={kernSilmNurk} vasakSilm={kernSilmV} paremSilm={kernSilmP} suu={kernSuu} />
		<Console />
	</section>
</div>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	div.wrapper {
		display: flex;
		flex-direction: column;
		row-gap: clamp(1rem, 4vh, 3rem);
	}
</style>
