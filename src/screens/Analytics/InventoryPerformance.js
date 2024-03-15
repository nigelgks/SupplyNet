import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from '@expo/vector-icons';

const baseColor = "#162033";
const neonColor = "#a6fd29";
const pieChartColor = [neonColor, '#BDB2FA', '#6499E9', '#FFA5BA'];

const InventoryPerformance = ({ navigation, route }) => {
  const { inventory, level } = route.params;

  const [ categoryArr, setCategoryArr ] = useState('');
  const [ categoryComp, setCategoryComp ] = useState('');

  const inventoryCompProd = [
    {
      value: 30,
      color: neonColor,
      focused: true,
    },
    {value: 28, color: '#BDB2FA'},
    {value: 22, color: '#6499E9'},
    {value: 20, color: '#FFA5BA'},
  ];

  const renderDot = color => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendCat = () => {
    return (
      <>
        <View
          style={{
            marginLeft: 25,
            marginRight: 20
          }}>
          {categoryArr.map(({ category, color, value }, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderDot(color)}
              <Text style={{ color: 'white' }}>{category}: {value}%</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderLegendProd = () => {
    return (
      <>
        <View
          style={{
            marginLeft: 25,
            marginRight: 20
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            {renderDot(neonColor)}
            <Text style={{color: 'white'}}>Poultry: 30%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Eggs: 28%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Meat: 22%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Others: 20%</Text>
          </View>
        </View>
      </>
    );
  };

  useEffect(() => {
    // Calculate category frequency
    const frequencyMap = inventory.reduce((map, item) => {
      map[item.category] = (map[item.category] || 0) + 1;
      return map;
    }, {});

    // Sort categories based on frequency
    const sortedCategories = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

    // Determine top three and calculate percentage
    const topCategories = sortedCategories.slice(0, 3);
    const totalItems = inventory.length;
    const topCategoryPercentages = topCategories.map(category => ({
      category,
      value: ((frequencyMap[category] / totalItems) * 100).toFixed(2)
    }));

    if (topCategoryPercentages.length > 3) {
      // Combine other categories into Other and calculate percentage
      const othersPercentage = ((totalItems - topCategoryPercentages.reduce((sum, item) => sum + frequencyMap[item.category], 0)) / totalItems) * 100;

      // New array with all categories and percentages
      topCategoryPercentages.concat([{ category: "Others", value: othersPercentage.toFixed(2) }]);
    };

    const arrayWithPercentages = topCategoryPercentages.map(({ category, value, color }) => ({ value: parseFloat(value), color }));

    // Assign color
    arrayWithPercentages.forEach((item, index) => {
      if (index < pieChartColor.length) {
        item.color = pieChartColor[index];
      };
      if (index < 1) {
        item.focused = true;
      }
    });
    topCategoryPercentages.forEach((item, index) => {
      if (index < pieChartColor.length) {
        item.color = pieChartColor[index];
      };
    });

    setCategoryArr(topCategoryPercentages);
    setCategoryComp(arrayWithPercentages);
  }, [inventory]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{paddingTop: 3}} onPress={() => navigation.navigate('Analytics')}>
          <Ionicons name="arrow-back-circle" size={30} color={baseColor}/>
        </TouchableOpacity>
        <Text style={styles.header}>
          Inventory Performance
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 7}}>
          <Ionicons name="information-circle" size={17} color={neonColor} />
          <Text style={{fontWeight: '300', paddingLeft: 5}}>Calculated based on 30-days data.</Text>
        </View>
        
        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Total Products
            </Text>
            <Text style={styles.smallContainerValue}>
              {inventory.length}
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Inventory Level
            </Text>
            <Text style={styles.smallContainerValue}>
              {level}%
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Inventory Turnover
            </Text>
            <Text style={styles.smallContainerValue}>
              2.44
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Days Sales
            </Text>
            <Text style={styles.smallContainerValue}>
              {(30/2.44).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Inventory Composition (per category)
          </Text>
          {categoryComp.length > 0 ? (
            <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <PieChart
                data={categoryComp}
                donut
                sectionAutoFocus
                radius={75}
                innerRadius={50}
                innerCircleColor={baseColor}
                centerLabelComponent={() => {
                  return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text
                        style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                        {parseInt(categoryArr[0].value)}%
                      </Text>
                      <Text style={{fontSize: 14, color: 'white'}}>{categoryArr[0].category}</Text>
                    </View>
                  );
                }}
              />
              {renderLegendCat()}
            </View>
          ) : (
            <></>
          )}
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Inventory Composition (per product)
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <PieChart
              data={inventoryCompProd}
              donut
              sectionAutoFocus
              radius={75}
              innerRadius={50}
              innerCircleColor={baseColor}
              centerLabelComponent={() => {
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                      45%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Eggs</Text>
                  </View>
                );
              }}
            />
            {renderLegendProd()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50
  },
  headerContainer: {
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingBottom: 15,
    alignItems: 'center'
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: baseColor
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallContainer: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    backgroundColor: baseColor,
    padding: 12
  },
  smallContainerTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15
  },
  smallContainerValue: {
    color: neonColor,
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold'
  },
  chartContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    height: 250,
    borderRadius: 8,
    backgroundColor: baseColor,
    padding: 12,
    overflow: 'hidden'
  },
  chartContainerTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15
  },
  chartStyle: {
    paddingTop: 20
  },
});

export default InventoryPerformance;