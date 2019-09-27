const express = require('express');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const config = require('../config/main');
const get = require('lodash/get');
const mkdirp = require('mkdirp');
const util = require('util');
//const ThumbnailGenerator = require('video-thumbnail-generator').default;
const { getVideoInfo, generatePoster, generateThumbnail } = require('./ffmpeg');

const csrfMiddleware = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: true});
const server = express();
const production = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname, '../../..');
const uploadPath = get(config, 'app.videoUpload.path', 'dist/uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, get(config, 'app.videoUpload.filenameGenerator', file => file)(file.originalname));
    }
});
const upload = multer({ storage }).array('file');
const uploadAsync = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, err => {
            if (typeof err !== 'undefined') {
                reject(err);
            } else {
                resolve(req.files);
            }
        });
    });
};
const logErrors = (err, req, res, next) => {
    //console.error(err.stack);
    console.error(err);
    next(err);
};
const trapErrors = (err, req, res, next) => {

    let status = 500;
    let message = 'Internal server error';

    // if (err.code === 'ENOENT') {
    //     status = 404;
    //     message = 'Not found';
    // }

    switch (err.code) {
        case 'ENOENT':
            status = 404;
            message = 'Not found';
            break;
        case 'EBADCSRFTOKEN':
            status = 403;
            message = 'Forbidden';
            break;
    }

    if (req.xhr) {
        res.status(status).json({error: `Error: ${message}`});
    } else {
        res.status(status).send(`Error: ${message}`);
    }
};
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

if (!fs.existsSync(uploadPath)) {
    mkdirp.sync(uploadPath);
}

server.use(cors());
server.use(cookieParser());

server.get('/', csrfMiddleware, (req, res, next) => {
    fs.readFile(`${root}/src/index.html`, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        data = data.replace('</head>', `<meta name="csrf-token" content="${req.csrfToken()}"></head>`);
        res.send(data);
    });
});

server.use((req, res, next) => {
    if (req.url === '/upload' || req.url.startsWith('/video/')) {
        res.redirect('/');
    } else {
        next();
    }
});

server.get(`${config.app.endpoints.api.video.get}/:id`, async (req, res, next) => {

    if (fs.existsSync(uploadPath)) {

        try {

            const files = await readDir(uploadPath);
            const items = files.filter(item => item.endsWith('.json'));
            const len = items.length;
            const id = req.params.id;

            if (isNaN(id) || id < 0 || id > len - 1) {
                res.status(404).send('Not found');
                return;
            }

            const item = JSON.parse(await readFile(`${uploadPath}/${items[id]}`));
            res.status(200).json({ item });

        } catch (err) {
            res.status(404).send('Not found');
        }

    //     fs.readdir(uploadPath, (err, files) => {
    //
    //         if (err) {
    //             throw err;
    //         }
    //
    //         files = files || [];
    //
    //         // const videos = files.filter(item => !item.endsWith('.png'));
    //         // const thumbs = files.filter(item => item.endsWith('.png'));
    //         // const len = videos.length;
    //         const items = files.filter(item => item.endsWith('.json'));
    //         const len = items.length;
    //         const id = req.params.id;
    //
    //         if (isNaN(id) || id < 0 || id > len - 1) {
    //             res.status(404).send('Not found');
    //             return;
    //         }
    //
    //         // const item = {
    //         //     video: videos[id],
    //         //     thumb: thumbs[id]
    //         // };
    //
    //         fs.readFile(items[id], 'utf-8', (err, data) => {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.status(200).json({ item: JSON.parse(data) });
    //         });
    //
    //         //res.status(200).json({ item: JSON.parse(items[id]) });
    //     });

    } else {
        res.status(404).send('Not found');
    }

});

