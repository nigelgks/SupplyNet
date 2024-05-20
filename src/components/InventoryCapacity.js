export const InventoryCapacity = ( array ) => {
    let max = 0;
    let curr = 0;
    
    const filteredArray = array.map(({stock, max}) => ({stock, max}));

    for (let i = 0; i < filteredArray.length; i++) {
        max += parseInt(array[i].max);
        curr += parseInt(array[i].stock);
    };

    const level = parseFloat(((curr / max) * 100).toFixed(2));

    return [{max, curr, level}];
};

export default InventoryCapacity;
