import React, {useCallback, useMemo, useRef} from 'react';
import {Text, TouchableOpacity, Platform, LogBox} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import MapboxGL, {Logger, PointAnnotation} from '@rnmapbox/maps';
import Geocoder from 'react-native-geocoding';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {BackGreyIcon, LocationIcon, LocationAdd} from '@assets';
import CONFIG from '@config';
import {useStores} from '@store/root.store';
import styles from './MapsPickyuq.style';
import MapView, {Marker} from 'react-native-maps';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);

Geocoder.init(CONFIG.GOOGLE_API_KEY);
const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.004;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectMapPickyuq = observer((props) => {
  const {t, i18n} = useTranslation();
  const mapRef = useRef(null);
  const {routerStore, exploreStore, pickyuqStore} = useStores();
  const navigation = useNavigation();
  const componentStyles = styles();
  useFocusEffect(
    useCallback(async () => {
      pickyuqStore.getPreCheckout();
      mapRef.current?.animateToRegion({
        latitude: pickyuqStore.pickupLocation?.lat,
        longitude: pickyuqStore.pickupLocation?.lng,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      });
    }, []),
  );

  const tempAddress = useMemo(
    () => pickyuqStore.pickupLocation,
    [pickyuqStore.pickupLocation],
  );

  const goBack = async () => {
    navigation.goBack();
  };

  const SaveLocation = () => {
    pickyuqStore.setPickUpLocationAddress(
      pickyuqStore.pickupLocation?.lng,
      pickyuqStore.pickupLocation?.lat,
      pickyuqStore.pickupLocation?.address,
      pickyuqStore.pickupLocation?.header,
    );

    navigation.navigate('EnterLocationPickyuq', {
      from: props?.route?.params?.from,
    });
  };

  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        pickyuqStore.setPickUpLocationAddress(long, lat, address);
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
          latitude: pickyuqStore.pickupLocation?.lat
            ? parseFloat(pickyuqStore.pickupLocation?.lat)
            : 0.1,
          longitude: pickyuqStore.pickupLocation?.lng
            ? parseFloat(pickyuqStore.pickupLocation?.lng)
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
            latitude: parseFloat(pickyuqStore.pickupLocation?.lat),
            longitude: parseFloat(pickyuqStore.pickupLocation?.lng),
          }}>
          <VStack>
            <FastImage source={LocationIcon} style={{width: 45, height: 45}} />
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
          <Text style={[Fonts.headlineL]}>{t('HPickyuqUser')}</Text>
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
                {tempAddress?.header}
              </Text>
              <Text
                style={[
                  Fonts.captionM,
                  {
                    color: Colors.neutral70,
                    width: dimensions.screenWidth * 0.75,
                  },
                ]}>
                {tempAddress?.address}
              </Text>
            </VStack>
          </HStack>
          <Spacer height={CustomSpacing(20)} />
          <Button
            onPress={SaveLocation}
            type="primary"
            label={t('wlConfirmPickUser')}
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default SelectMapPickyuq;
