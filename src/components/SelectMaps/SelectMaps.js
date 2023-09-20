import React, {useState, useEffect, useMemo, useRef} from 'react';
import {Text, TouchableOpacity, Platform, LogBox} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import MapboxGL, {Logger, PointAnnotation} from '@rnmapbox/maps';
import Geocoder from 'react-native-geocoding';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';

import {BackGreyIcon, LocationIcon} from '@assets';
import CONFIG from '@config';
import {useStores} from '@store/root.store';
import styles from './SelectMaps.style';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);

Logger.setLogCallback((log) => {
  const {message} = log;
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});

Geocoder.init(CONFIG.GOOGLE_API_KEY);
MapboxGL.setAccessToken(CONFIG.MAP_BOX_TOKEN);

const SelectMaps = observer(() => {
  const annotationRef = useRef(null);
  const {routerStore, exploreStore} = useStores();
  const navigation = useNavigation();
  const componentStyles = styles();
  const [recenter, setRecenter] = useState('compass');
  const [tempLocation, setTempLocation] = useState([
    Number(exploreStore.tempDeliveryAddress.lng),
    Number(exploreStore.tempDeliveryAddress.lat),
  ]);
  const tempAddress = useMemo(
    () => exploreStore.currentDeliveryAddress,
    [exploreStore.currentDeliveryAddress],
  );

  useEffect(() => {
    MapboxGL.locationManager.start();

    return (): void => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  const goBack = async () => {
    await exploreStore.setCurrentDeliveryAddress(
      exploreStore.tempDeliveryAddress.lng,
      exploreStore.tempDeliveryAddress.lat,
      exploreStore.tempDeliveryAddress.address,
      exploreStore.tempDeliveryAddress.header,
    );
    await exploreStore.clearTempAddress();
    navigation.goBack();
  };

  const SaveLocation = () => {
    exploreStore.setFreqUsedAddress({
      address: exploreStore.currentDeliveryAddress.address,
      lat: exploreStore.currentDeliveryAddress.lat,
      lng: exploreStore.currentDeliveryAddress.lng,
      header: exploreStore.currentDeliveryAddress.address.substring(
        0,
        exploreStore.currentDeliveryAddress.address.indexOf(','),
      ),
    });
    navigation.navigate('Explore');
  };

  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        exploreStore.setCurrentDeliveryAddress(long, lat, address);
      })
      .catch((error) => console.warn(error));
  };

  return (
    <VStack style={componentStyles.containerMap}>
      <MapboxGL.MapView
        onDidFinishLoadingMap={() => {
          setRecenter('course');
        }}
        key="mainmap"
        styleURL={'mapbox://styles/mapbox/streets-v11'}
        style={{
          flex: 1,
        }}
        onPress={(e) => {
          setTempLocation([
            e.geometry.coordinates[0],
            e.geometry.coordinates[1],
          ]);
          getLocConvertAddress(
            e.geometry.coordinates[1],
            e.geometry.coordinates[0],
          );
        }}
        logoEnabled={false}
        attributionEnabled={false}
        showUserLocation={true}>
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: tempLocation,
            zoomLevel: 16,
          }}
          followZoomLevel={16}
          followPitch={0}
          animationMode="flyTo"
          animationDuration={400}
          centerCoordinate={tempLocation}
          zoomLevel={16}
          // followUserLocation
          triggerKey={routerStore?.location?.longitude}
          followUserMode={recenter}
          allowUpdates={true}
        />
        <MapboxGL.PointAnnotation
          selected={true}
          key="key2"
          id="id2"
          ref={annotationRef}
          coordinate={tempLocation}>
          {Platform.OS === 'ios' && (
            <VStack>
              <FastImage
                source={LocationIcon}
                style={{width: 45, height: 45}}
              />
            </VStack>
          )}
          <MapboxGL.Callout title="User" />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={goBack}
        style={componentStyles.containerBackIcon}>
        <FastImage source={BackGreyIcon} style={componentStyles.imgBackIcon} />
      </TouchableOpacity>
      <VStack style={componentStyles.containerBottomSheet}>
        <VStack>
          <Text style={[Fonts.headlineL]}>Pinned Location</Text>
          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <FastImage
              source={LocationIcon}
              style={componentStyles.imgLocationBottomSheet}
              resizeMode="contain"
            />
            <Spacer width={CustomSpacing(12)} />
            <VStack>
              <Text
                numberOfLines={1}
                style={[
                  Fonts.bodySemiBold,
                  {
                    color: Colors.neutral90,
                    width: dimensions.screenWidth * 0.75,
                  },
                ]}>
                {tempAddress.header}
              </Text>
              <Text
                style={[
                  Fonts.captionM,
                  {
                    color: Colors.neutral70,
                    width: dimensions.screenWidth * 0.75,
                  },
                ]}>
                {tempAddress.address}
              </Text>
            </VStack>
          </HStack>
          <Spacer height={CustomSpacing(20)} />
          <Button onPress={SaveLocation} type="primary" label="Save Location" />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default SelectMaps;
