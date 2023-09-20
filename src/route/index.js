import React, {useEffect, useState} from 'react';

import {
  Easing,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from 'react-native-splash-screen';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';
import * as Sentry from '@sentry/react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import {Colors, Rounded, CustomSpacing, Fonts} from '@styles';
import {dimensions} from '@config/Platform.config';
import {
  Splash,
  VStack,
  CallOverlay,
  SelectMaps,
  Disconnect,
  WeatherRain,
  Button,
  SplashPermission,
  EnterLocation,
  SelectMapsSplash,
} from '@components';
import {
  Auth,
  Explore,
  DeliveryAddress,
  Favourite,
  DetailFavourite,
  SearchBar,
  ExploreMenuDetail,
  RestaurantPage,
  Account,
  EditProfile,
  SavedAddress,
  AddNewAddress,
  ManageAccount,
  DeleteAccount,
  PaymentMethod,
  Language,
  TopUp,
  HistoryPayyuq,
  Order,
  Chat,
  History,
  EditAddressForm,
  AddNewAddressForm,
  SavedFromMaps,
  HistoryDetail,
  RestaurantPageDetail,
  HistoryOrder,
  SearchFood,
  SearchVoucher,
  WebViewComponent,
  AffiliateTeam,
  FoodDetails,
  Atm,
  MobileBanking,
  Checkout,
  OrderDetail,
  DanaWebView,
  OtpVerify,
  Cousines,
  AffiliateUser,
  AffiliateDriver,
  AffiliateLeader,
  AffiliateMember,
  AffiliateInfluencer,
  Home,
  Pickyuq,
  DeliveryAddressPickyuq,
  SelectMapsPickyuq,
  EnterLocationPickyuq,
  CheckoutPickyuq,
  SelectMapDestination,
  EnterLocationDestination,
  CancelReason,
  ReviewDriver,
  ChatPickyuq,
} from '@pages';
import {
  AccountActive,
  AccountInactive,
  AccountTransition,
  ExploreActive,
  ExploreInactive,
  HistoryActive,
  HistoryInactive,
  OrderActive,
  OrderInactive,
  SearchActive,
  SearchInactive,
  SearchTransition,
} from '@assets';
import {useStores} from '@store/root.store';
import CONFIG from '@config';

const Stack = createStackNavigator();

Geocoder.init(CONFIG.GOOGLE_API_KEY);

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 100,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 250,
    easing: Easing.linear,
  },
};

const SplashStack = observer(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="SplashPermission" component={SplashPermission} />
      <Stack.Screen name="EnterLocation" component={EnterLocation} />
      <Stack.Screen name="SelectMapsSplash" component={SelectMapsSplash} />
    </Stack.Navigator>
  );
});

const AuthStack = observer(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: config,
          close: closeConfig,
        },
      }}
      animation="fade">
      <Stack.Screen name="Auth" component={Auth} />
    </Stack.Navigator>
  );
});

