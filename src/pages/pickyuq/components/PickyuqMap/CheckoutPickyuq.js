import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {Text, TouchableOpacity, Platform, LogBox} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import {CustomSpacing, Rounded, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {dimensions} from '@config/Platform.config';
import {
  BackGreyIcon,
  LocationAdd,
  LocationIcon,
  Cash,
  ChevronRightIcon,
  LoadingLottie,
  StarIcon,
  MessageNotifIcon,
  User,
  CloseOutlineIcon,
  Payyuq,
  RectangleActive,
  Rectangle,
} from '@assets';
import CONFIG from '@config';
import {useStores} from '@store/root.store';
import styles from './MapsPickyuq.style';
import * as Animatable from 'react-native-animatable';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Numbro from '@utils/numbro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker, MarkerAnimated} from 'react-native-maps';
import {useTranslation} from 'react-i18next';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Smartlook from 'react-native-smartlook-analytics';

const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTARIDE = 0.009;
const LATITUDE_DELTA = 0.015;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTARIDE * ASPECT_RATIO;

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);

Geocoder.init(CONFIG.GOOGLE_API_KEY);

const CheckoutPickyuq = observer(() => {
  const {t, i18n} = useTranslation();
  const mapRef = useRef(null);
  const bottomSheetRefPaymenType = useRef(null);
  const bottomSheetRefEnoughtBallance = useRef(null);
  const snapPointsPaymentType = useMemo(() => ['40%', '35%'], []);
  const snapPointsEnoughtBallance = useMemo(() => ['50%', '50%'], []);
  const {accountStore, orderStore, pickyuqStore} = useStores();
  const navigation = useNavigation();
  const componentStyles = styles();
  const [orderStatus, setOrderStatus] = useState(0);
  const [orderStatusName, setOrderStatusName] = useState(0);
  const [timeSearchDriver, setTimeSearchDriver] = useState(5);
  const timeSearchDriverRef = useRef(timeSearchDriver);
  const [selectedService, setSelectedService] = useState(null);
  const [dataDriver, setDataDriver] = useState(null);
  const [paymenType, setPaymentType] = useState(null);
  const [selectedMap, setSelectedMap] = useState(false);
  const [statusFirst3, setStatusFirst3] = useState(false);
  const [statusFirst4, setstatusFirst4] = useState(false);

  const PaymentMethod = [
    {
      id: 1,
      name: 'Payyuq',
      img: Payyuq,
    },
    {
      id: 2,
      name: 'Cash',
      img: Cash,
    },
  ];
  useFocusEffect(
    useCallback(async () => {
      pickyuqStore.getPreCheckout();
      // mapRef.current?.animateToRegion({
      //   latitude: pickyuqStore.pickupLocation?.lat,
      //   longitude: pickyuqStore.pickupLocation?.lng,
      //   longitudeDelta: LONGITUDE_DELTA,
      //   latitudeDelta: LATITUDE_DELTA,
      // });
      if (accountStore?.accountData?.userswallet?.amount) {
        setPaymentType(PaymentMethod[0]);
      } else {
        setPaymentType(PaymentMethod[1]);
      }
    }, []),
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log('REFF');
  }, []);

  const handleCloseModalPaymentPress = useCallback(() => {
    bottomSheetRefPaymenType.current?.close();
  }, []);

  const handlePresentModalPaymentPress = useCallback(() => {
    bottomSheetRefPaymenType.current?.present();
  }, []);

  const handlePresentModalEnoughtPaymentPress = useCallback(() => {
    bottomSheetRefEnoughtBallance.current?.present();
  }, []);

  const handleCloseModalEnoughtPayment = useCallback(() => {
    bottomSheetRefEnoughtBallance.current?.close();
  }, []);

  useEffect(() => {
    console.log('dataacheckout', pickyuqStore.preCheckoutData);

    if (pickyuqStore.preCheckoutData == null) {
      pickyuqStore.getPreCheckout();
    }
    // else if (orderStatus == 0 && pickyuqStore?.preCheckoutData?.length == 1) {
    //   setSelectedService(pickyuqStore?.preCheckoutData[0]);
    // }
  }, [pickyuqStore.preCheckoutData]);

  useEffect(() => {
    if (orderStatus == 1) {
      const timerSearchDriver = setInterval(() => {
        timeSearchDriverRef.current -= 1;
        if (timeSearchDriverRef.current < 0) {
          clearInterval(timerSearchDriver);
        } else {
          setTimeSearchDriver(timeSearchDriverRef.current);
        }
      }, 2000);
      return () => {
        clearInterval(timerSearchDriver);
      };
    }

    console.log('receiverOn', orderStore.receiverOn);
    if (orderStore.receiverOn === false) {
      CONFIG.portSocketChat.on('received', async (data) => {
        console.log('received USER SOCKET123 =>>>>>>>', data.data['_id']);
        orderStore.setReceiverOn(true);
        if (data.data) {
          const cekData = orderStore.listChatData?.find(
            (a) => a['_id'] == data.data['_id'],
          );
          console.log('received USER cekData =>>>>>>>', cekData);
          if (cekData) {
            console.log('received USER SAME DATA');
          } else {
            await orderStore.setListChat(data.data);
          }
        }
      });
    } else {
      console.log('received SUDAH ACTIVED =>>>>>>>');
    }
  }, [orderStatus]);

  useEffect(() => {
    if (timeSearchDriver == 0) {
      searchDriver();
    }
  }, [timeSearchDriver]);

  const getLocConvertAddressDriver = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        pickyuqStore.setDestinationLocationAddress(long, lat, address);
      })
      .catch((error) => console.warn(error));
  };

  const getLocConvertAddressOtw = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        pickyuqStore.setDestinationLocationAddress(long, lat, address);
      })
      .catch((error) => console.warn(error));
  };

  const getOtwToLocation = async (lat, long) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const res = json.results[0].formatted_address;
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        pickyuqStore.setPickUpLocationAddress(long, lat, address);
      })
      .catch((error) => console.warn(error));
  };

  const searchDriver = async () => {
    pickyuqStore.getCheckout(selectedService?.options, selectedService?.type);

    // Tes Live
    // setTimeout(() => {
    //   getLocConvertAddress(-6.340846, 106.735809);
    //   mapRef.current?.animateToRegion({
    //     latitude: -6.340846,
    //     longitude: 106.735809,
    //     longitudeDelta: LONGITUDE_DELTA,
    //     latitudeDelta: LATITUDE_DELTA,
    //   });
    // }, 3000);

    CONFIG.portSocket.on('order-status', (data) => {
      console.log('Pickyuq-order-status', data.data.status);
      console.log('Pickyuq-order-drivers', data.data.drivers);
      setOrderStatus(data.data?.status);
      setOrderStatusName(data.data.status_name);
      if (Number(data.data.status) == 4) {
        getLocConvertAddressOtw(
          pickyuqStore?.destinationLocationSaved?.lat,
          pickyuqStore?.destinationLocationSaved?.long,
        );
        mapRef.current?.animateToRegion({
          latitude: pickyuqStore?.destinationLocationSaved?.lat,
          longitude: pickyuqStore?.destinationLocationSaved?.long,
          longitudeDelta: LONGITUDE_DELTA * 2,
          latitudeDelta: LATITUDE_DELTARIDE * 2,
        });
      } else if (Number(data.data.status) == 5) {
        setTimeout(() => {
          navigation.navigate('ReviewDriver', {
            dataFinish: data.data,
          });
        }, 3000);
      }

      if (data.data.drivers) {
        console.log('Pickyuq-order-status HAVE DRIVER', data.data?.status);
        timeSearchDriverRef.current = 5;
        setTimeSearchDriver(5);
        setDataDriver(data.data.drivers);
        console.log('Pickyuq-order-status GO LIVE DRIVER');
        CONFIG.portSocket.on('driver-location-live', async (data) => {
          console.log('Pickyuq-order-status LIVE DRIVER', data);
          console.log('Pickyuq-order-status LIVE DRIVER2', orderStatus);

          if (Number(data.data.status) == 3) {
            getLocConvertAddressDriver(data?.data?.lat, data?.data?.long);
            if (statusFirst3 == false) {
              mapRef.current?.animateToRegion({
                latitude: data?.data?.lat,
                longitude: data?.data?.long,
                longitudeDelta: LONGITUDE_DELTA * 2,
                latitudeDelta: LATITUDE_DELTARIDE * 2,
              });
              setStatusFirst3(true);
            }
          } else {
            console.log('Goo with status 4');
            getOtwToLocation(data?.data?.lat, data?.data?.long);
            if (statusFirst4 == false) {
              mapRef.current?.animateToRegion({
                latitude: data?.data?.lat,
                longitude: data?.data?.long,
                longitudeDelta: LONGITUDE_DELTA * 2,
                latitudeDelta: LATITUDE_DELTARIDE * 2,
              });
              setstatusFirst4(true);
            }
          }
        });
      }
    });
  };

  const SelectedOption = () => {
    // console.log('selectedService', accountStore?.accountData?.userswallet);
    if (paymenType?.id == 2) {
      setOrderStatus(1);
    } else {
      if (
        parseFloat(
          accountStore?.accountData?.userswallet?.amount
            ? accountStore?.accountData?.userswallet?.amount
            : 0,
        ) < parseFloat(selectedService?.prices?.price?.total)
      ) {
        handlePresentModalEnoughtPaymentPress();
      } else {
        setOrderStatus(1);
      }
    }
  };

  const CancelButton = () => {
    if (orderStatus < 4 && orderStatus > 1) {
      timeSearchDriverRef.current = 5;
      setOrderStatus(0);
      setTimeSearchDriver(5);
      navigation.navigate('CancelReason', {
        DataOrder: pickyuqStore?.CheckoutData,
      });
    } else {
      timeSearchDriverRef.current = 5;
      setOrderStatus(0);
      setTimeSearchDriver(5);
    }
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goTopUp = () => {
    navigation.navigate('HistoryPayyuq', {modalPayment: true});
  };

  const goPaymentChange = () => {
    handleCloseModalEnoughtPayment();
    handlePresentModalPaymentPress();
  };

  const goToChat = async () => {
    const dataOrders = pickyuqStore?.CheckoutData;
    await orderStore.setListChat(null);
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    console.log('setnull first', dataOrders, USER_ID);
    await CONFIG.portSocketChat.emit('find-rooms', {
      code: dataOrders?.code,
      users_id: USER_ID,
    });

    await CONFIG.portSocketChat.on('find-rooms', (data) => {
      console.log('chat USER SOCKET FIND ROOMS', data.data);

      orderStore.setListChat(data.data.list, true);
    });

    // if (orderStore.receiverOn === false) {
    //   await CONFIG.portSocketChat.on('received', async (data) => {
    //     console.log('received USER SOCKET123 =>>>>>>>', data.data);
    //     orderStore.setReceiverOn(true);
    //     if (data.data) {
    //       await orderStore.setListChat(data.data);
    //     }
    //   });
    // } else {
    //   console.log('received SUDAH ACTIVED =>>>>>>>');
    // }

    await navigation.navigate('ChatPickyuq', {dataOrders, dataDriver});
  };

  return (
    <VStack style={componentStyles.containerMap}>
      <MapView
        onTouchStart={() => {
          setSelectedMap(true);
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            setSelectedMap(false);
          }, 1000);
        }}
        onTouchCancel={() => {
          setTimeout(() => {
            setSelectedMap(false);
          }, 1000);
        }}
        ref={mapRef}
        initialRegion={{
          latitude: pickyuqStore.pickupLocation?.lat
            ? parseFloat(pickyuqStore.pickupLocation?.lat)
            : 0.1,
          longitude: pickyuqStore.pickupLocation?.lng
            ? parseFloat(pickyuqStore.pickupLocation?.lng)
            : 0.1,
          latitudeDelta: LATITUDE_DELTA * 5,
          longitudeDelta: LONGITUDE_DELTA * 5,
        }}
        style={{
          flex: 1,
        }}
        zoomEnabled={true}
        showsUserLocation={true}>
        <MapViewDirections
          optimizeWaypoints={true}
          origin={{
            latitude: parseFloat(pickyuqStore.pickupLocation?.lat),
            longitude: parseFloat(pickyuqStore.pickupLocation?.lng),
          }}
          destination={{
            latitude: parseFloat(pickyuqStore.destinationLocation?.lat),
            longitude: parseFloat(pickyuqStore.destinationLocation?.lng),
          }}
          strokeWidth={6}
          strokeColor={Colors.primaryMain}
          apikey={CONFIG.GOOGLE_API_KEY}
        />
        <Marker
          coordinate={{
            latitude: parseFloat(pickyuqStore.pickupLocation?.lat),
            longitude: parseFloat(pickyuqStore.pickupLocation?.lng),
          }}>
          <VStack>
            <FastImage source={LocationIcon} style={{width: 45, height: 45}} />
          </VStack>
        </Marker>

        <Marker
          coordinate={{
            latitude: parseFloat(pickyuqStore.destinationLocation?.lat),
            longitude: parseFloat(pickyuqStore.destinationLocation?.lng),
          }}>
          <VStack>
            {orderStatus == 3 ? (
              <FastImage
                source={
                  dataDriver?.driverdetails?.path
                    ? {
                        uri: `${dataDriver?.driverdetails?.path}`,
                      }
                    : User
                }
                style={{width: 45, height: 45, borderRadius: 23}}
              />
            ) : (
              <FastImage source={LocationAdd} style={{width: 45, height: 45}} />
            )}
          </VStack>
        </Marker>
      </MapView>

      {/* modal Enought Balance */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRefEnoughtBallance}
          index={0}
          snapPoints={snapPointsEnoughtBallance}
          onChange={handleSheetChanges}
          containerStyle={{
            zIndex: 1000,
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <VStack
            style={{
              padding: CustomSpacing(16),
            }}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.headlineL]}>Insufficient balance</Text>

              <TouchableOpacity
                onPress={() => handleCloseModalEnoughtPayment()}>
                <FastImage
                  source={CloseOutlineIcon}
                  style={{
                    width: CustomSpacing(24),
                    height: CustomSpacing(24),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <Text style={[Fonts.label]}>
              To complete your transaction, please top-up your Payyuq Balance
            </Text>
            <VStack>
              <HStack
                style={{
                  padding: CustomSpacing(18),
                  justifyContent: 'space-between',
                }}>
                <VStack>
                  <FastImage
                    source={Payyuq}
                    style={{
                      width: dimensions.screenWidth * 0.13,
                      height: CustomSpacing(27),
                    }}
                    resizeMode="contain"
                  />
                </VStack>
                <Text>{`Rp ${
                  accountStore?.accountData?.userswallet?.amount
                    ? Numbro.formatCurrency(
                        accountStore?.accountData?.userswallet?.amount,
                      )
                    : 0
                }`}</Text>
                <VStack
                  style={{
                    // position: 'absolute',
                    width: 1,
                    height: CustomSpacing(30),
                    backgroundColor: Colors.neutral50,

                    borderWidth: 0,
                  }}
                />
                <VStack
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text>Estimated amount</Text>
                  <Text>
                    Rp{' '}
                    {Numbro.formatCurrency(
                      selectedService?.prices?.price?.total,
                    )}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(12)} />

            <Button
              onPress={() => goTopUp()}
              style={{color: Colors.primarySurface}}
              label={'Top Up Now'}
              type="primary"
              size="large"
            />
            <Spacer height={CustomSpacing(12)} />
            <Button
              onPress={() => goPaymentChange()}
              style={{color: Colors.primarySurface}}
              label={'Change Payment Method'}
              type="primary"
              size="large"
            />
            <Spacer height={CustomSpacing(8)} />
            {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
          </VStack>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      {/* modal payment method */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRefPaymenType}
          index={0}
          snapPoints={snapPointsPaymentType}
          onChange={handleSheetChanges}
          containerStyle={{
            zIndex: 1000,
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <VStack
            style={{
              padding: CustomSpacing(16),
            }}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.headlineL]}>
                {t('wlChoosePaymentMethod')}
              </Text>
              <TouchableOpacity onPress={() => handleCloseModalPaymentPress()}>
                <FastImage
                  source={CloseOutlineIcon}
                  style={{
                    width: CustomSpacing(24),
                    height: CustomSpacing(24),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </HStack>
            <VStack>
              <Spacer height={CustomSpacing(18)} />
              {PaymentMethod?.map((v, i) => {
                return (
                  <VStack>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setPaymentType(v);
                      }}
                      key={i}>
                      <HStack>
                        <FastImage
                          source={
                            paymenType?.id == v.id ? RectangleActive : Rectangle
                          }
                          style={componentStyles.imgTagIcon}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <FastImage
                          source={v.id === 1 ? Payyuq : Cash}
                          style={{
                            width: dimensions.screenWidth * 0.13,
                            height: CustomSpacing(27),
                          }}
                          resizeMode="contain"
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={[
                            paymenType?.id == v.id
                              ? Fonts.labelSemiBold
                              : Fonts.label,
                            {color: Colors.neutral90},
                          ]}>
                          {v.name}
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                    <Spacer height={CustomSpacing(18)} />
                  </VStack>
                );
              })}
            </VStack>
            <Spacer height={CustomSpacing(12)} />

            <Button
              onPress={() => {
                pickyuqStore.setPaymenMethod(paymenType),
                  handleCloseModalPaymentPress();
              }}
              style={{color: Colors.primarySurface}}
              label={t('btnChoosePaymentMethod')}
              type="primary"
              size="large"
            />
            <Spacer height={CustomSpacing(8)} />
            {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
          </VStack>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      {/* Selected Addess */}
      <HStack
        style={{
          position: 'absolute',
          zIndex: 2,
          top: Platform.OS === 'ios' ? CustomSpacing(42) : CustomSpacing(23),
          // left: CustomSpacing(-8),
        }}>
        {selectedMap ? null : (
          <Animatable.View
            style={{
              maxWidth: CustomSpacing(screenWidth),
            }}
            animation="bounceInDown"
            delay={100}>
            <HStack
              style={{
                flex: 1,
                marginHorizontal: 8,
                backgroundColor: Colors.neutral10,
                padding: CustomSpacing(5),
                borderRadius: Rounded.l,
              }}>
              <VStack>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EnterLocationPickyuq', {
                      from: 'PickyuqCheckout',
                    })
                  }>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <HStack>
                      <FastImage
                        source={LocationIcon}
                        style={{
                          width: CustomSpacing(24),
                          height: CustomSpacing(24),
                          resizeMode: 'contain',
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={[
                          Fonts.label,
                          {
                            maxWidth:
                              Platform.OS == 'ios'
                                ? CustomSpacing(193)
                                : CustomSpacing(226),
                          },
                        ]}>
                        {pickyuqStore.pickupLocation?.address
                          ? pickyuqStore.pickupLocation?.address
                          : ''}
                      </Text>
                    </HStack>
                    <Spacer width={CustomSpacing(38)} />
                    <FastImage
                      source={ChevronRightIcon}
                      style={{
                        width: CustomSpacing(24),
                        height: CustomSpacing(24),
                        resizeMode: 'contain',
                      }}
                    />
                  </HStack>
                </TouchableOpacity>
                <Spacer height={CustomSpacing(8)} />
                <HStack
                  style={{
                    // position: 'absolute',
                    flex: 1,
                    height: 2,
                    backgroundColor: Colors.neutral30,
                    borderStyle: 'dotted',
                    borderWidth: 0,
                  }}
                />
                <Spacer height={CustomSpacing(8)} />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EnterLocationDestination', {
                      from: 'PickyuqCheckout',
                    })
                  }>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <HStack>
                      <FastImage
                        source={LocationAdd}
                        style={{
                          width: CustomSpacing(24),
                          height: CustomSpacing(24),
                          resizeMode: 'contain',
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={
                          ([Fonts.label],
                          {
                            maxWidth:
                              Platform.OS == 'ios'
                                ? CustomSpacing(193)
                                : CustomSpacing(226),
                          })
                        }>
                        {pickyuqStore.destinationLocation?.address
                          ? pickyuqStore.destinationLocation?.address
                          : ''}
                      </Text>
                    </HStack>
                    <Spacer width={CustomSpacing(38)} />
                    <FastImage
                      source={ChevronRightIcon}
                      style={{
                        width: CustomSpacing(24),
                        height: CustomSpacing(24),
                        resizeMode: 'contain',
                      }}
                    />
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </HStack>
          </Animatable.View>
        )}
      </HStack>
      {/* Button Back */}
      <VStack
        style={{
          paddingHorizontal: 12,
          flex: 1,
          position: 'absolute',
          zIndex: 2,
          bottom: CustomSpacing(48),
          height: '45%',
          width: '100%',
        }}>
        {pickyuqStore?.preCheckoutData ? (
          <HStack>
            <TouchableOpacity onPress={goBack}>
              <FastImage
                source={BackGreyIcon}
                style={componentStyles.imgGoback}
              />
            </TouchableOpacity>
            {/* Status Notif */}
            {/* <Animatable.View animation="bounceInRight" delay={100}>
              <HStack
                style={{
                  marginHorizontal: 18,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: Colors.neutral10,
                  width: CustomSpacing(256),
                }}>
                <Text style={[Fonts.labelSemiBold, {alignSelf: 'center'}]}>
                  {'Driver Pick Up'}
                </Text>
              </HStack>
            </Animatable.View> */}
            {orderStatus == 2 ? (
              <Animatable.View animation="bounceInRight" delay={100}>
                <HStack
                  style={{
                    marginHorizontal: 18,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                    width: CustomSpacing(256),
                  }}>
                  <Text style={[Fonts.labelSemiBold]}>{'You get drivers'}</Text>
                </HStack>
              </Animatable.View>
            ) : null}
            {orderStatus == 3 ? (
              <Animatable.View animation="bounceInRight" delay={100}>
                <HStack
                  style={{
                    marginHorizontal: 18,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                    width: CustomSpacing(256),
                  }}>
                  <Text style={[Fonts.labelSemiBold]}>
                    {'Driver to your location'}
                  </Text>
                </HStack>
              </Animatable.View>
            ) : null}

            {orderStatus == 4 ? (
              <Animatable.View animation="bounceInRight" delay={100}>
                <HStack
                  style={{
                    marginHorizontal: 18,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                    width: CustomSpacing(256),
                  }}>
                  <Text style={[Fonts.labelSemiBold]}>
                    {'Driver Pickup You'}
                  </Text>
                </HStack>
              </Animatable.View>
            ) : null}

            {orderStatus == 5 ? (
              <Animatable.View animation="bounceInRight" delay={100}>
                <HStack
                  style={{
                    marginHorizontal: 18,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                    width: CustomSpacing(256),
                  }}>
                  <Text style={[Fonts.labelSemiBold]}>{'Driver Finished'}</Text>
                </HStack>
              </Animatable.View>
            ) : null}
          </HStack>
        ) : null}
      </VStack>

      {/* ISI */}
      {orderStatus == 0 && pickyuqStore?.preCheckoutData?.length > 0 ? (
        <VStack style={componentStyles.containerCheckoutPickyuq}>
          <Animatable.View
            style={{
              flex: 1,
              backgroundColor: Colors.neutral10,
              padding: CustomSpacing(8),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            }}
            animation="bounceInUp"
            delay={100}>
            <VStack style={{flex: 1}}>
              <VStack style={{flex: 1}}>
                <VStack>
                  {pickyuqStore?.preCheckoutData?.map((item, index) => {
                    return (
                      <VStack>
                        <TouchableOpacity
                          onPress={() => setSelectedService(item)}>
                          <HStack
                            style={{
                              justifyContent: 'space-between',
                              backgroundColor:
                                selectedService?.['_id'] == item['_id']
                                  ? Colors.primarySurface
                                  : null,
                              padding: CustomSpacing(8),
                              borderRadius: CustomSpacing(8),
                            }}>
                            <HStack>
                              <FastImage
                                source={{
                                  uri: `${item?.paths}`,
                                }}
                                style={{
                                  alignSelf: 'center',
                                  width: 45,
                                  height: 45,
                                }}
                              />
                              <Spacer width={CustomSpacing(18)} />
                              <Text style={[Fonts.labelSemiBold]}>
                                {item?.name}
                              </Text>
                            </HStack>
                            <Text style={[Fonts.bodySemiBold]}>
                              {item?.prices?.price?.total
                                ? `Rp.${Numbro.formatCurrency(
                                    item?.prices?.price?.total,
                                  )}`
                                : ''}
                            </Text>
                          </HStack>
                        </TouchableOpacity>
                        <Spacer height={CustomSpacing(8)} />
                      </VStack>
                    );
                  })}
                  {orderStatus == 0 &&
                  pickyuqStore?.preCheckoutData?.length == 1 ? (
                    <Spacer
                      height={
                        Platform.OS == 'ios'
                          ? CustomSpacing(112)
                          : CustomSpacing(125)
                      }
                    />
                  ) : null}

                  <HStack style={{justifyContent: 'space-between'}}>
                    <TouchableOpacity
                      onPress={() => handlePresentModalPaymentPress()}
                      style={{flex: 1}}>
                      <HStack>
                        <FastImage
                          source={paymenType?.img}
                          style={{width: 48, height: 25, borderRadius: 5}}
                        />
                        <Spacer width={CustomSpacing(12)} />
                        <VStack>
                          <Text style={[Fonts.labelSemiBold]}>
                            {t('wlPaymentMethod')}
                          </Text>
                          <Spacer height={CustomSpacing(4)} />
                          <Text style={[Fonts.captionM]}>
                            {paymenType?.name}
                          </Text>
                        </VStack>
                      </HStack>
                    </TouchableOpacity>
                    {/* <VStack
                      style={{
                        // position: 'absolute',
                        width: 2,
                        height: CustomSpacing(42),
                        backgroundColor: Colors.neutral30,
                        borderStyle: 'dotted',
                        borderWidth: 0,
                      }}
                    /> */}
                    {/* <VStack>
                      <TouchableOpacity disabled={true}>
                        <HStack>
                          <FastImage
                            source={VoucherPickyuq}
                            style={{width: 28, height: 18, borderRadius: 8}}
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <VStack>
                            <Text style={[Fonts.labelSemiBold]}>Voucher</Text>
                            <Text style={[Fonts.captionM]}>
                              {t('wlnoVoucher')}
                            </Text>
                          </VStack>
                        </HStack>
                      </TouchableOpacity>
                    </VStack> */}
                  </HStack>
                </VStack>

                {/* <Spacer
                  height={
                    Platform.OS == 'ios' ? CustomSpacing(32) : CustomSpacing(23)
                  }
                /> */}
              </VStack>

              <Button
                disabled={selectedService ? false : true}
                onPress={() => {
                  Smartlook.instance.analytics.trackEvent('checkout_pickyuq'),
                    SelectedOption();
                }}
                type="primary"
                label={t('wlOrderNow')}
              />

              {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
            </VStack>
          </Animatable.View>
        </VStack>
      ) : null}

      {/* search driver */}
      {orderStatus == 1 ? (
        <VStack style={componentStyles.containerCheckoutPickyuq}>
          <Animatable.View
            style={{
              flex: 1,
              backgroundColor: Colors.neutral10,
              padding: CustomSpacing(8),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            }}
            animation="bounceInUp"
            delay={100}>
            <VStack style={{flex: 1, alignItems: 'center'}}>
              <Text style={[Fonts.headlineL]}>{t('wlFindDriver')}</Text>
              <Spacer height={CustomSpacing(15)} />
              <VStack>
                <Animatable.View
                  duration={400}
                  easing="ease-out"
                  animation={'bounceInRight'}
                  useNativeDriver
                  style={componentStyles.contentOverlay}>
                  <Spacer height={CustomSpacing(30)} />
                  <VStack
                    style={{
                      alignItems: 'center',
                    }}>
                    <Lottie
                      source={LoadingLottie}
                      autoPlay
                      loop
                      style={{height: 150}}
                    />
                  </VStack>
                </Animatable.View>
                <Spacer height={CustomSpacing(23)} />
              </VStack>
              {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              <Button
                disabled={timeSearchDriver <= 0 ? true : false}
                onPress={CancelButton}
                type="dangerOutline"
                label={`Batalkan pesanan (${timeSearchDriver})`}
              />
            </VStack>
          </Animatable.View>
        </VStack>
      ) : null}

      {/* Driver already accept*/}
      {orderStatus >= 2 || orderStatus >= 3 ? (
        <VStack style={componentStyles.containerCheckoutPickyuq}>
          <Animatable.View
            style={{
              flex: 1,
              backgroundColor: Colors.neutral10,
              padding: CustomSpacing(8),
              borderTopLeftRadius: Rounded.xl,
              borderTopRightRadius: Rounded.xl,
            }}
            animation="bounceInUp"
            delay={100}>
            <VStack style={{flex: 1}}>
              <Spacer height={CustomSpacing(4)} />

              <VStack
                style={{
                  paddingHorizontal: CustomSpacing(8),
                  paddingVertical: CustomSpacing(8),
                  borderRadius: 8,
                  backgroundColor: Colors.neutral10,
                }}>
                <HStack>
                  <VStack>
                    <FastImage
                      source={
                        dataDriver?.driverdetails?.path
                          ? {
                              uri: `${dataDriver?.driverdetails?.path}`,
                            }
                          : User
                      }
                      style={componentStyles.imgDriver}
                    />
                  </VStack>
                  <Spacer width={CustomSpacing(8)} />
                  <VStack>
                    <Text style={[Fonts.subhead]}>
                      {dataDriver?.driverdetails?.name
                        ? dataDriver?.driverdetails?.name
                        : ''}
                    </Text>
                    <Spacer height={CustomSpacing(4)} />
                    <HStack
                      style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        width: dimensions.screenWidth - 100,
                      }}>
                      <HStack>
                        <FastImage
                          source={StarIcon}
                          tintColor={Colors.primaryMain}
                          style={componentStyles.imgStarDriver}
                        />

                        <Text>
                          {dataDriver?.driverRatings?.ratings
                            ? dataDriver?.driverRatings?.ratings
                            : '0.0'}
                        </Text>
                        <Text style={Fonts.label}>{` • ${
                          dataDriver?.drivervehicles?.plate_number
                            ? dataDriver?.drivervehicles?.plate_number
                            : ''
                        }`}</Text>
                      </HStack>
                      {/* <Spacer width={CustomSpacing(100)} /> */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => goToChat()}>
                        <FastImage
                          source={MessageNotifIcon}
                          style={{
                            width: CustomSpacing(24),
                            height: CustomSpacing(24),
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                </HStack>
                <Spacer height={CustomSpacing(8)} />
                <VStack>
                  <Text>{t('wlDetailPayment')}</Text>
                  <Spacer height={CustomSpacing(8)} />
                  <HStack style={{justifyContent: 'space-between'}}>
                    <Text>{t('wlTripPrice')}</Text>
                    <Text>
                      {pickyuqStore?.CheckoutData?.prices?.price
                        ?.platformDeliverys
                        ? `Rp.${Numbro.formatCurrency(
                            pickyuqStore?.CheckoutData?.prices?.price
                              ?.platformDeliverys,
                          )}`
                        : ''}
                    </Text>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                  <HStack style={{justifyContent: 'space-between'}}>
                    <Text>Platform fee</Text>
                    <Text>
                      {pickyuqStore?.CheckoutData?.prices?.price
                        ?.platformsAppDrivers
                        ? `Rp.${Numbro.formatCurrency(
                            pickyuqStore?.CheckoutData?.prices?.price
                              ?.platformsAppDrivers,
                          )}`
                        : ''}
                    </Text>
                  </HStack>

                  {/* <Spacer height={CustomSpacing(8)} />
                  <HStack style={{justifyContent: 'space-between'}}>
                    <Text>Voucher</Text>
                    <Text>
                      {
                        pickyuqStore?.CheckoutData?.prices?.price
                          ?.platformsAppUsers
                      }
                    </Text>
                  </HStack> */}

                  <Spacer height={CustomSpacing(8)} />
                  <HStack
                    style={{
                      flex: 1,
                      backgroundColor: Colors.neutral50,
                      borderWidth: 0.2,
                      borderStyle: 'dotted',
                    }}
                  />
                  <Spacer height={CustomSpacing(8)} />
                  <HStack style={{justifyContent: 'space-between'}}>
                    <Text>{t('wlTotalPayment')}</Text>
                    <Text>
                      {pickyuqStore?.CheckoutData?.prices?.price?.total
                        ? `Rp.${Numbro.formatCurrency(
                            pickyuqStore?.CheckoutData?.prices?.price?.total,
                          )}`
                        : ''}
                    </Text>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                  <HStack style={{justifyContent: 'space-between'}}>
                    <Text>{t('wlPaymentMethod')}</Text>
                    <FastImage
                      source={Cash}
                      style={{
                        alignSelf: 'center',
                        width: 48,
                        height: 25,
                        borderRadius: 5,
                      }}
                    />
                  </HStack>
                </VStack>
                <Spacer height={CustomSpacing(8)} />
              </VStack>

              {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              <Button
                disabled={orderStatus >= 4 ? true : false}
                onPress={CancelButton}
                type="dangerOutline"
                label={t('wlCancelOrder')}
              />
            </VStack>
          </Animatable.View>
        </VStack>
      ) : null}
    </VStack>
  );
});

export default CheckoutPickyuq;
