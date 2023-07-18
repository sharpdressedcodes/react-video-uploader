const files = {
    fileTooLarge: {
        name: 'too-large.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('    ftyp        '),
    },
    fileWrongFileExtension: {
        name: 'wrong-mime-type.exe',
        mimeType: 'application/x-msdownload',
        buffer: Buffer.from('    ftyp'),
    },
    fileBadHeader: {
        name: 'bad-header.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('    evil'),
    },
    filesTooLarge: [
        {
            name: 'files-too-large-1.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1  '),
        },
        {
            name: 'files-too-large-2.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1  '),
        },
        {
            name: 'files-too-large-3.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1  '),
        },
        {
            name: 'files-too-large-4.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1  '),
        },
        {
            name: 'files-too-large-5.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1  '),
        },
    ],
    pass: {
        name: 'example.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('    ftypavc1'),
    },
    tooManyFiles: [
        {
            name: 'too-many-files-1.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
        {
            name: 'too-many-files-2.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
        {
            name: 'too-many-files-3.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
        {
            name: 'too-many-files-4.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
        {
            name: 'too-many-files-5.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
        {
            name: 'too-many-files-6.mp4',
            mimeType: 'video/mp4',
            buffer: Buffer.from('    ftypavc1'),
        },
    ],
};

export default files;
