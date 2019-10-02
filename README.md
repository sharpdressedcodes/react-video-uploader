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
#### Unit
```shell script
docker exec -it node npm test
```


### TODO
Build custom docker image after installing all the conversion software

Have a look at encoding the videos after they are uploaded, this way we can accept more formats like flv

Generate preview gif of video

Authenticating the user before allowing to POST

Split up js and css