const MainNavigator = observer(() => {
  const MapboxGLLocationManager = NativeModules.MGLLocationModule;

  const {routerStore, authStore, exploreStore} = useStores();
  const [splashShow, setSplashShow] = useState(true);
  const [StatusLogin, setStatusLogin] = useState(false);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);
  const [location, setLocation] = useState(null);

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      authStore.setTokenFirebaseId(fcmToken);
      console.log('FCM Token', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const requestUserPermission = () => {
    messaging()
      .requestPermission()
      .then((authStatus) => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      });
  };

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authStore.tokenFirebaseId) {
      authStore.postTokenFcm();
    }
  }, [authStore.tokenFirebaseId]);

  // const getLastKnownLocation = async () => {
  //   const result = await requestLocationPermission();
  //   if (!result) return;
  //   try {
  //     const position = await MapboxGLLocationManager.getLastKnownLocation();
  //     console.log('LOCATION', Platform.OS, position);
  //     routerStore.setLocation({
  //       timestamp: position.timestamp,
  //       accuracy: position.coords.accuracy,
  //       altitude: position.coords.altitude,
  //       heading: position.coords.heading,
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //       speed: position.coords.speed,
  //     });
  //     setLocation(position.coords);
  //     getLocConvertAddress(position.coords.latitude, position.coords.longitude);
  //   } catch (error) {
  //     console.log('locationManager Error: ', error);
  //     setLocation(null);
  //   }
  // };

  // const getLocation = () => {
  //   const result = requestLocationPermission();
  //   result.then((res) => {
  //     if (res) {
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log('LOCATION', Platform.OS, position);
  //           routerStore.setLocation({
  //             timestamp: position.timestamp,
  //             accuracy: position.coords.accuracy,
  //             altitude: position.coords.altitude,
  //             heading: position.coords.heading,
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //             speed: position.coords.speed,
  //           });
  //           setLocation(position.coords);
  //           getLocConvertAddress(
  //             position.coords.latitude,
  //             position.coords.longitude,
  //           );
  //         },
  //         (error) => {
  //           console.log('locationManager Error: ', error);
  //           setLocation(null);
  //         },
  //         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //       );
  //     }
  //   });
  // };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type, state.isConnected);
      routerStore.setConnectedStatus(state.isConnected);
      if (!state.isConnected) {
        console.log('Connection DISCONNECT');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(async () => {
    SplashScreen.hide();
    // await AsyncStorage.setItem(
    //   'TOKEN',
    //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxYTY1YWZmLTkxOWYtNDdiNy1iYjFhLTgyZmQ3MDFlZGJhYyIsImlhdCI6MTY3MjM4MTg0MiwiZXhwIjoxNzAzOTM5NDQyfQ.xxP7EnfP5cCiFcJ4lb9BCflLsIhNMJGdl2Y7aDTeMVo',
    // );

    // Prod
    // await AsyncStorage.setItem(
    //   'USER_ID',
    //   'fb6c836b-c7c8-4b5b-9591-82692e7dbb2a',
    // );

    // await AsyncStorage.setItem(
    //   'USER_ID',
    //   '0643afac-0702-4681-a481-46fc72925f0e',
    // );

    // if (Platform.OS === 'ios') {
    //   getLocation();
    // } else {
    //   getLastKnownLocation();
    // }

    checkToken();
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    console.log('USER_IDNEW', USER_ID);
    if (
      USER_ID !== '0643afac-0702-4681-a481-46fc72925f0e' &&
      USER_ID !== null
    ) {
      Sentry.setUser({USER_ID: USER_ID});
      setStatusLogin(true);
      console.log('SUDAH LOGIN');
    } else {
      Sentry.setUser(null);
      setStatusLogin(false);
      authStore.verifyOtpSuccess(null);
    }

    if (routerStore.inAppUpdate) {
      console.log('In App Update......');
    } else {
      requestUserPermission();
    }
    // getLocation();
    console.log('routerStore.splashShow', routerStore.splashShow);
  }, []);

  // useEffect(() => {
  //   if (splashShow && location) {
  //     setSplashShow(false);
  //     // setTimeout(() => {
  //     // }, 5000);
  //   }
  // }, [location, permissionLocationStatus, routerStore.splashShow]);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName="OtpVerify"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: config,
              close: closeConfig,
            },
          }}>
          {routerStore.splashShow ? (
            <Stack.Screen name="SplashStack" component={SplashStack} />
          ) : (
            <>
              {/* BottomTabMenuExplore */}
              <Stack.Screen
                name="BottomTabMenu"
                // component={BottomTabMenu}
                component={
                  StatusLogin
                    ? routerStore.myMenu == 'Home'
                      ? BottomTabMenu
                      : BottomTabMenuExplore
                    : BottomTabMenuNoLogin
                }
              />
              <Stack.Screen name="AuthStack" component={AuthStack} />
              {/* EXPLORE MENU */}
              <Stack.Screen
                name="DeliveryAddress"
                component={DeliveryAddress}
              />
              <Stack.Screen name="Favourite" component={Favourite} />
              <Stack.Screen
                name="DetailFavourite"
                component={DetailFavourite}
              />
              <Stack.Screen name="SearchBar" component={SearchBar} />
              <Stack.Screen
                name="ExploreMenuDetail"
                component={ExploreMenuDetail}
              />
              <Stack.Screen
                name="RestaurantPage"
                component={RestaurantPage}
                options={{gestureEnabled: false}}
              />
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen name="SavedAddress" component={SavedAddress} />
              <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
              <Stack.Screen name="ManageAccount" component={ManageAccount} />
              <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
              <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
              <Stack.Screen name="Language" component={Language} />
              <Stack.Screen name="TopUp" component={TopUp} />
              <Stack.Screen name="HistoryPayyuq" component={HistoryPayyuq} />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="SelectMaps" component={SelectMaps} />
              <Stack.Screen
                name="EditAddressForm"
                component={EditAddressForm}
              />
              <Stack.Screen
                name="AddNewAddressForm"
                component={AddNewAddressForm}
              />
              <Stack.Screen name="SavedFromMaps" component={SavedFromMaps} />
              <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
              <Stack.Screen
                name="RestaurantPageDetail"
                component={RestaurantPageDetail}
              />
              <Stack.Screen name="HistoryOrder" component={HistoryOrder} />
              <Stack.Screen name="SearchFood" component={SearchFood} />
              <Stack.Screen name="SearchVoucher" component={SearchVoucher} />
              <Stack.Screen
                name="WebViewComponent"
                component={WebViewComponent}
              />
              <Stack.Screen name="AffiliateTeam" component={AffiliateTeam} />
              <Stack.Screen name="AffiliateUser" component={AffiliateUser} />
              <Stack.Screen
                name="AffiliateDriver"
                component={AffiliateDriver}
              />
              <Stack.Screen
                name="AffiliateLeader"
                component={AffiliateLeader}
              />
              <Stack.Screen
                name="AffiliateMember"
                component={AffiliateMember}
              />
              <Stack.Screen
                name="AffiliateInfluencer"
                component={AffiliateInfluencer}
              />
              <Stack.Screen name="FoodDetails" component={FoodDetails} />
              <Stack.Screen name="Atm" component={Atm} />
              <Stack.Screen name="MobileBanking" component={MobileBanking} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="OrderDetail" component={OrderDetail} />
              <Stack.Screen name="DanaWebView" component={DanaWebView} />
              <Stack.Screen name="OtpVerify" component={OtpVerify} />
              <Stack.Screen name="Cousines" component={Cousines} />
              <Stack.Screen name="Explore" component={Explore} />
              <Stack.Screen name="Pickyuq" component={Pickyuq} />
              <Stack.Screen
                name="DeliveryAddressPickyuq"
                component={DeliveryAddressPickyuq}
              />
              <Stack.Screen
                name="SelectMapsPickyuq"
                component={SelectMapsPickyuq}
              />
              <Stack.Screen
                name="EnterLocationPickyuq"
                component={EnterLocationPickyuq}
              />
              <Stack.Screen
                name="CheckoutPickyuq"
                component={CheckoutPickyuq}
              />
              <Stack.Screen
                name="SelectMapDestination"
                component={SelectMapDestination}
              />
              <Stack.Screen
                name="EnterLocationDestination"
                component={EnterLocationDestination}
              />
              <Stack.Screen name="CancelReason" component={CancelReason} />
              <Stack.Screen name="ReviewDriver" component={ReviewDriver} />
              <Stack.Screen name="ChatPickyuq" component={ChatPickyuq} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <CallOverlay
        showing={routerStore.onCall}
        close={() => routerStore.setOnCall(false)}
      />
      <Disconnect
        showing={!routerStore.isConnected}
        close={() => routerStore.setConnectedStatus(true)}
      />
      <WeatherRain
        showing={routerStore.weatherRain}
        close={() => routerStore.setWeatherRain(false)}
      />
    </>
  );
});
const BottomTabMenuNoLogin = observer(() => {
  const Tab = createBottomTabNavigator();
  const {authStore} = useStores();
  const [isCurrentProgress, setIsCurrentProgress] = useState('');
  const [shouldRender, setShouldRender] = useState(false);
  const showing = true;
  const goToLogin = async () => {
    authStore.setIsToken('NO_TOKEN');
  };

  useEffect(() => {
    let timeout;

    if (!showing) {
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    } else {
      setShouldRender(true);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showing]);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.secondaryMain,
          tabBarInactiveTintColor: Colors.neutral80,
          tabBarStyle: [
            {
              display: 'flex',
              height:
                Platform.OS === 'ios' ? CustomSpacing(88) : CustomSpacing(75),
              paddingVertical: CustomSpacing(14),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            },
            null,
          ],
          tabBarIcon: ({focused}) => {
            let iconName;
            let routeName;
            if (route.name === 'Home') {
              iconName = focused ? ExploreActive : ExploreInactive;
              routeName = 'Home';
            } else if (route.name === 'Orders') {
              iconName = focused ? OrderActive : OrderInactive;
              routeName = 'Orders';
            } else if (route.name === 'Search') {
              iconName = focused ? SearchActive : SearchInactive;
              routeName = 'Search';
            } else if (route.name === 'History') {
              iconName = focused ? HistoryActive : HistoryInactive;
              routeName = 'History';
            } else if (route.name === 'Account') {
              iconName = focused ? AccountActive : AccountInactive;
              routeName = 'Account';
            }
            return (
              <VStack>
                <VStack style={{}}>
                  <Button
                    style={{width: dimensions.screenWidth}}
                    size="large"
                    type="primary"
                    label="Let's get you in!"
                    onPress={goToLogin}
                  />
                </VStack>
              </VStack>
            );
          },
        };
      }}>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
});

