import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  LogBox,
} from 'react-native';
import {dimensions} from '@config/Platform.config';

import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  BackGreyIcon,
  StarIcon,
  AffiliateBg,
  SearchOutlineIcon,
  LocationIcon,
  LocationAdd,
  james,
  Time,
  AddBookmarkIcon,
  PickyuqBG,
  PhoneBG,
  BikeBG,
} from '@assets';
import styles from './Pickyuq.style';

import Geocoder from 'react-native-geocoding';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import CONFIG from '@config';
import {Rating, AirbnbRating} from 'react-native-ratings';
import MapView, {Marker} from 'react-native-maps';

Geocoder.init(CONFIG.GOOGLE_API_KEY);
// import Geolocation from '@react-native-community/geolocation';
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);
const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.004;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Pickyuq = observer(() => {
  const {t, i18n} = useTranslation();
  const mapRef = useRef(null);
  const {exploreStore, pickyuqStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [affiliateData, setAffiliateData] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [statusAffiliate, setStatusAffiliate] = useState(true);
  const [recenter, setRecenter] = useState('compass');
  const [dataLastOrder, setDataLastOrder] = useState(null);
  const [tempLocation, setTempLocation] = useState({
    latitude: exploreStore.currentDeliveryAddress.lat,
    longitude: exploreStore.currentDeliveryAddress.lng,
  });

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(async () => {
      console.log('PICKYUQLATTLNG', exploreStore.currentDeliveryAddress);
      await pickyuqStore.getOrderPickyuq();
      mapRef.current?.animateToRegion({
        latitude: exploreStore.currentDeliveryAddress.lat
          ? exploreStore.currentDeliveryAddress.lat
          : 0.1,
        longitude: exploreStore.currentDeliveryAddress.lng
          ? exploreStore.currentDeliveryAddress.lng
          : 0.1,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      });
    }, []),
  );

  useEffect(() => {
    if (pickyuqStore.OrderPickyuData) {
      setDataLastOrder(pickyuqStore.OrderPickyuData);
    }
  }, [pickyuqStore.OrderPickyuData]);

  console.log('dataLastOrder', dataLastOrder);
  return (
    <VStack
      style={{
        height: '100%',
        backgroundColor: Colors.neutral20,
      }}>
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={PickyuqBG}
            style={componentStyles.imgPickyuqBg}
            resizeMode="cover"
          />
        </Animatable.View>
        <Animatable.View animation="bounceInLeft" delay={200}>
          <FastImage
            source={BikeBG}
            style={{
              width: 105,
              height: CustomSpacing(110),
              position: 'absolute',
              left: 42,
              top: -124,
              zIndex: 1000,
            }}
          />
        </Animatable.View>
        <Animatable.View animation="bounceInUp" delay={200}>
          <FastImage
            source={PhoneBG}
            style={{
              width: 100,
              height: CustomSpacing(120),
              position: 'absolute',
              right: 34,
              top: -130,
              zIndex: 1000,
            }}
          />
        </Animatable.View>
        <HStack
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? CustomSpacing(44) : CustomSpacing(24),
            left: CustomSpacing(18),
          }}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgGoback}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
        </HStack>
      </VStack>
      <Spacer height={CustomSpacing(12)} />
      <VStack style={{backgroundColor: Colors.neutral10, zIndex: 1000}}>
        {/* Search lOCATION */}
        <VStack
          style={{
            paddingHorizontal: CustomSpacing(16),
            position: 'absolute',
            bottom: CustomSpacing(-53),
            // top: -CustomSpacing(1),
            width: '100%',
          }}>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('EnterLocationDestination', {from: 'pickyuq'})
            }
            accessible={false}>
            <HStack style={componentStyles.searchBarContainer}>
              <HStack>
                <FastImage
                  source={LocationIcon}
                  style={componentStyles.imgSearchLocationIcon}
                />

                <Spacer width={CustomSpacing(12)} />
                <Text
                  style={[
                    Fonts.labelSemiBold,
                    {
                      color: Colors.neutral90,
                    },
                  ]}>
                  {t('wlYuqGohere')}
                </Text>
              </HStack>
              <FastImage
                source={SearchOutlineIcon}
                style={componentStyles.imgSearchOutlineIcon}
              />
            </HStack>
          </TouchableWithoutFeedback>
        </VStack>
      </VStack>
      <ScrollView
        style={{
          height: '100%',
          backgroundColor: Colors.backgroundColor,
        }}>
        {/* ------ Header------ */}

        <Spacer height={CustomSpacing(64)} />

        <HStack>
          <TouchableOpacity
            onPress={() => {
              pickyuqStore.setPickUpLocationAddress(
                exploreStore.currentDeliveryAddress.lng,
                exploreStore.currentDeliveryAddress.lat,
                exploreStore.currentDeliveryAddress.address,
                exploreStore.currentDeliveryAddress.header,
              );
              navigation.navigate('SelectMapsPickyuq');
            }}
            style={componentStyles.containerCard}>
            <VStack
              style={{
                height: CustomSpacing(dimensions.screenWidth - 270),
                width:
                  Platform.OS == 'ios'
                    ? CustomSpacing(dimensions.screenWidth - 112)
                    : CustomSpacing(dimensions.screenWidth - 80),
                position: 'absolute',
                zIndex: 1000,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.neutral60,
                opacity: 0.6,
                borderRadius: Rounded.xl,
              }}>
              <Text
                style={[
                  Fonts.headlineL,
                  {
                    fontSize: 23,
                    color: Colors.primaryMain,
                  },
                ]}>
                {t('wlShowMap')}
              </Text>
            </VStack>
            <MapView
              ref={mapRef}
              initialRegion={{
                latitude: exploreStore.currentDeliveryAddress.lat
                  ? exploreStore.currentDeliveryAddress.lat
                  : 0.1,
                longitude: exploreStore.currentDeliveryAddress.lng
                  ? exploreStore.currentDeliveryAddress.lng
                  : 0.1,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={{
                flex: 1,
                borderRadius: Rounded.xl,
                width:
                  Platform.OS == 'ios'
                    ? CustomSpacing(dimensions.screenWidth - 112)
                    : CustomSpacing(dimensions.screenWidth - 80),
                zIndex: -10,
              }}
              zoomEnabled={true}
              showsUserLocation={true}>
              {exploreStore.tempDeliveryAddress.lat &&
              exploreStore.tempDeliveryAddress.lat ? (
                <Marker
                  coordinate={{
                    latitude: parseFloat(
                      exploreStore.currentDeliveryAddress.lat,
                    ),
                    longitude: parseFloat(
                      exploreStore.currentDeliveryAddress?.lng,
                    ),
                  }}
                  pinColor="red"
                />
              ) : null}
            </MapView>
          </TouchableOpacity>
        </HStack>

        <Spacer height={CustomSpacing(23)} />
        <HStack
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: CustomSpacing(8),
          }}>
          {/* <ScrollView horizontal>
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 1</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 2</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 3</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 4</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 5</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 6</Text>
            </TouchableOpacity>
          </ScrollView> */}
        </HStack>
        <Spacer height={CustomSpacing(12)} />
        {/*Tujuan Terakhir*/}

        <ScrollView style={{paddingHorizontal: CustomSpacing(23)}}>
          <Text style={[Fonts.headlineL]}>{t('HLastDesti')}</Text>
          <Spacer height={CustomSpacing(8)} />
          {dataLastOrder?.map((item, index) => {
            return (
              <>
                <HStack
                  style={{
                    flex: 1,
                    // width: CustomSpacing(290),
                    justifyContent: 'space-between',
                  }}>
                  <HStack>
                    <FastImage
                      source={Time}
                      style={componentStyles.imgTimeIcon}
                    />
                    <Spacer width={CustomSpacing(8)} />

                    <VStack style={{width: CustomSpacing(225)}}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={[Fonts.labelSemiBold]}>
                        {item?.drop?.address?.slice(
                          0,
                          item?.drop?.address?.indexOf(','),
                        )}
                      </Text>
                      <Spacer height={CustomSpacing(4)} />
                      <HStack style={{width: CustomSpacing(225)}}>
                        <Text ellipsizeMode="tail" numberOfLines={1}>
                          {item?.drop?.address}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  {/* <Spacer width={CustomSpacing(8)} /> */}
                  <TouchableOpacity disabled={true}>
                    <FastImage
                      source={AddBookmarkIcon}
                      style={componentStyles.imgBookmarkIcon}
                    />
                  </TouchableOpacity>
                </HStack>
                <Spacer height={CustomSpacing(12)} />
              </>
            );
          })}
        </ScrollView>

        <Spacer height={CustomSpacing(18)} />
      </ScrollView>
      <Spacer height={CustomSpacing(12)} />
    </VStack>
  );
});

export default Pickyuq;
