const getFileExtension = file => {
    const { name, path } = file;
    const prop = path || name;
    const pos = prop.lastIndexOf('.');

    return pos > -1 ? prop.substring(pos + 1) : null;
};

export default getFileExtension;
