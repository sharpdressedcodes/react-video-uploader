export default function roundTo(bytes, precision) {
    return +(`${Math.round(`${bytes}e+${precision}`)}e-${precision}`);
}