const BottomTabMenu = observer(() => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.secondaryMain,
          tabBarInactiveTintColor: Colors.neutral80,
          tabBarStyle: [
            {
              display: 'flex',
              height:
                Platform.OS === 'ios' ? CustomSpacing(88) : CustomSpacing(75),
              paddingVertical: CustomSpacing(14),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            },
            null,
          ],
          tabBarIcon: ({focused}) => {
            let iconName;
            let routeName;
            if (route.name === 'Home') {
              iconName = focused ? ExploreActive : ExploreInactive;
              routeName = 'Home';
            } else if (route.name === 'Orders') {
              iconName = focused ? OrderActive : OrderInactive;
              routeName = 'Orders';
            } else if (route.name === 'Search') {
              iconName = focused ? SearchActive : SearchInactive;
              routeName = 'Search';
            } else if (route.name === 'History') {
              iconName = focused ? HistoryActive : HistoryInactive;
              routeName = 'History';
            } else if (route.name === 'Account') {
              iconName = focused ? AccountActive : AccountInactive;
              routeName = 'Account';
            }
            return (
              <VStack>
                <FastImage
                  style={{
                    width: CustomSpacing(45),
                    height: CustomSpacing(45),
                  }}
                  source={iconName}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </VStack>
            );
          },
        };
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Orders" component={Order} />
      <Tab.Screen name="Search" component={SearchBar} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
});

