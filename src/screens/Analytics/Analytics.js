import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfileContext } from '../../context/UserProfileContext';
import { ExpensesCalculator } from '../../components/ExpensesCalculator';
import { FIREBASE_DB } from "../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const baseColor = "#162033";
const neonColor = "#a6fd29";

const Analytics = ({ navigation }) => {
  const { user } = useContext(UserProfileContext);
  
  const [ type, setType ] = useState('');
  const [ orders, setOrders ] = useState('');
  const [ expenses, setExpenses ] = useState('');
  const [ products, setProducts ] = useState('');
  const [ currentUser, setCurrentUser ] = useState('');

  useEffect(() => {
    if (orders.length > 0) {
      const totalArray = [];
      
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].status === "Ongoing" || orders[i].status === "Completed") {
          totalArray.push(parseFloat(orders[i].total));
        };
      };

      const exp = ExpensesCalculator(totalArray);
      setExpenses(exp);
    };
  }, [orders]);

  useEffect(() => {
    if (!currentUser) {
      return;
    } else {
      setType(currentUser[0].type);
    }
  });

  useEffect(() => {
    const userRef = collection(FIREBASE_DB, 'profile');

    const subscriber = onSnapshot(userRef, {
        next: (snapshot) => {
            const cUser = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.uid === user.uid) {
                    cUser.push({
                        id: doc.id,
                        ...doc.data()
                    });
                };
            });
            setCurrentUser(cUser);
        }
    });
    return () => subscriber();
  }, [user.uid]);

  useEffect(() => {
    const orderRef = collection(FIREBASE_DB, 'order');

    const subscriber = onSnapshot(orderRef, {
        next: (snapshot) => {
            const order = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (type === "retailer") {
                  if (data.retailer_uid === user.uid) {
                    order.push({
                        id: doc.id,
                        ...doc.data()
                    });
                  };
                } else if (type === "supplier") {
                  if (data.supplier_uid === user.uid) {
                    order.push({
                        id: doc.id,
                        ...doc.data()
                    });
                  };
                };
            });
            setOrders(order);
        }
    });
    return () => subscriber();
  }, [user.uid, type]);

  useEffect(() => {
    const prodRef = collection(FIREBASE_DB, 'products');

    const subscriber = onSnapshot(prodRef, {
        next: (snapshot) => {
            const prod = [];
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.uid === user.uid) {
                    prod.push({
                        id: doc.id,
                        ...doc.data()
                    });
                };
            });
            setProducts(prod);
        }
    });
    return () => subscriber();
  }, [user.uid]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{paddingTop: 3}} onPress={() => navigation.navigate('Inventory')}>
          <Ionicons name="arrow-back-circle" size={30} color={baseColor}/>
        </TouchableOpacity>
        <Text style={styles.header}>
          Data Dashboard
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 7}}>
          <Ionicons name="information-circle" size={17} color={neonColor} />
          <Text style={{fontWeight: '300', paddingLeft: 5}}>Calculated based on 30-days data.</Text>
        </View>
        
        {type === "" ? (
          <></>
        ) : (
          (type === "retailer") ? (
            <TouchableOpacity style={styles.topContainer}>
              <Text style={styles.topContainerTitle}>
                Total Expenses
              </Text>
              <Text style={styles.topContainerValue}>
                RM {expenses}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.topContainer}>
              <Text style={styles.topContainerTitle}>
                Total Revenue
              </Text>
              <Text style={styles.topContainerValue}>
                RM {expenses}
              </Text>
            </TouchableOpacity>
          )
        )}
        

        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Overall Performance
            </Text>
            <Text style={styles.smallContainerValue}>
              200%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Total Order
            </Text>
            <Text style={styles.smallContainerValue}>
              {orders.length}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Total Products
            </Text>
            <Text style={styles.smallContainerValue}>
              {products.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallContainer}>
            <Text style={styles.smallContainerTitle}>
              Inventory Level
            </Text>
            <Text style={styles.smallContainerValue}>
              {((products.length/20)*100).toFixed(2)}%
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.bottomContainer} onPress={() => navigation.navigate('InventoryPerformance', {inventory: products, level: ((products.length/20)*100).toFixed(2)})}>
          <ImageBackground
            source={require('../../../assets/inventory.jpg')}
            style={[styles.imageLayout]}
          >
            <Text style={styles.bottomContainerTitle}>
              Inventory Performance
            </Text>
          </ImageBackground>
        </TouchableOpacity>

        {type === "retailer" ? (
          <TouchableOpacity style={styles.bottomContainer} onPress={() => navigation.navigate('OrderInsights', {expenses: expenses, rfq: orders.length})}>
            <ImageBackground
              source={require('../../../assets/sales.png')}
              style={styles.imageLayout}
            >
              <Text style={styles.bottomContainerTitle}>
                Order Insights
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.bottomContainer} onPress={() => navigation.navigate('SalesPerformance', {expenses: expenses})}>
              <ImageBackground
                source={require('../../../assets/sales.png')}
                style={styles.imageLayout}
              >
                <Text style={styles.bottomContainerTitle}>
                  Sales Performance
                </Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomContainer} onPress={() => navigation.navigate('CustomerInsights')}>
              <ImageBackground
                source={require('../../../assets/customer.jpg')}
                style={styles.imageLayout}
              >
                <Text style={styles.bottomContainerTitle}>
                  Customer Insights
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </>
        )}
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
    bottomContainer: {
      marginTop: 20,
      marginHorizontal: 20,
      height: 120,
      borderRadius: 8,
      borderColor: baseColor,
      borderWidth: 1,
      overflow: 'hidden'
    },
    bottomContainerTitle: {
      color: baseColor,
      fontWeight: '800',
      fontSize: 18,
      padding: 15,
      backgroundColor: neonColor,
      borderRadius: 8
    },
    imageLayout: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
});

export default Analytics;