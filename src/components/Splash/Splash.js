import React, {useEffect, useState} from 'react';
import {
  View,
  Animated,
  Easing,
  Image,
  Dimensions,
  Platform,
  Text,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  LogoIcon,
  loading1,
  loading2,
  loading3,
  loading4,
  loading5,
  loading6,
} from '@assets';
import {useNavigation} from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
const {width, height} = Dimensions.get('window');

const Splash = observer(() => {
  const navigation = useNavigation();
  const {routerStore, exploreStore} = useStores();
  const [location, setLocation] = useState(null);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);
  const dataLoading = [
    {
      id: 1,
      image: loading1,
    },

    {
      id: 2,
      image: loading2,
    },

    {
      id: 3,
      image: loading3,
    },

    {
      id: 4,
      image: loading4,
    },

    {
      id: 5,
      image: loading5,
    },

    {
      id: 6,
      image: loading6,
    },
  ];

  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');

        if (
          exploreStore.currentDeliveryAddress.lat &&
          exploreStore.currentDeliveryAddress.lng
        ) {
          setPermissionLocationStatus(true);
          routerStore.setSplashShow(false);
          return true;
        } else {
          if (granted === 'granted' && routerStore.splashShow) {
            console.log('IOS GRANTED LOCATION');
            setPermissionLocationStatus(true);
            routerStore.setSplashShow(false);
            return true;
          } else {
            console.log('IOS NOT GRANTED LOCATION');
            setPermissionLocationStatus(false);
            navigation.navigate('SplashPermission');
            return false;
          }
        }
      } catch (err) {
        console.log('Permission error', err);
        navigation.navigate('SplashPermission');
        return false;
      }
    } else {
      try {
        // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message:
              'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          exploreStore.currentDeliveryAddress.lat &&
          exploreStore.currentDeliveryAddress.lng
        ) {
          routerStore.setSplashShow(false);
          setPermissionLocationStatus(true);
          return true;
        } else {
          if (granted === 'granted' && routerStore.splashShow) {
            console.log('ANDROID GRANTED LOCATION');
            routerStore.setSplashShow(false);
            setPermissionLocationStatus(true);
            return true;
          } else {
            console.log('ANDROID NOT GRANTED LOCATION');
            setPermissionLocationStatus(false);
            navigation.navigate('SplashPermission');
            return false;
          }
        }
      } catch (err) {
        console.log('Permission error', err);
        navigation.navigate('SplashPermission');
        return false;
      }
    }
  };
  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        console.log('FindLocation', lat, long);
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        exploreStore.setCurrentLocationAddress(long, lat, address);
        exploreStore.setFreqUsedAddress({
          address: address,
          lat: lat,
          lng: long,
          header: address.substring(0, address.indexOf(',')),
        });
      })
      .catch((error) => console.warn(error));
  };

  const getLocation = async () => {
    const result = requestLocationPermission();

    await result
      .then((res) => {
        if (res) {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log('LOCATION', Platform.OS, position);
              routerStore.setLocation({
                timestamp: position.timestamp,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                heading: position.coords.heading,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
              });
              setLocation(position.coords);
              getLocConvertAddress(
                position.coords.latitude,
                position.coords.longitude,
              );
            },
            (error) => {
              console.log('locationManager Error: ', error);
              setLocation(null);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      })
      .catch((Err) => console.log('Error', Err));
  };

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.navigate('SplashPermission');
    // }, 1000);
    console.log(
      'HAVE currentDeliveryAddress',
      exploreStore.currentDeliveryAddress,
    );
    if (routerStore.inAppUpdate) {
      console.log('In App Update......');
    } else {
      if (
        exploreStore.currentDeliveryAddress.lat &&
        exploreStore.currentDeliveryAddress.lng
      ) {
        routerStore.setSplashShow(false);
        setPermissionLocationStatus(true);
        console.log('Already have set Location');
      } else {
        getLocation();
      }
    }
  }, []);

  // create a function to render the loading image
  const RenderLoading = () => {
    return dataLoading.map((item, index) => {
      let duration = 0;
      switch (true) {
        case index === 0:
          duration = 400;
          break;
        case index === 1:
          duration = 800;
          break;
        case index === 2:
          duration = 1200;
          break;
        case index === 3:
          duration = 1600;
          break;
        case index === 4:
          duration = 2000;
          break;
        case index === 5:
          duration = 2400;
          break;
        case index === 6:
          duration = 2800;
          break;
        default:
          break;
      }
      return (
        <Animatable.View
          key={index}
          duration={duration}
          easing="ease-out"
          animation={'bounceInRight'}
          useNativeDriver>
          <Animated.Image
            style={{
              transform: [{rotate: spin}],
              width: CustomSpacing(30),
              height: CustomSpacing(30),
              marginHorizontal: CustomSpacing(5),
            }}
            source={item.image}
          />
        </Animatable.View>
      );
    });
  };
  return (
    <View style={[{backgroundColor: Colors.primaryMain}, Layout.heightFull]}>
      <VStack
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <FastImage
          style={{
            width: CustomSpacing(100),
            height: CustomSpacing(100),
          }}
          source={LogoIcon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Spacer height={CustomSpacing(100)} />
        <HStack>{RenderLoading()}</HStack>
        <VStack
          style={{
            position: 'absolute',
            bottom: CustomSpacing(32),
          }}>
          <Text
            style={[
              Fonts.subhead,
            ]}>{`Version ${DeviceInfo.getVersion()}`}</Text>
        </VStack>
      </VStack>
    </View>
  );
});

export default Splash;
