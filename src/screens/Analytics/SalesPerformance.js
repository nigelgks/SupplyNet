import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from '@expo/vector-icons';

const baseColor = "#162033";
const neonColor = "#a6fd29";

function sum(barData) {
  return barData.reduce((total, item) => total + item.value, 0);
};

function average(barData) {
  return sum(barData) / barData.length;
};

const SalesPerformance = ({ navigation, route }) => {
  const { expenses } = route.params;

  const barDataRev = [
    { value: 653, label: '1' },
    { value: 415, label: '2' },
    { value: 256, label: '3' },
    { value: 891, label: '4' },
    { value: 108, label: '5' },
    { value: 784, label: '6' },
    { value: 603, label: '7' },
    { value: 725, label: '8' },
    { value: 368, label: '9' },
    { value: 530, label: '10' },
    { value: 972, label: '11' },
    { value: 196, label: '12' },
    { value: 641, label: '13' },
    { value: 138, label: '14' },
    { value: 731, label: '15' },
    { value: 543, label: '16' },
    { value: 812, label: '17' },
    { value: 265, label: '18' },
    { value: 382, label: '19' },
    { value: 499, label: '20' },
    { value: 958, label: '21' },
    { value: 176, label: '22' },
    { value: 622, label: '23' },
    { value: 354, label: '24' },
    { value: 847, label: '25' },
    { value: 479, label: '26' },
    { value: 219, label: '27' },
    { value: 785, label: '28' },
    { value: 356, label: '29' },
    { value: 521, label: '30' }
  ];

  const barDataOrder = [
    { value: 358, label: '1' },
    { value: 549, label: '2' },
    { value: 712, label: '3' },
    { value: 812, label: '4' },
    { value: 196, label: '5' },
    { value: 410, label: '6' },
    { value: 648, label: '7' },
    { value: 712, label: '8' },
    { value: 291, label: '9' },
    { value: 902, label: '10' },
    { value: 554, label: '11' },
    { value: 260, label: '12' },
    { value: 885, label: '13' },
    { value: 769, label: '14' },
    { value: 424, label: '15' },
    { value: 168, label: '16' },
    { value: 220, label: '17' },
    { value: 662, label: '18' },
    { value: 127, label: '19' },
    { value: 928, label: '20' },
    { value: 379, label: '21' },
    { value: 547, label: '22' },
    { value: 890, label: '23' },
    { value: 143, label: '24' },
    { value: 465, label: '25' },
    { value: 590, label: '26' },
    { value: 313, label: '27' },
    { value: 720, label: '28' },
    { value: 317, label: '29' },
    { value: 921, label: '30' }
  ];

  const pieDataRev = [
    {
      value: 60,
      color: neonColor,
      focused: true,
    },
    {value: 20, color: '#BDB2FA'},
    {value: 10, color: '#FFA5BA'},
  ];

  const pieDataOrder = [
    {
      value: 58,
      color: neonColor,
      focused: true,
    },
    {value: 20, color: '#BDB2FA'},
    {value: 18, color: '#6499E9'},
    {value: 5, color: '#FFA5BA'},
  ];

  const pieDataProd = [
    {
      value: 48,
      color: neonColor,
      focused: true,
    },
    {value: 31, color: '#BDB2FA'},
    {value: 11, color: '#6499E9'},
    {value: 10, color: '#FFA5BA'},
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

  const renderLegendRev = () => {
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
            <Text style={{color: 'white'}}>Sales: 60%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Transaction: 20%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Commission: 10%</Text>
          </View>
        </View>
      </>
    );
  };

  const renderLegendOrder = () => {
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
            <Text style={{color: 'white'}}>Completed: 58%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Ongoing: 20%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Pending: 18%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Cancelled: 5%</Text>
          </View>
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
            <Text style={{color: 'white'}}>Eggs: 48%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Chicken Wings: 21%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Drumsticks: 31%</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{paddingTop: 3}} onPress={() => navigation.navigate('Analytics')}>
          <Ionicons name="arrow-back-circle" size={30} color={baseColor}/>
        </TouchableOpacity>
        <Text style={styles.header}>
          Sales Performance
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 7}}>
          <Ionicons name="information-circle" size={17} color={neonColor} />
          <Text style={{fontWeight: '300', paddingLeft: 5}}>Calculated based on 30-days data.</Text>
        </View>
        
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>
            Total Revenue
          </Text>
          <Text style={styles.topContainerValue}>
            RM {expenses}
          </Text>
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Average Revenue
            </Text>
            <Text style={styles.smallContainerValue}>
              RM {(expenses/30).toFixed(2)}
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Gross Margin
            </Text>
            <Text style={styles.smallContainerValue}>
              {(((2053.50 - 1000)/2053.50)*100).toFixed(2)}%
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Daily Revenue (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              barBorderRadius={8}
              data={barDataRev}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataRev)}
              hideRules
              hideYAxisText
              yAxisSide='right'
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor='gray'
              xAxisType='dashed'
              xAxisLabelTextStyle={{color: 'white', fontWeight: '500', fontSize: 12}}
              frontColor={neonColor}
              rulesColor={neonColor}
            />
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Daily Orders (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              barBorderRadius={8}
              data={barDataOrder}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataOrder)}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={'gray'}
              xAxisType='dashed'
              xAxisLabelTextStyle={{color: 'white', fontWeight: '500', fontSize: 12}}
              frontColor={neonColor}
              rulesColor={neonColor}
            />
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Revenue Composition
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <PieChart
              data={pieDataRev}
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
                      60%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Excellent</Text>
                  </View>
                );
              }}
            />
            {renderLegendRev()}
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Orders Composition
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <PieChart
              data={pieDataOrder}
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
                      58%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Completed</Text>
                  </View>
                );
              }}
            />
            {renderLegendOrder()}
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Top-selling Products
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <PieChart
              data={pieDataProd}
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
                      48%
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
  topContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 12,
    height: 120,
    borderRadius: 8,
    backgroundColor: baseColor
  },
  topContainerTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17
  },
  topContainerValue: {
    color: neonColor,
    paddingTop: 12,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold'
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

export default SalesPerformance;