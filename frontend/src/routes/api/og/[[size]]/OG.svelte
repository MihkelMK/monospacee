<script>
	import Kern from '$lib/components/Kern.svelte';

	/** @type {string} */
	export let postType;

	const accentColor =
		postType === 'main'
			? '#a160cd'
			: postType === 'event'
				? '#95d9f4'
				: postType === 'stream'
					? '#a160cd'
					: '#88898c';

	const accentColorLow =
		postType === 'main'
			? '#95d9f4'
			: postType === 'event'
				? '#bfe8f8'
				: postType === 'stream'
					? '#b480d7'
					: '#e7eaee';
</script>

<div
	style="
		height: 100%;
		width: 100%;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-wrap: nowrap;
    background-image: linear-gradient(30deg, #14171c, #1c2027);
	">
	<div
		style="
      font-size: 4rem;
      display: flex;
      color: #BDC3CB;
      letter-spacing: -0.025em;
      top: 17.5rem;
      position: absolute;
		">
		<span style="color: {accentColor}; font-weight: 700; margin-top: -0.15em;">monospacee</span>
		<span style="color: #BDC3CB; font-size: 3.5rem; margin-left: 0.25rem;">$</span>
	</div>
	<div
		style="
      font-size: 5rem;
      background-image: linear-gradient(30deg, {accentColor}, {accentColorLow});
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.05em;
      padding: 0 5rem;
      line-height: 1.08em;
      margin-top: 11rem;
		">
		~/{postType === 'main' ? '' : `${postType.toLowerCase()}s`}
	</div>
	<div
		style="
    position: absolute;
    top: 9rem;
    left: 50%;
    display: flex;
    transform: translate(-50%, 0);
    font-size: 5rem;
    font-weight: 700;
		color: {accentColorLow};
">
		<Kern og></Kern>
	</div>
</div>
