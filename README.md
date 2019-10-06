# React Video Uploader

This project uses ffmpeg to generate preview thumbnails.

To get going, you can either use with or without docker.
If you use without docker, you'll need node, npm and ffmpeg installed. You can get away without having ffmpeg, as long as you don't upload any files.


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

Serve files from the `./dist/` directory:
```shell script
npm run start
```
Now open [http://localhost:3001/](http://localhost:3001/) in your browser.

## Tests
#### Unit
```shell script
npm test
```

##### Functional
Cypress will set a cookie `__IS_TESTING__ = 1` before each test. The config will then be loaded based on this value, either normal or test config.

2 choices here. Either install Cypress locally (this will happen if you have node/npm locally), or run the docker image, which is just over 1GB.

Locally:
```
npm run test:functional
```

With docker:
```
docker run --rm --tty --name cypress --volume $PWD/:/home/node/app --workdir /home/node/app --network host -e DISPLAY= -e CYPRESS_BASE_URL='http://172.17.0.1:3001/' sharpdressedcodes/node:10.16.3-stretch-slim-cypress-3.4.1 npm run test:functional
```

### TODO
* Build custom docker image after installing all the conversion software
* Have a look at encoding the videos after they are uploaded, this way we can accept more formats like flv
* Generate preview gif of video
* Authenticating the user before allowing to POST
* Split up js and css + hot reloading
* Git hooks
