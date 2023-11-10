<script lang="ts">
	import type { PageData } from './$types';

	export let data: Pagedata;
	$: ({ songs } = data);
</script>

<form action="?/addSong" method="post">
	<hgroup style="text-align: center; margin-block: 4rem;">
		<h3>Suggest a song</h3>
		<h4>
			Most of these will be played, but submission is not a guarantee that it will get played.
		</h4>
	</hgroup>
	<label for="title">Title</label>
	<input type="text" required id="title" name="title" />
	<label for="artist">Artist</label>
	<input type="text" required id="artist" name="artist" />
	<button type="submit">Submit</button>
</form>

<details style="margin-top: 6rem;">
	<summary role="button" class="contrast">Previous {songs.length} submissions</summary>
	<table>
		<thead>
			<tr>
				<th scope="col">Artist</th>
				<th scope="col">Title</th>
			</tr>
		</thead>
		<tbody>
			{#each songs as song}
				<tr>
					<td>{song.artist}</td>
					<td>{song.title}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</details>

<style global>
	div.app footer {
		display: none;
	}
</style>
