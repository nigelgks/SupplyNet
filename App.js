import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import { UserProfileContext } from './src/context/UserProfileContext';;
import { UserLocationContext } from './src/context/UserLocationContext';
import Login from './src/screens/Auth/Login';
import Home from './src/screens/Home/Home';
import Promotion from './src/screens/Home/Promotion';
import Voucher from './src/screens/Home/Voucher';
import News from './src/screens/Home/News';
import Orders from './src/screens/Order/Orders';
import OrderDetails from './src/screens/Order/OrderDetails';
import ShopList from './src/screens/Shop/ShopList';
import ShopDetails from './src/screens/Shop/ShopDetails';
import ShopMapView from './src/screens/Map/ShopMapView';
import NearbyMapView from './src/screens/Map/NearbyMapView';
import ItemDetails from './src/screens/Shop/ItemDetails';
import PickUser from './src/screens/Auth/PickUser';
import RegisterUser from './src/screens/Auth/RegisterUser';
import Inventory from './src/screens/Inventory/Inventory';
import SalesPerformance from './src/screens/Analytics/SalesPerformance';
import InventoryPerformance from './src/screens/Analytics/InventoryPerformance';
import CustomerInsights from './src/screens/Analytics/CustomerInsights';
import OrderInsights from './src/screens/Analytics/OrderInsights';
import Analytics from './src/screens/Analytics/Analytics';
import AddItem from './src/screens/Inventory/AddItem';
import ItemInventoryDetails from './src/screens/Inventory/ItemInventoryDetails';
import Messages from './src/screens/Home/Messages';
import Profile from './src/screens/Home/Profile';
import { FIREBASE_AUTH } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
    <Stack.Screen name="PickUser" component={PickUser} options={{ title: 'Registration' }}/>
    <Stack.Screen name="RegisterUser" component={RegisterUser}/>
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator 
    screenOptions={{
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'grey',
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        paddingBottom: 3
      }
    }}
  >
    <Tab.Screen name="Home" component={Home} options={{ headerShown: false, 
      tabBarIcon: ({ focused }) => (
        focused ? (
          <Foundation 
            name="home" 
            size={24}
          />
        ) : (
          <Feather 
            name={'home'}
            size={20}
          />
        )
      )
    }}/>
    <Tab.Screen name="Orders" component={Orders} options={{ headerShown: false, 
      tabBarIcon: ({ focused }) => (
        focused ? (
          <MaterialCommunityIcons 
            name="order-bool-descending" 
            size={20} 
          />
        ) : (
          <MaterialCommunityIcons 
            name={'order-bool-ascending'}
            size={20}
          />
        )
      )
    }}/>
    <Tab.Screen name="Inventory" component={Inventory} options={{ headerShown: false, 
      tabBarIcon: ({ focused }) => (
        focused ? (
          <MaterialIcons 
            name={'inventory'}
            size={20}
          />
        ) : (
          <AntDesign 
            name="inbox" 
            size={20}
          />
        )
      )
    }}/>
    <Tab.Screen name="Messages" component={Messages} options={{ headerShown: false, 
      tabBarIcon: ({ focused }) => (
        focused ? (
          <MaterialCommunityIcons 
            name="message-badge" 
            size={20} 
            color="black" />
        ) : (
          <MaterialCommunityIcons 
            name={'message-badge-outline'}
            size={20}
          />
        )
      )
    }}/>
    <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false, 
      tabBarIcon: ({ focused }) => (
        focused ? (
          <FontAwesome 
            name="user-circle-o" 
            size={20}
          />
        ) : (
          <FontAwesome 
            name="user-circle" 
            size={20}
          />
        )
      )
    }}/>
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location.coords)
    })();
  }, []);

  return (
    <UserLocationContext.Provider value={{location,setLocation}}>
      <UserProfileContext.Provider value={{user,setUser}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Auth'>
            {user ? (
              <>
                <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }}/>
                <Stack.Screen name="Promotion" component={Promotion}/>
                <Stack.Screen name="Voucher" component={Voucher}/>
                <Stack.Screen name="News" component={News}/>
                <Stack.Screen name="Shopping" component={ShopList} options={{ headerShown: false }}/>
                <Stack.Screen name="ShopDetail" component={ShopDetails} options={{ title: '' }}/>
                <Stack.Screen name="ShopMap" component={ShopMapView} options={{ title: '' }}/>
                <Stack.Screen name="NearbyMap" component={NearbyMapView} options={{ title: '' }}/>
                <Stack.Screen name="OrderDetails" component={OrderDetails}/>
                <Stack.Screen name="ItemDetail" component={ItemDetails}/>
                <Stack.Screen name="Analytics" component={Analytics} options={{ headerShown: false }}/>
                <Stack.Screen name="SalesPerformance" component={SalesPerformance} options={{ headerShown: false }}/>
                <Stack.Screen name="InventoryPerformance" component={InventoryPerformance} options={{ headerShown: false }}/>
                <Stack.Screen name="OrderInsights" component={OrderInsights} options={{ headerShown: false }}/>
                <Stack.Screen name="CustomerInsights" component={CustomerInsights} options={{ headerShown: false }}/>
                <Stack.Screen name="AddItem" component={AddItem} options={{ title: 'Add new item' }}/>
                <Stack.Screen name="ItemInventoryDetails" component={ItemInventoryDetails} options={{ title: '' }}/>
              </>
            ) : (
              <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }}/>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </UserProfileContext.Provider>
    </UserLocationContext.Provider>
  )
}

export default App