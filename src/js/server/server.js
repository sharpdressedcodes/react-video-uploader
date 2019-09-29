const express = require('express');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const get = require('lodash/get');
const config = require('../config/main');
const { getVideoInfo, generatePoster, generateThumbnail } = require('./ffmpeg');
const fileOperations = require('../helpers/fileOperations');
const { validateFilesServer } = require('../helpers/fileValidation');
const { formatFileSize } = require('../helpers/format');

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
    console.error(err);
    next(err);
};
const trapErrors = (err, req, res, next) => {

    let status = 500;
    let message = 'Internal server error';

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

(async function(){
    try {
        await fileOperations.createDirectory(uploadPath);
    } catch (err) {
        console.error(err);
    }
})();

server.use(cors());
server.use(cookieParser());

server.get('/', csrfMiddleware, async (req, res, next) => {

    try {
        let data = await fileOperations.readFile(`${root}/src/index.html`, 'utf8');
        data = data.replace('</head>', `<meta name="csrf-token" content="${req.csrfToken()}"></head>`);
        res.send(data);
    } catch (err) {
        res.status(500).json(err);
    }

});

server.use((req, res, next) => {

    if (req.url === '/upload' || req.url.startsWith('/video/')) {
        res.redirect('/');
    } else {
        next();
    }

});

server.get(`${config.app.endpoints.api.video.get}/:id?`, async (req, res, next) => {

    const { directoryExists, readDir, readFile } = fileOperations;
    const pathExists = await directoryExists(uploadPath);

    if (pathExists) {

        try {

            const files = await readDir(uploadPath);
            const items = files.filter(item => item.endsWith('.json'));
            const len = items.length;
            const id = req.params.id;

            if (!id) {

                const promises = items.map(async item => JSON.parse(await readFile(`${uploadPath}/${item}`)));

                res.json({ items: await Promise.all(promises) });

            } else {

                if (id < 0 || id > len - 1) {
                    res.status(404).send('Not found');
                    return;
                }

                const item = JSON.parse(await readFile(`${uploadPath}/${items[id]}`));
                res.json({ item });

            }

        } catch (err) {
            console.log(err);
            res.json({ items: [], error: err.message });
        }

    } else {
        res.status(404).send('Not found');
    }

});

server.post(config.app.endpoints.api.video.upload, parseForm, csrfMiddleware, async (req, res, next) => {

    const { writeFile } = fileOperations;

    try {

        await uploadAsync(req, res);

        const files = Array.from(req.files);
        const errors = await validateFilesServer(files);
        const len = files.length;

        if (Array.isArray(errors)) {
            res.json({ errors });
            return;
        }

        for (let i = 0; i < len; i++) {

            const file = files[i];
            const poster = await generatePoster(file.path);
            const thumb = await generateThumbnail(file.path);
            const info = await getVideoInfo(file.path);
            const json = {
                video: path.basename(file.path),
                poster,
                thumb,
                metadata: info,
                originalFileName: file.originalname,
                type: file.mimetype,
                size: file.size,
                formattedSize: formatFileSize(file.size)
            };
            const jsonFile = file.path.replace(/\.[a-z0-9]{1,}$/i, '.json');

            await writeFile(jsonFile, JSON.stringify(json));
        }

        console.log(`Received ${len} files`, files);
        res.send({ errors: [], files });

    } catch (err) {
        console.error(err);
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
