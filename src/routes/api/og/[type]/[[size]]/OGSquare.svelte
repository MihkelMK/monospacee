<script>
  import Kern from '#lib/components/Kern.svelte';

  /** @type {string} */
  export let postType;
  const accents = new Map([
    ['main', ['#a160cd', '#95d9f4']],
    ['event', ['#95d9f4', '#bfe8f8']],
    ['stream', ['#a160cd', '#b480d7']],
  ]);
  const [accentColor, accentColorLow] = accents.get(postType) ?? ['#88898c', '#e7eaee'];
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
      font-size: 18rem;
      display: flex;
      color: #BDC3CB;
      letter-spacing: -0.025em;
      line-height: 1.75em;
      margin-top: 35rem;
		">
    <span style="color: {accentColor}; margin-top: -3rem;">monospacee</span>
    <span style="font-size:16rem; margin-left: 2rem">$</span>
  </div>
  <div
    style="
      font-size: 26rem;
      font-weight: 700;
      background-image: linear-gradient(30deg, {accentColor}, {accentColorLow});
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.05em;
      line-height: 1em;
      margin-top: -8rem;
		">
    ~/{postType === 'main' ? '' : `${postType.toLowerCase()}s`}
  </div>

  <div
    style="
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    transform: translate(-50%, -125%);
    font-size: 18rem;
    font-weight: 700;
		color: {accentColorLow};
">
    <Kern og></Kern>
  </div>
</div>
