import express from 'express';

const staticServer = (directory: string, isProduction: boolean) => express.static(directory, {
    maxAge: isProduction ? '1y' : 0,
    index: false,
});

export default staticServer;
