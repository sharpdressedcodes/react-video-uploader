/// <reference lib="dom"/>
const files = {
    pass: [new File(['    ftypavc1'], 'example.mp4', { type: 'video/mp4' })],
    fileTooLarge: [new File(['    ftypavc1        '], 'too-large.mp4', { type: 'video/mp4' })],
    fileWrongFileExtension: [new File(['    ftyp'], 'wrong-mime-type.exe', { type: 'application/x-msdownload' })],
    fileBadHeader: [new File(['    evil'], 'bad-header.mp4', { type: 'video/mp4' })],
    filesTooLarge: [
        new File(['    ftypavc1  '], 'files-too-large-1.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1  '], 'files-too-large-2.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1  '], 'files-too-large-3.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1  '], 'files-too-large-4.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1  '], 'files-too-large-5.mp4', { type: 'video/mp4' }),
    ],
    tooManyFiles: [
        new File(['    ftypavc1'], 'too-many-files-1.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1'], 'too-many-files-2.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1'], 'too-many-files-3.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1'], 'too-many-files-4.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1'], 'too-many-files-5.mp4', { type: 'video/mp4' }),
        new File(['    ftypavc1'], 'too-many-files-6.mp4', { type: 'video/mp4' }),
    ],
};

export default files;
