import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from '@expo/vector-icons';

const baseColor = "#162033";
const neonColor = "#a6fd29";

const InventoryPerformance = ({ navigation }) => {
  const inventoryCompCat = [
    {
      value: 45,
      color: neonColor,
      focused: true,
    },
    {value: 24, color: '#BDB2FA'},
    {value: 21, color: '#6499E9'},
    {value: 10, color: '#FFA5BA'},
  ];

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
            <Text style={{color: 'white'}}>Eggs: 45%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Chicken Wings: 24%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Drumsticks: 21%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Others: 10%</Text>
          </View>
        </View>
      </>
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
              155
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Inventory Level
            </Text>
            <Text style={styles.smallContainerValue}>
              80.28%
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Inventory Turnover
            </Text>
            <Text style={styles.smallContainerValue}>
              25
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Days Sales
            </Text>
            <Text style={styles.smallContainerValue}>
              14 days
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Inventory Composition (per category)
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
            <PieChart
              data={inventoryCompCat}
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
                      30%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Poultry</Text>
                  </View>
                );
              }}
            />
            {renderLegendCat()}
          </View>
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