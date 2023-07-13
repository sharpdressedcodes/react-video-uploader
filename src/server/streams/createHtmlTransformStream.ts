import { Transform } from 'node:stream';

const createHtmlTransformStream = (headContent: string | string[] = []) => new Transform({
    decodeStrings: false,
    transform(chunk: Buffer, enc, next) {
        const contentToInject = Array.isArray(headContent) ? headContent.join('') : headContent;

        next(null, !contentToInject ? chunk : Buffer.from(chunk.toString().replace(
            '</head>',
            `${contentToInject}</head>`,
        )));
    },
});

export default createHtmlTransformStream;
