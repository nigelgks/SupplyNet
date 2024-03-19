import { AssignColor } from "./AssignColor";

export const CategoryPercentage = ( array ) => {
    // Calculate category frequency
    const frequencyMap = array.reduce((map, item) => {
        map[item.category] = (map[item.category] || 0) + 1;
        return map;
    }, {});

    // Sort categories based on frequency
    const sortedCategories = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    // Determine top three and calculate percentage
    const topCategories = sortedCategories.slice(0, 3);
    const topCategoryPercentages = topCategories.map(category => ({
      category,
      percentage: ((frequencyMap[category] / array.length) * 100).toFixed(2)
    }));

    // Add Others Category
    if (topCategoryPercentages.length > 3) {
        // Combine other categories into Other and calculate percentage
        const othersPercentage = ((totalItems - topCategoryPercentages.reduce((sum, item) => sum + frequencyMap[item.category], 0)) / totalItems) * 100;
  
        // New array with all categories and percentages
        topCategoryPercentages.concat([{ category: "Others", percentage: othersPercentage.toFixed(2) }]);
    };

    const arrayWithCatPercentages = topCategoryPercentages.map(({ percentage, color }) => ({ value: parseFloat(percentage), color }));

    const array1 = AssignColor(topCategoryPercentages, false);
    const array2 = AssignColor(arrayWithCatPercentages, true);
    
    return [array1, array2];
};

export default CategoryPercentage;