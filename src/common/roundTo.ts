const roundTo = (bytes: number, precision: number): number => +(`${Math.round(Number(`${bytes}e+${precision}`))}e-${precision}`);

export default roundTo;
