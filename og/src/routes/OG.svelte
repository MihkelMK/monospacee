<script>
  /* @type {string} */
	export let title;
  /* @type {string} */
	export let postType;
  /* @type {string} */
	export let date;

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
	"
>
	<div
		style="
      font-size: 13rem;
      display: flex;
      color: #BDC3CB;
      letter-spacing: -0.025em;
      line-height: 1.75em;
		"
	>
		<span style="color: {accentColor}">monospacee</span>
		:
		<span style="color: {accentColorLow}; margin-left: 1em;"
			>~/{postType === 'main' ? '' : `${postType.toLowerCase()}s`}</span
		>
	</div>
	<div
		style="
      font-size: 22rem;
      font-weight: 700;
      background-image: linear-gradient(30deg, {accentColor}, {accentColorLow});
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.05em;
      line-height: 1.08em;
      margin-top: -0.15em;
		"
	>
		{title}
	</div>

	<div
		style="
		display: flex;
    position: absolute;
      letter-spacing: -0.025em;
    font-size: 18rem;
      color: #BDC3CB;
    bottom: 9rem;
  "
	>
		{date}
	</div>

	<span
		style="
    position: absolute;
    top: 9rem;
    left: 31%;
    gap: 0.1em;
    font-size: 26rem;

      font-weight: 700;
		color: {accentColorLow};
"
	>
		<span style="width: 0.5em;">[</span><!--
--><span style="width: 0.4em; font-size: 0.9em;">'</span
		><!--
--><span style="">-</span><!--
--><span style="width: 0.4em; font-size: 0.9em;">'</span
		><!--
--><span style="width: 0.5em;">]</span>
	</span>
</div>
