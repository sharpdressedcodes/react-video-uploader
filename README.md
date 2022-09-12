# React Video Uploader

This project uses [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) to generate preview thumbnails, gifs, posters and media info.

To get going, you can either use with or without docker.
If you use without docker, you'll need node, npm, cypress, ffmpeg, ffprobe and either flvtool2 or flvmeta installed. You can get away without having ffmpeg, ffprobe and either flvtool2 or flvmeta, as long as you don't upload any files. You can also get away without having Cypress, as long as you dont run any functional tests.


## With docker
```shell script
docker-compose up -d --build
```

then exec into the container:
```shell script
docker exec -it node bash
```

Then continue on as normal

Install modules:
```
npm i
```

Build everything:
```
npm run build
```

Serve files from the `./build/` directory:
```shell script
npm run start
```
Now open [http://localhost:3000/](http://localhost:3000/) in your browser.

## Config
Config file is located in `./src/config/index.js`. Change any values in here as you see fit. Don't forget to rebuild the project afterwards.

## Tests
#### Unit
```shell script
npm test
```

##### Functional
Cypress will set a cookie `IS_TESTING = 1` before each test. The config will then be loaded based on this value, either normal or test config.

2 choices here. Either install Cypress locally (this will happen if you have node/npm locally), or run the docker image, which is just over 1GB.

Locally:
```
npm run test:functional
```

With docker:
```
docker run --rm --tty --name cypress --volume $PWD/:/home/node/app --workdir /home/node/app --network host -e DISPLAY= -e CYPRESS_BASE_URL='http://172.17.0.1:3000/' sharpdressedcodes/node:10.16.3-stretch-slim-cypress-3.4.1 npm run test:functional
```

### TODO
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
* Markdown linting config
* Stub the api return calls during `IS_TESTING`, then assert on the items in TeaserList in HomePage
* Drag and drop
* TypeScript
* React suspense
* Lazy load images on home page
* a11y
* BEM
* Update material ui to https://mui.com/material-ui/getting-started/installation/
* Turn components into functions
