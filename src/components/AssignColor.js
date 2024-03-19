const neonColor = "#a6fd29";
const pieChartColor = [neonColor, '#BDB2FA', '#6499E9', '#FFA5BA'];

export const AssignColor = ( array, bool ) => {
    // Assign color
    array.forEach((item, index) => {
        if (index < pieChartColor.length) {
          item.color = pieChartColor[index];
        };
        if (bool && index < 1) {
          item.focused = true;
        }
    });

    return array;
};

export default AssignColor;