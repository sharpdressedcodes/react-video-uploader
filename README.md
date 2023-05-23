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
* Docker.
* Linting for JS, styles, MarkDown and Yaml.
* Material-UI.
* SASS.
* Dark mode support `@media (prefers-color-scheme: dark)` via sass mixin `@include prefers-dark-mode() {}`.

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

Config file is located in `./src/config/index.js`.
This file gets converted to `commonjs-static` which means it can then be called from
both commonjs and ESM.

## Common

Files inside `./src/common/index.js` get converted to `commonjs-static` as `./src/common/index.cjs`
which means they can be called from both commonjs and ESM.
This also happens with `./src/routes/paths.js`

## Tests

### Unit

```shell
npm test
```

### E2E

Cypress will set a cookie `IS_TESTING = 1` before each test.
The config will then be loaded based on this value, either normal or test config.

```shell
npm run test:e2e
```

If Cypress complains about not being installed properly,
run this (the foreground-scripts arg will show hidden Cypress output):

```shell
rm -rf node_modules package-lock.json ./cypress-cache/Cypress ./cypress-cache/mesa_shader_cache
npm cache clean -f
npm i --legacy-peer-deps --foreground-scripts
```

## Measuring Performance

To measure any of the supported metrics,
you need to pass a function into the `webVitals.callback` in `./src/config/index.js`
and set `webVitals.callback` to `true`.

More info [here](https://www.npmjs.com/package/web-vitals)
and [here](https://create-react-app.dev/docs/measuring-performance/).

## TODO

* Get cypress tests working in pipeline (was getting address in use error)
* i18n
  * https://www.i18next.com/
  * https://locize.com/blog/react-i18next/
  * https://phrase.com/blog/posts/localizing-react-apps-with-i18next/
  * https://lokalise.com/blog/react-i18n-intl/
  * https://github.com/privatenumber/webpack-localize-assets-plugin
* add websocket ping for server and client
* Video player instead of html player https://www.google.com/search?q=video+js+react
* CRUD videos
* Authenticating the user before allowing to CUD (create, update, delete)
* Stub the api return calls during `IS_TESTING`, then assert on the items in TeaserList in HomePage
* Drag and drop
* TypeScript
* a11y
* BEM
