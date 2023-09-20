import React, {
  useRef,
  useMemo,
  Suspense,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  PermissionsAndroid,
  Alert,
  Linking,
  Platform,
  AppState,
} from 'react-native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import FastImage from 'react-native-fast-image';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {NeedLocationAccess} from '@assets';
import {useStores} from '@store/root.store';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import styles from '../Disconnect/Disconnect.style';
import BackgroundTimer from 'react-native-background-timer';

const SplashPermission = observer(() => {
  const componentStyles = styles();
  const navigation = useNavigation();
  const {routerStore, exploreStore} = useStores();
  const [location, setLocation] = useState(null);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);
  const appState = useRef(AppState.currentState);
  var interval;

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      //clearInterval when your app has come back to the foreground
      BackgroundTimer.clearInterval(interval);
    } else {
      //app goes to background
      console.log('app goes to background');
      //tell the server that your app is still online when your app detect that it goes to background
      interval = BackgroundTimer.setInterval(async () => {
        if (routerStore.inAppUpdate) {
          console.log('In App Update......');
        } else {
          getLocation();
        }
      }, 5000);
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
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

  return (
    <Animatable.View
      duration={200}
      easing="ease-out"
      animation={'fadeIn'}
      useNativeDriver
      style={[
        StyleSheet.absoluteFillObject,
        {
          position: 'absolute',
          backgroundColor: Colors.backgroundMain,
        },
      ]}>
      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={'bounceInUp'}
        useNativeDriver
        style={componentStyles.callContainer}>
        <VStack
          style={{
            padding: CustomSpacing(4),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Spacer height={CustomSpacing(2)} />
          <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
            Location access is important
          </Text>
          <Spacer height={CustomSpacing(18)} />

          <Text style={[Fonts.label, {textAlign: 'justify'}]}>
            Hayuq require your location permission to prevent fraud actions
            while using the app.
          </Text>
          <Spacer height={CustomSpacing(4)} />
          <Text style={[Fonts.label, {textAlign: 'justify'}]}>
            For better user experience Hayuq request the location access to be
            able to show the restaurants around your area
          </Text>
          <Spacer height={CustomSpacing(2)} />
          <FastImage
            source={NeedLocationAccess}
            style={{
              width: CustomSpacing(256),
              height: CustomSpacing(256),
            }}
          />
          <Spacer height={CustomSpacing(64)} />
          <HStack>
            <Button
              label="Allow Location Access"
              type="primary"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }}
            />
          </HStack>
          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <Button
              label="Enter My Location"
              type="secondary"
              onPress={() => {
                navigation.navigate('EnterLocation');
              }}
            />
          </HStack>
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
});

export default SplashPermission;
