const uom = [
    {label: 'Bulk', value: 'bulk'},
    {label: 'Crates', value: 'crates', parent: 'bulk'},
    {label: 'Barrels', value: 'barrels', parent: 'bulk'},
    {label: 'Bags', value: 'bags', parent: 'bulk'},
    {label: 'Count', value: 'count'},
    {label: 'Pieces (pcs)', value: 'pcs', parent: 'count'},
    {label: 'Units (u)', value: 'units', parent: 'count'},
    {label: 'Dozen (dz)', value: 'dozen', parent: 'count'},
    {label: 'Length', value: 'length'},
    {label: 'Meters (m)', value: 'm', parent: 'length'},
    {label: 'Centimeters (cm)', value: 'cm', parent: 'length'},
    {label: 'Inches (in)', value: 'in', parent: 'length'},
    {label: 'Volume', value: 'volume'},
    {label: 'Mililiters (ml)', value: 'ml', parent: 'volume'},
    {label: 'Liters (l)', value: 'l', parent: 'volume'},
    {label: 'Gallons (gal)', value: 'gal', parent: 'volume'},
    {label: 'Weight', value: 'weight'},
    {label: 'Grams (g)', value: 'g', parent: 'weight'},
    {label: 'Kilograms (kg)', value: 'kg', parent: 'weight'},
    {label: 'Pounds (lbs)', value: 'lbs', parent: 'weight'},
    {label: 'Ounces (oz)', value: 'oz', parent: 'weight'}
]

export default uom