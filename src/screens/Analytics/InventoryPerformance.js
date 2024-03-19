import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from '@expo/vector-icons';
import { CategoryPercentage } from '../../components/CategoryPercentage';
import { ProductPercentage } from '../../components/ProductPercentage';

const baseColor = "#162033";
const neonColor = "#a6fd29";

const InventoryPerformance = ({ navigation, route }) => {
  const { inventory, level } = route.params;

  const [ categoryArr, setCategoryArr ] = useState('');
  const [ categoryComp, setCategoryComp ] = useState('');
  const [ productArr, setProductArr ] = useState('');
  const [ productComp, setProductComp ] = useState('');

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
            paddingRight: 160
          }}>
          {categoryArr.map(({ category, color, percentage }, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderDot(color)}
              <Text style={{ color: 'white' }}>{category}: {percentage}%</Text>
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
            paddingRight: 160
          }}>
          {productArr.map(({ name, color, percentage }, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderDot(color)}
              <Text style={{ color: 'white' }}>{name}: {percentage}%</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  useEffect(() => {
    const array = inventory;
    
    let topCategoryArray = CategoryPercentage(array);
    let topProductArray = ProductPercentage(array);

    const topCategoryPercentages = topCategoryArray[0];
    const topProductPercentages = topProductArray[0];
    const arrayWithCatPercentages = topCategoryArray[1];
    const arrayWithProdPercentages = topProductArray[1];

    setCategoryArr(topCategoryPercentages);
    setCategoryComp(arrayWithCatPercentages);
    setProductArr(topProductPercentages);
    setProductComp(arrayWithProdPercentages);
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
                        style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                        {parseInt(categoryArr[0].percentage)}%
                      </Text>
                      <Text style={{fontSize: 12, color: 'white', textAlign: 'center'}}>{categoryArr[0].category}</Text>
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
          {categoryComp.length > 0 ? (
            <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <PieChart
                data={productComp}
                donut
                sectionAutoFocus
                radius={75}
                innerRadius={50}
                innerCircleColor={baseColor}
                centerLabelComponent={() => {
                  return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text
                        style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                        {parseInt(productArr[0].percentage)}%
                      </Text>
                      <Text style={{fontSize: 12, color: 'white', textAlign: 'center'}}>{productArr[0].name}</Text>
                    </View>
                  );
                }}
              />
              {renderLegendProd()}
            </View>
          ) : (
            <></>
          )}
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