const getFileName = (file: File | Express.Multer.File): string => 'name' in file ? file.name : file.originalname;

export default getFileName;
