const getFileExtension = (file: File | Express.Multer.File): string | null => {
    const prop: string = 'path' in file ? file.path : file.name;
    const pos: number = prop.lastIndexOf('.');

    return pos > -1 ? prop.substring(pos + 1) : null;
};

export default getFileExtension;