const BottomTabMenuExplore = observer(() => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({route}) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.secondaryMain,
          tabBarInactiveTintColor: Colors.neutral80,
          tabBarStyle: [
            {
              display: 'flex',
              height:
                Platform.OS === 'ios' ? CustomSpacing(88) : CustomSpacing(75),
              paddingVertical: CustomSpacing(14),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            },
            null,
          ],
          tabBarIcon: ({focused}) => {
            let iconName;
            let routeName;
            if (route.name === 'Explore') {
              iconName = focused ? ExploreActive : ExploreInactive;
              routeName = 'Explore';
            } else if (route.name === 'Orders') {
              iconName = focused ? OrderActive : OrderInactive;
              routeName = 'Orders';
            } else if (route.name === 'Search') {
              iconName = focused ? SearchActive : SearchInactive;
              routeName = 'Search';
            } else if (route.name === 'History') {
              iconName = focused ? HistoryActive : HistoryInactive;
              routeName = 'History';
            } else if (route.name === 'Account') {
              iconName = focused ? AccountActive : AccountInactive;
              routeName = 'Account';
            }
            return (
              <VStack>
                <FastImage
                  style={{
                    width: CustomSpacing(45),
                    height: CustomSpacing(45),
                  }}
                  source={iconName}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </VStack>
            );
          },
        };
      }}>
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Orders" component={Order} />
      <Tab.Screen name="Search" component={SearchBar} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
});

export default MainNavigator;
