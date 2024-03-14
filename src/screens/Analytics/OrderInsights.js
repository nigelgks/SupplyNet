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

const OrderInsights = ({ navigation, route }) => {
  const { expenses, rfq } = route.params;

  const barDataExpenses = [
    { value: 23.15, label: '1' },
    { value: 2.20, label: '2' },
    { value: 16.50, label: '3' },
    { value: 9.60, label: '4' },
    { value: 6.40, label: '5' },
    { value: 15.75, label: '6' },
    { value: 5.00, label: '7' },
    { value: 0.90, label: '8' },
    { value: 15.00, label: '9' },
    { value: 1.60, label: '10' },
    { value: 8.50, label: '11' },
    { value: 4.20, label: '12' },
    { value: 13.85, label: '13' },
    { value: 10.20, label: '14' },
    { value: 7.80, label: '15' },
    { value: 10.75, label: '16' },
    { value: 12.30, label: '17' },
    { value: 5.50, label: '18' },
    { value: 0.30, label: '19' },
    { value: 0.10, label: '20' },
    { value: 1.05, label: '21' },
    { value: 2.00, label: '22' },
    { value: 10.90, label: '23' },
    { value: 3.75, label: '24' },
    { value: 2.40, label: '25' },
    { value: 6.60, label: '26' },
    { value: 4.80, label: '27' },
    { value: 0.05, label: '28' },
    { value: 7.55, label: '29' },
    { value: 6.70, label: '30' }
  ];

  const barDataRFQ = [
    { value: 1, label: '1' },
    { value: 1, label: '2' },
    { value: 1, label: '3' },
    { value: 2, label: '4' },
    { value: 1, label: '5' },
    { value: 1, label: '6' },
    { value: 1, label: '7' },
    { value: 1, label: '8' },
    { value: 1, label: '9' },
    { value: 1, label: '10' },
    { value: 1, label: '11' },
    { value: 0, label: '12' },
    { value: 0, label: '13' },
    { value: 2, label: '14' },
    { value: 0, label: '15' },
    { value: 1, label: '16' },
    { value: 0, label: '17' },
    { value: 1, label: '18' },
    { value: 0, label: '19' },
    { value: 1, label: '20' },
    { value: 1, label: '21' },
    { value: 0, label: '22' },
    { value: 1, label: '23' },
    { value: 0, label: '24' },
    { value: 1, label: '25' },
    { value: 0, label: '26' },
    { value: 1, label: '27' },
    { value: 0, label: '28' },
    { value: 1, label: '29' },
    { value: 1, label: '30' }
  ];

  const pieDataRFQ = [
    {
      value: 45,
      color: neonColor,
      focused: true,
    },
    {value: 25, color: '#BDB2FA'},
    {value: 18, color: '#6499E9'},
    {value: 12, color: '#FFA5BA'},
  ];

  const pieDataProd = [
    {
      value: 32,
      color: neonColor,
      focused: true,
    },
    {value: 25, color: '#BDB2FA'},
    {value: 23, color: '#6499E9'},
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

  const renderLegendRFQ = () => {
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
            <Text style={{color: 'white'}}>Completed: 45%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Ongoing: 25%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Pending: 18%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Cancelled: 12%</Text>
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
            <Text style={{color: 'white'}}>Red Tilapia: 32%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Cavendish Banana: 25%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Eggs: 23%</Text>
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
          Order Insights
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
              Total Expenses (RM)
            </Text>
            <Text style={styles.smallContainerValue}>
              {expenses}
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Total RFQ
            </Text>
            <Text style={styles.smallContainerValue}>
              {rfq}
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Average Expenses (RM)
            </Text>
            <Text style={styles.smallContainerValue}>
              {(expenses/30).toFixed(2)}
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Average RFQ
            </Text>
            <Text style={styles.smallContainerValue}>
              {(rfq/30).toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Daily Expenses (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              maxValue={25}
              barBorderRadius={8}
              data={barDataExpenses}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataExpenses)}
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
            Daily RFQ Request (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              maxValue={2}
              barBorderRadius={8}
              data={barDataRFQ}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataRFQ)}
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
            RFQ Status Composition
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <PieChart
              data={pieDataRFQ}
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
                    <Text style={{fontSize: 14, color: 'white'}}>Completed</Text>
                  </View>
                );
              }}
            />
            {renderLegendRFQ()}
          </View>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            Products Ordered
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
                      32%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Red Tilapia</Text>
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
    fontSize: 13
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

export default OrderInsights;