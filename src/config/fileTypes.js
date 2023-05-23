const matroskaFileSignature = {
    length: 4,
    value: '\x1a\x45\xdf\xa3', // .Eß£
};
const threeGPFileSignature = {
    offset: 4,
    length: 6,
    value: 'ftyp3g',
};

export const fileTypes = {
    'video/3gpp': { extensions: ['3gp'], signatures: [threeGPFileSignature] },
    'video/3gpp2': { extensions: ['3g2'], signatures: [threeGPFileSignature] },
    'video/mp2t': { extensions: ['ts'], signatures: [{ length: 1, value: '\x47' }] },
    'video/mp4': {
        extensions: ['mp4'],
        signatures: [{
            offset: 4,
            length: 8,
            check: buffer => {
                const str = buffer.toString('utf8');
                const type = str.substring(0, 4);
                const subType = str.substring(4, 8);
                const validSubTypes = ['avc1', 'iso2', 'isom', 'mmp4', 'mp41', 'mp42', 'mp71', 'msnv', 'ndas', 'ndsc', 'ndsh', 'ndsm', 'ndsp', 'ndss', 'ndxc', 'ndxh', 'ndxm', 'ndxp', 'ndxs'];

                return type === 'ftyp' && validSubTypes.includes(subType);
            },
        }],
    },
    'video/ogg': { extensions: ['ogv'], signatures: [{ length: 4, value: 'OggS' }] },
    'video/quicktime': { extensions: ['mov'], signatures: [{ length: 8, offset: 4, value: 'ftypeqt  ' }] },
    'video/webm': { extensions: ['webm'], signatures: [matroskaFileSignature] },
    'video/x-ms-wmv': { extensions: ['wmv'], signatures: [{ length: 16, value: '\x30\x26\xB2\x75\x8E\x66\xCF\x11\xA6\xD9\x00\xAA\x00\x62\xCE\x6C' }] },
    'video/x-flv': {
        extensions: ['flv'],
        signatures: [{
            length: 5,
            check: buffer => {
                const str = buffer.toString('utf8');
                const signature = str.substring(0, 3);
                const version = str.substring(3, 4);
                const flags = str.substring(4, 5);
                const validFlags = [
                    '\x01', // video
                    '\x04', // audio
                    '\x05', // audio + video
                ];

                return signature === 'FLV' && version === '\x01' && validFlags.includes[flags];
            },
        }],
    },
    'video/x-matroska': { extensions: ['mkv'], signatures: [matroskaFileSignature] },
    'video/x-msvideo': { extensions: ['avi'], signatures: [{ length: 4, value: 'RIFF' }] },
};

export const fileExtensions = Object
    .entries(fileTypes)
    .map(([, value]) => value.extensions)
    .flat()
    .sort()
;
