import { AssignColor } from "./AssignColor";

export const ProductPercentage = ( array ) => {
    // Sort products based on stock
    const sortedQuantity = array.sort((a, b) => parseInt(b.stock) - parseInt(a.stock));

    // Calculate total stock
    const totalStock = sortedQuantity.reduce((acc, item) => acc + parseInt(item.stock), 0);

    // Calculate percentage of all products
    const quantityPercentages = sortedQuantity.map(item => ({
        name: item.name,
        stock: parseInt(item.stock),
        percentage: ((parseInt(item.stock) / totalStock) * 100).toFixed(2)
    }));

    // Determine top three and calculate percentage
    const topQuantity = quantityPercentages.slice(0, 3);
    const topProductPercentages = topQuantity;

    if (quantityPercentages.length > 3) {
      // Calculate overall percentage of Others category
      const othersPercentage = quantityPercentages.slice(0, -3).reduce((acc, item) => acc + item.percentage, 0);

      // Combine the rest of the items into "Others" category
      const others = {
        name: 'Others',
        stock: sortedQuantity.slice(0, -3).reduce((acc, item) => acc + parseInt(item.stock), 0),
        percentage: othersPercentage
      };

      topProductPercentages.concat(others);
    };

    const arrayWithProdPercentages = topProductPercentages.map(({ percentage, color }) => ({ value: parseFloat(percentage), color }));

    const array1 = AssignColor(topProductPercentages, false);
    const array2 = AssignColor(arrayWithProdPercentages, true);

    return [array1, array2];
};

export default ProductPercentage;