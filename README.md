# React Video Uploader

This project uses [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) to generate preview thumbnails, gifs, posters and media info.

To get going, you can either use with or without docker.
If you use without docker, you'll need node, npm, ffmpeg and either flvtool2 or flvmeta installed.
You can get away without having ffmpeg and either flvtool2 or flvmeta, as long as you don't upload any files.

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

Until we update material-ui, there may be an error when running `npm i`:

In this case, try running:

```shell
npm i --legacy-peer-deps
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

## Config

Config file is located in `./src/config/index.js`. Change any values in here as you see fit. Don't forget to rebuild the project afterwards.

## Tests

### Unit

```shell
npm test
```

### E2E

Cypress will set a cookie `IS_TESTING = 1` before each test. The config will then be loaded based on this value, either normal or test config.
You will need to start the server first:

```shell
npm run build && npm run start
```

Then run the tests:

```shell
npm run test:e2e
```

#### TODO

* Get unit tests working
* Get cypress tests working
* Redux slices?
* Render to node stream
* service worker, web worker?
* manifest
* i18n https://www.i18next.com/ https://locize.com/blog/react-i18next/ https://phrase.com/blog/posts/localizing-react-apps-with-i18next/ https://lokalise.com/blog/react-i18n-intl/
* swap express for fastify
* Try using a nodejs worker thread for converting video
* add websocket ping for server and client
* Video player instead of html player https://www.google.com/search?q=video+js+react
* CRUD videos
* Authenticating the user before allowing to CUD (create, update, delete)
* Split up js and css + hot reloading/watch
* Stub the api return calls during `IS_TESTING`, then assert on the items in TeaserList in HomePage
* Drag and drop
* TypeScript
* React suspense
* Lazy load images on home page
* a11y
* BEM
* Update material ui to https://mui.com/material-ui/getting-started/installation/
* Turn components into functions
