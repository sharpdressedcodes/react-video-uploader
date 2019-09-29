# React Video Uploader

## Prerequisites
Make sure you have [docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [docker-compose](https://docs.docker.com/compose/install/) installed

## Setup
Create environment:
```shell script
docker-compose up -d --build
```

Install modules:
```shell script
docker exec -it node npm i
```

Build everything:
```shell script
docker exec -it node npm run build
```

Serve files from the `./dist/` directory:
```shell script
docker exec -it node npm run start
```
Now open [http://localhost:3001/](http://localhost:3001/) in your browser.

## Tests
...


### TODO
Have a look at combining react-router with fluxible
https://github.com/yahoo/fluxible/blob/master/examples/react-router/actions/navigate.js
https://github.com/yahoo/fluxible/issues/86
https://www.google.com/search?q=the+react-router+fluxible+example

Build custom docker image after installing all the conversion software
Have a look at encoding the videos after they are uploaded, this way we can accept more formats like flv

Have a look at the way csrf is implemented

Generate preview gif of video

Authenticating the user before allowing to POST

Split up js and css
