# monospac.ee ![Website](https://img.shields.io/website?url=https%3A%2F%2Fmonospac.ee) [![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)

Blog style website for the DJ duo monospacee.

## Features

- Blog posts generated from markdown
- Audio player with song timestamps read from .cue files
- Progress for each recording saved into Local Storage
- Keyboard controlls for playback and post filtration
- Programmatically generated OG (social preview) images
- Programmatically generated podcast RSS feed

## Tech Stack

**Frontend:** [SvelteKit](https://github.com/sveltejs/kit), [svelte-img](https://github.com/zerodevx/svelte-img), [TypeScript](https://github.com/microsoft/TypeScript), [Sass](https://github.com/sass/sass), [Pico Css](https://github.com/picocss/pico)

**OG img API:** [SvelteKit](https://github.com/sveltejs/kit), [sveltekit-og](https://github.com/etherCorps/sveltekit-og), [Satori](https://github.com/vercel/satori), [resvg-js](https://github.com/yisibl/resvg-js)

**.md posts** [MDsveX](https://github.com/pngwn/MDsveX), [remark](https://github.com/remarkjs/remark), [rehype](https://github.com/rehypejs/rehype), [Shiki](https://github.com/shikijs/shiki), [Curtail](https://github.com/Huluti/Curtail)

**Audio** [Mixxx](https://github.com/mixxxdj/mixxx), [Ear Tag](https://github.com/knuxify/eartag), [Deemix](https://www.reddit.com/r/deemix/)

**Deployment** [Docker](https://www.docker.com/), [Docker Compose](https://github.com/docker/compose)

## Run Locally

Clone the project

```bash
  git clone git@github.com:MihkelMK/monospacee.git
```

Go to the project directory

```bash
  cd monospacee
```

Install dependencies

```bash
  cd frontend && pnpm install
  cd og && pnpm install
```

Start the OG image API

```bash
  cd og
  pnpm dev
```

Start the website

```bash
  cd frontend
  pnpm dev
```

## Deployment

Deployment is handled with Docker Compose

In the project root, run

```bash
  docker compose up --build
```

This exposes the frontend on `localhost:9001` and the OG image API on `localhost:9002`.

## Roadmap

- Automate adding posts

- Livestream support ([Icecast](https://icecast.org/)?)

- Rewrite streaming progress code

  - Right now, switching recordings sometimes overwrites the next recordings progess with last recordings progress

- Keyboard shortcut cheatsheet/legend

- Move to selfhosted [Gitea](https://github.com/go-gitea/gitea) instance
  - Get SSH auth working

## Color Reference

| Color      | Hex                                                              |
| ---------- | ---------------------------------------------------------------- |
| Primary    | ![#a160cd](https://via.placeholder.com/10/a160cd?text=+) #a160cd |
| Secondary  | ![#75c6e6](https://via.placeholder.com/10/75c6e6?text=+) #75c6e6 |
| Contrast   | ![#e7eaee](https://via.placeholder.com/10/e7eaee?text=+) #e7eaee |
| Text       | ![#bdc3cb](https://via.placeholder.com/10/bdc3cb?text=+) #bdc3cb |
| Background | ![#14171c](https://via.placeholder.com/10/14171c?text=+) #14171c |

## Contributing

Found a bug or error on the site? Suggestion to improve some hacky code?

Contributions are always welcome!

See [`contributing.md`](./CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [`code of conduct`](./CODE_OF_CONDUCT.md).

## Authors

- [@mihkelmk](https://github.com/MihkelMK)
- [@riks-jogi](https://github.com/riks-jogi/jdots)
