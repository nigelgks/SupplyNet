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

const CustomerInsights = ({ navigation }) => {
  const barDataNC = [
    { value: 3, label: '1' },
    { value: 1, label: '2' },
    { value: 1, label: '3' },
    { value: 0, label: '4' },
    { value: 2, label: '5' },
    { value: 0, label: '6' },
    { value: 2, label: '7' },
    { value: 3, label: '8' },
    { value: 0, label: '9' },
    { value: 2, label: '10' },
    { value: 0, label: '11' },
    { value: 3, label: '12' },
    { value: 1, label: '13' },
    { value: 0, label: '14' },
    { value: 1, label: '15' },
    { value: 3, label: '16' },
    { value: 0, label: '17' },
    { value: 1, label: '18' },
    { value: 0, label: '19' },
    { value: 3, label: '20' },
    { value: 3, label: '21' },
    { value: 0, label: '22' },
    { value: 1, label: '23' },
    { value: 0, label: '24' },
    { value: 2, label: '25' },
    { value: 0, label: '26' },
    { value: 0, label: '27' },
    { value: 2, label: '28' },
    { value: 3, label: '29' },
    { value: 1, label: '30' }
  ];

  const barDataRC = [
    { value: 8, label: '1' },
    { value: 0, label: '2' },
    { value: 4, label: '3' },
    { value: 3, label: '4' },
    { value: 3, label: '5' },
    { value: 2, label: '6' },
    { value: 1, label: '7' },
    { value: 3, label: '8' },
    { value: 0, label: '9' },
    { value: 0, label: '10' },
    { value: 7, label: '11' },
    { value: 2, label: '12' },
    { value: 4, label: '13' },
    { value: 4, label: '14' },
    { value: 5, label: '15' },
    { value: 3, label: '16' },
    { value: 2, label: '17' },
    { value: 0, label: '18' },
    { value: 3, label: '19' },
    { value: 4, label: '20' },
    { value: 4, label: '21' },
    { value: 5, label: '22' },
    { value: 4, label: '23' },
    { value: 0, label: '24' },
    { value: 4, label: '25' },
    { value: 2, label: '26' },
    { value: 2, label: '27' },
    { value: 1, label: '28' },
    { value: 2, label: '29' },
    { value: 2, label: '30' }
  ];

  const pieDataOrigin = [
    {
      value: 71,
      color: neonColor,
      focused: true,
    },
    {value: 15, color: '#BDB2FA'},
    {value: 9, color: '#6499E9'},
    {value: 5, color: '#FFA5BA'},
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

  const renderLegendOrigin = () => {
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
            <Text style={{color: 'white'}}>Perak: 71%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#BDB2FA')}
            <Text style={{color: 'white'}}>Kuala Lumpur: 15%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#6499E9')}
            <Text style={{color: 'white'}}>Penang: 9%</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot('#FFA5BA')}
            <Text style={{color: 'white'}}>Others: 5%</Text>
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
          Customer Insights
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 7}}>
          <Ionicons name="information-circle" size={17} color={neonColor} />
          <Text style={{fontWeight: '300', paddingLeft: 5}}>Calculated based on 30-days data.</Text>
        </View>
        
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>
            Number of Customers
          </Text>
          <Text style={styles.topContainerValue}>
            125
          </Text>
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              New (NC)
            </Text>
            <Text style={styles.smallContainerValue}>
              50 ({(50/125)*100}%)
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Returning (RC)
            </Text>
            <Text style={styles.smallContainerValue}>
              75 ({(75/125)*100}%)
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Average NC
            </Text>
            <Text style={styles.smallContainerValue}>
              {(50/30).toFixed(1)}
            </Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Average RC
            </Text>
            <Text style={styles.smallContainerValue}>
              {(75/30).toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartContainerTitle}>
            New Customers (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              barBorderRadius={8}
              data={barDataNC}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataNC)}
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
            Returning Customers (30 days)
          </Text>
          <View style={styles.chartStyle}>
            <BarChart
              height={150}
              barWidth={10}
              barBorderRadius={8}
              data={barDataRC}
              showReferenceLine1={true}
              referenceLine1Config={{color: neonColor, dashGap: 5, thickness: 2}}
              referenceLine1Position={average(barDataRC)}
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
            Customer Origin (per state)
          </Text>
          <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <PieChart
              data={pieDataOrigin}
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
                      71%
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Perak</Text>
                  </View>
                );
              }}
            />
            {renderLegendOrigin()}
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

export default CustomerInsights;