const roundTo = (bytes: number, precision: number): number => {
    return +(`${Math.round(Number(`${bytes}e+${precision}`))}e-${precision}`);
};

export default roundTo;
