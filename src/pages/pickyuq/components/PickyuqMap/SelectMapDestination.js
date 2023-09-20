import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {Text, TouchableOpacity, Platform, LogBox} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import MapboxGL, {Logger, PointAnnotation} from '@rnmapbox/maps';
import Geocoder from 'react-native-geocoding';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';

import {BackGreyIcon, LocationIcon, LocationAdd} from '@assets';
import CONFIG from '@config';
import {useStores} from '@store/root.store';
import styles from './MapsPickyuq.style';
import MapView, {Marker} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);

Geocoder.init(CONFIG.GOOGLE_API_KEY);

const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.004;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectMapDestination = observer(() => {
  const {t, i18n} = useTranslation();
  const mapRef = useRef(null);
  const {routerStore, exploreStore, pickyuqStore} = useStores();
  const navigation = useNavigation();
  const componentStyles = styles();

  const tempAddress = useMemo(
    () => pickyuqStore.destinationLocation,
    [pickyuqStore.destinationLocation],
  );
  useFocusEffect(
    useCallback(async () => {
      pickyuqStore.getPreCheckout();
      mapRef.current?.animateToRegion({
        latitude: pickyuqStore.destinationLocation?.lat,
        longitude: pickyuqStore.destinationLocation?.lng,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      });
    }, []),
  );

  const goBack = async () => {
    navigation.goBack();
  };

  const SaveLocation = () => {
    pickyuqStore.setDestinationLocationAddress(
      pickyuqStore.destinationLocation?.lng,
      pickyuqStore.destinationLocation?.lat,
      pickyuqStore.destinationLocation?.address,
      pickyuqStore.destinationLocation?.header,
    );

    navigation.navigate('EnterLocationDestination');
  };

  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        pickyuqStore.setDestinationLocationAddress(long, lat, address);
      })
      .catch((error) => console.warn(error));
  };

  return (
    <VStack style={componentStyles.containerMap}>
      <MapView
        onPress={(e) => {
          console.log('eees', e);
          getLocConvertAddress(
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          );
        }}
        ref={mapRef}
        initialRegion={{
          latitude: pickyuqStore.destinationLocation?.lat
            ? parseFloat(pickyuqStore.destinationLocation?.lat)
            : 0.1,
          longitude: pickyuqStore.destinationLocation?.lng
            ? parseFloat(pickyuqStore.destinationLocation?.lng)
            : 0.1,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={{
          flex: 1,
        }}
        zoomEnabled={true}
        showsUserLocation={true}>
        <Marker
          coordinate={{
            latitude: parseFloat(pickyuqStore.destinationLocation?.lat),
            longitude: parseFloat(pickyuqStore.destinationLocation?.lng),
          }}>
          <VStack>
            <FastImage source={LocationAdd} style={{width: 45, height: 45}} />
          </VStack>
        </Marker>
      </MapView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={goBack}
        style={componentStyles.containerBackIcon}>
        <FastImage source={BackGreyIcon} style={componentStyles.imgBackIcon} />
      </TouchableOpacity>
      <VStack style={componentStyles.containerBottomSheet}>
        <VStack>
          <Text style={[Fonts.headlineL]}>{t('HDestinationUser')}</Text>
          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <FastImage
              source={LocationAdd}
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
          <Button
            onPress={SaveLocation}
            type="primary"
            label={t('wlConfirmDestinationUser')}
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default SelectMapDestination;