server.get(config.app.endpoints.api.video.list, async (req, res, next) => {

    if (fs.existsSync(uploadPath)) {

        try {

            const files = await readDir(uploadPath);
            const promises = files
                .filter(item => item.endsWith('.json'))
                .map(async item => JSON.parse(await readFile(`${uploadPath}/${item}`)));

            // const files = await readDir(uploadPath);
            // const a = files;
            // const b = a.filter(item => item.endsWith('.json'));
            // const c = b.map(async item => {
            //     const d = await readFile(`${uploadPath}/${item}`);
            //     const e = JSON.parse(await d);
            //     //console.log('d', d);
            //     //console.log('e', e);
            //     return e;
            // });
            //
            // const promises = c;
            const items = await Promise.all(promises);
            //console.log('ela', items);
            res.status(200).json({ items });

        } catch (err) {
            //res.status(200).json({ items: [] });
            //throw err;
            res.status(200).json({ items: [] });
        }

// return;
//
//         fs.readdir(uploadPath, (err, files) => {
//
//             if (err) {
//                 throw err;
//             }
//
//             files = files || [];
//
//             const a = files;
//             const b = a.filter(item => item.endsWith('.json'));
//             const c = b.map(async item => {
//                 const d = await readFile(`${uploadPath}/${item}`);
//                 const e = JSON.parse(await d);
//                 console.log('d', d);
//                 console.log('e', e);
//                 return e;
//             });
//
//             // const items = files
//             //     .filter(item => item.endsWith('.json'))
//             //     .map(async item => JSON.parse(await readFile(`${uploadPath}/${item}`, 'utf-8')));
//             const items = c;
//
//             console.log('items', items);
//             // const items = files.filter(item => item.endsWith('.json'));
//             // let json = [];
//             //
//             // //console.log('items', items);
//             //
//             // items.forEach(async item => {
//             //     // fs.readFile(item, 'utf-8', (err, data) => {
//             //     //     if (err) {
//             //     //         throw err;
//             //     //     }
//             //     //     json.push(JSON.parse(data));
//             //     // });
//             //
//             //     //json.push(JSON.parse(fs.readFileSync(item, 'utf-8')));
//             //     const s = await readFile(`${uploadPath}/${item}`, 'utf-8');
//             //     //console.log('s', s);
//             //     json.push(JSON.parse(s));
//             // });
//             // // const videos = files.filter(item => !item.endsWith('.png'));
//             // // const posters = files.filter(item => item.endsWith('-poster.png'));
//             // // const thumbs = files.filter(item => item.endsWith('-thumbnail.png'));
//             // // const items = [];
//             // // const len = videos.length;
//             // //
//             // // for (let i = 0; i < len; i++) {
//             // //     items.push({
//             // //         video: videos[i],
//             // //         thumb: thumbs[i],
//             // //         poster: posters[i],
//             // //     });
//             // // }
//             //
//             // console.log('json', json);
//             res.status(200).json({ items });
//         });

    } else {
        res.status(200).json({ items: [] });
    }

});

server.post(config.app.endpoints.api.video.upload, parseForm, csrfMiddleware, async (req, res, next) => {

    try {

        await uploadAsync(req, res);

        const len = req.files.length;

        for (let i = 0; i < len; i++) {

            const file = req.files[i];
            const poster = await generatePoster(file.path);
            const thumb = await generateThumbnail(file.path);
            const info = await getVideoInfo(file.path);
            const json = {
                video: path.basename(file.path),
                poster,
                thumb,
                metadata: info
            };
            const jsonFile = file.path.replace(/\.[a-z0-9]{1,}$/i, '.json');

            fs.writeFileSync(jsonFile, JSON.stringify(json));

            // const tg = new ThumbnailGenerator({
            //     sourcePath: req.files[i].path,
            //     thumbnailPath: `${uploadPath}/`
            // });
            // const thumbs = await tg.generate({
            //     count: 1,
            //     size: '320x180'
            // });
            // //await tg.generateGif();
        }

        console.log('finished receiving file uploads');

        return res.status(200).send(req.files);

    } catch (err) {
        console.log('tg Error', err);
        res.status(500).json(err);
    }

});

server.use('/', [
    express.static(`${root}/dist`, { maxAge: production ? '1y' : 0, fallthrough: false }),
    logErrors,
    trapErrors
]);

const listener = server.listen(process.env.PORT || get(config, 'app.port', 3001), err => {
    if (err) {
        throw err;
    }
    // eslint-disable-next-line
    console.log(`server listening on port ${listener.address().port}`);
});
