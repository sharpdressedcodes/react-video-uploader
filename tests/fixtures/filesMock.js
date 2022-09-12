const filesMock = {
    pass: [new File(['    ftyp'], 'example.mp4', { type: 'video/mp4' })],
    fileTooLarge: [new File(['    ftyp        '], 'too-large.mp4', { type: 'video/mp4' })],
    fileWrongMimeType: [new File(['    ftyp'], 'wrong-mime-type.flv', { type: 'video/flv' })],
    fileBadHeader: [new File(['    evil'], 'bad-header.mp4', { type: 'video/mp4' })],
    filesTooLarge: [
        new File(['    ftyp  '], 'files-too-large-1.mp4', { type: 'video/mp4' }),
        new File(['    ftyp  '], 'files-too-large-2.mp4', { type: 'video/mp4' }),
        new File(['    ftyp  '], 'files-too-large-3.mp4', { type: 'video/mp4' }),
        new File(['    ftyp  '], 'files-too-large-4.mp4', { type: 'video/mp4' }),
        new File(['    ftyp  '], 'files-too-large-5.mp4', { type: 'video/mp4' })
    ],
    tooManyFiles: [
        new File(['    ftyp'], 'too-many-files-1.mp4', { type: 'video/mp4' }),
        new File(['    ftyp'], 'too-many-files-2.mp4', { type: 'video/mp4' }),
        new File(['    ftyp'], 'too-many-files-3.mp4', { type: 'video/mp4' }),
        new File(['    ftyp'], 'too-many-files-4.mp4', { type: 'video/mp4' }),
        new File(['    ftyp'], 'too-many-files-4.mp4', { type: 'video/mp4' }),
        new File(['    ftyp'], 'too-many-files-4.mp4', { type: 'video/mp4' })
    ]
};

module.exports = filesMock;
