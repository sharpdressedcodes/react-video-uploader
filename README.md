# React Video Uploader

Upload videos in React with server-side rendering and NodeJS streaming.

This project uses [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
to generate preview thumbnails, gifs, posters and media info.

To get going, you can either use with or without docker.
If you use without docker, you'll need node, npm,
ffmpeg and either flvtool2 or flvmeta installed.
You can get away without having ffmpeg and either flvtool2 or flvmeta,
as long as you don't upload any files.

## Features

* Form validation on both client and server. Server also validates file headers.
* WebSockets used during file upload to provide status updates.
* Server-side rendering.
* NodeJS streaming. Full support for browsers, and opt out for bots, etc.
* Hot reloading.
* Code Splitting.
* Smooth page transitions in `React.lazy` and `React.Suspense` with `BrowserRouter`.
* Material-UI.
* SASS.
* Docker.
* Linting for TypeScript, JavaScript, SASS, MarkDown and Yaml.
* Dark mode support `@media (prefers-color-scheme: dark)` via sass mixin `@include prefers-dark-mode {}`.

## With docker

```shell
docker-compose up -d --build
```

then exec into the container:

```shell
docker exec -it node bash
```

Then continue on as normal

## With/Without docker

Install modules:

```shell
npm i
```

Build everything:

```shell
npm run build
```

Serve files from the `./build/` directory:

```shell
npm run start
```

Now open [http://localhost:3000/](http://localhost:3000/) in your browser.

## Development

### Watch mode (requires Node >=18)

```shell
npm run dev
```

### Non watch mode

```shell
npm run dev:no-watch
```

## Config

Config file is located in `./src/config/index.ts`.

## Tests

### Unit

```shell
npm test
```

### E2E

```shell
npm run test:e2e
```

OR

```shell
npm run test:e2e:ui
```

## Measuring Performance

To measure any of the supported metrics,
you need to pass a function into the `webVitals.callback` in `./src/config/index.ts`
and set `webVitals.callback` to `true`.

More info [here](https://www.npmjs.com/package/web-vitals)
and [here](https://create-react-app.dev/docs/measuring-performance/).

## TODO

* Cancel upload button
* Fix service worker issue in production.
