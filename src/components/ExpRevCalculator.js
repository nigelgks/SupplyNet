export const ExpRevCalculator = ( array ) => {
    let total = 0;

    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }

    return total;
};

export default ExpRevCalculator;
