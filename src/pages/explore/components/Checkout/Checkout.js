import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  // PermissionsAndroid,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
// import Animated from 'react-native-reanimated';
// import Geocoder from 'react-native-geocoding';
// import Geolocation from 'react-native-geolocation-service';

import Numbro from '@utils/numbro';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button, Splash} from '@components';
import {dimensions} from '@config/Platform.config';
import {
  CloseOutlineIcon,
  VoucherBg,
  TooFar,
  Rectangle,
  RectangleActive,
  Payyuq,
  Cash,
  Dana,
} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import analytics from '@react-native-firebase/analytics';
import styles from './Checkout.style';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkout = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore, accountStore} = useStores();
  const bottomSheetRef = useRef(null);
  const bottomSheetRefPaymenType = useRef(null);
  const bottomSheetRefEnoughtBallance = useRef(null);
  const bottomSheetRefNote = useRef(null);
  const bottomSheetRefValidationPayment = useRef(null);
  const componentStyles = styles();
  const navigation = useNavigation();
  const [checkoutData, setCheckoutData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [myNotes, setMyNotes] = useState('');
  const [paymenType, setPaymentType] = useState(null);

  const restaurantDistance = useMemo(() => {
    return exploreStore?.distanceCheckData?.data;
  }, [restaurantData]);

  useEffect(() => {
    if (exploreStore.orderCheckoutDetailData) {
      setCheckoutData(exploreStore.orderCheckoutDetailData);
      exploreStore.setOrderPaymentType(
        exploreStore.orderCheckoutDetailData?.payments?.[1],
      );
      setPaymentType(exploreStore.orderCheckoutDetailData?.payments?.[1]);

      if (
        parseFloat(
          accountStore?.accountData?.userswallet?.amount
            ? accountStore?.accountData?.userswallet?.amount
            : 0,
        ) < parseFloat(exploreStore.orderCheckoutDetailData?.price?.total)
      ) {
        handlePresentModalEnoughtPaymentPress();
      }
    }
  }, [exploreStore.orderCheckoutDetailData]);

  const snapPointsPaymentType = useMemo(() => ['40%', '35%'], []);
  const snapPointsEnoughtBallance = useMemo(() => ['50%', '50%'], []);
  const snapPointsOutOfRange = useMemo(() => ['50%', '50%'], []);
  const snapPointsDriverNote = useMemo(() => ['50%', '50%'], []);
  const snapPointsValidationPaymentMethod = useMemo(() => ['50%', '50%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCloseModalValidationPaymentPress = useCallback(() => {
    bottomSheetRefValidationPayment.current?.close();
  }, []);

  const handlePresentModalValidationPaymentPress = useCallback(() => {
    bottomSheetRefValidationPayment.current?.present();
  }, []);

  const handlePresentModalNotesPress = useCallback(() => {
    bottomSheetRefNote.current?.present();
  }, []);

  const handleCloseModalNotesPress = useCallback(() => {
    bottomSheetRefNote.current?.close();
  }, []);

  const handlePresentModalPaymentPress = useCallback(() => {
    bottomSheetRefPaymenType.current?.present();
  }, []);

  const handleCloseModalPaymentPress = useCallback(() => {
    bottomSheetRefPaymenType.current?.close();
  }, []);

  const handlePresentModalEnoughtPaymentPress = useCallback(() => {
    bottomSheetRefEnoughtBallance.current?.present();
  }, []);

  const handleCloseModalEnoughtPayment = useCallback(() => {
    bottomSheetRefEnoughtBallance.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {}, []);

  // useEffect(() => {
  //   console.log('MYLOCATION =>>>>>>>>>>>', exploreStore?.distanceCheckData);

  //   if (exploreStore?.distanceCheckData?.status == false) {
  //     handlePresentModalPress();
  //   }
  // }, [exploreStore?.distanceCheckData, restaurantDistance]);

  // useEffect(() => {
  //   exploreStore.getDistanceCheck();
  // }, [
  //   exploreStore.currentDeliveryAddress,
  //   // exploreStore?.currentLocationAddress,
  // ]);

  // const getLocConvertAddress = async (lat, long) => {
  //   Geocoder.from(lat, long)
  //     .then(async (json) => {
  //       const res = json.results[0].formatted_address;
  //       const address = res.replace(/^[^,]*\+[^,]*,/, '');
  //       await exploreStore.setCurrentLocationAddress(long, lat, address);
  //       await exploreStore.setFreqUsedAddress({
  //         address: address,
  //         lat: lat,
  //         lng: long,
  //         header: address.substring(0, address.indexOf(',')),
  //       });
  //       console.log('lottt=>>>>>>>', long, lat);

  //       await exploreStore.setCurrentLocationAddress(
  //         long,
  //         lat,
  //         address,
  //         address.substring(0, address.indexOf(',')),
  //       );
  //     })
  //     .catch((error) => console.warn(error));
  // };

  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     try {
  //       const granted = await Geolocation.requestAuthorization('whenInUse');
  //       if (granted === 'granted') {
  //         console.log('IOS GRANTED LOCATION');
  //         setPermissionLocationStatus(true);
  //         return true;
  //       } else {
  //         console.log('IOS NOT GRANTED LOCATION');
  //         setPermissionLocationStatus(false);
  //         return false;
  //       }
  //     } catch (err) {
  //       console.log('Permission error', err);
  //       return false;
  //     }
  //   } else {
  //     try {
  //       // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Geolocation Permission',
  //           message: 'Can we access your location?',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted === 'granted') {
  //         console.log('ANDROID GRANTED LOCATION');
  //         setPermissionLocationStatus(true);
  //         return true;
  //       } else {
  //         console.log('ANDROID NOT GRANTED LOCATION');
  //         setPermissionLocationStatus(false);
  //         return false;
  //       }
  //     } catch (err) {
  //       console.log('Permission error', err);
  //       return false;
  //     }
  //   }
  // };

  // const getLocation = () => {
  //   const result = requestLocationPermission();
  //   result.then((res) => {
  //     if (res) {
  //       Geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log('LOCATION', Platform.OS, position);

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

  const defaultAddress = useMemo(() => {
    return {
      header: exploreStore.currentDeliveryAddress.header,
      address: exploreStore.currentDeliveryAddress.address,
    };
  }, [exploreStore.currentDeliveryAddress]);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToOrderDetail = async () => {
    const dataArry = [];
    await exploreStore.cartListData?.cart.map((v, i) => {
      dataArry.push(v['_id']);
    });

    await analytics().logEvent('purchase', {
      id_merchant: exploreStore.cartListData?.cart?.[0]?.merchants_id,
      id_user: await AsyncStorage.getItem('USER_ID'),
      item_list: dataArry,
    });

    if (exploreStore?.PaymentType) {
      exploreStore.clearCreateOrder();
      navigation.navigate('OrderDetail');
    } else {
      handlePresentModalValidationPaymentPress();
    }
  };
  const goTopUp = () => {
    navigation.navigate('HistoryPayyuq', {modalPayment: true});
  };

  const goToDeliveryAddress = () => {
    navigation.navigate('DeliveryAddress');
  };

  const goNote = () => {
    exploreStore.createNoteDriver(myNotes);

    handleCloseModalNotesPress();
  };

  const goChangePayment = () => {
    exploreStore.setOrderPaymentType(paymenType);
    handleCloseModalPaymentPress();
  };

  const goToSearchVoucher = () => {
    navigation.navigate('SearchVoucher', {checkout: true});
  };
  const goPaymentChange = () => {
    handleCloseModalEnoughtPayment();
    handlePresentModalPaymentPress();
  };
  const handleKeyboardModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToPosition('85%');
  }, []);

  const handleKeyboardModalBlur = useCallback(() => {
    bottomSheetRef.current?.snapToPosition('75%');
  }, []);

  useEffect(() => {
    if (exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, [exploreStore.currentDeliveryAddress, restaurantDistance]);

  useEffect(() => {
    if (exploreStore.merchantDetailData) {
      setRestaurantData(exploreStore.merchantDetailData);
    }
  }, [exploreStore.merchantDetailData, exploreStore.currentDeliveryAddress]);

  const NavigatorBar = () => {
    const merchantsData = checkoutData?.merchants;

    return (
      <HStack
        style={{
          padding: CustomSpacing(16),
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgBackIcon}
          />
        </TouchableOpacity>
        <VStack alignItems="center">
          <Text style={[Fonts.subhead]}>{merchantsData?.name}</Text>
          <Text style={[Fonts.captionM]}>{`${
            restaurantDistance?.distance
              ? restaurantDistance?.distance
              : merchantsData?.distance?.distance
          } ${
            restaurantDistance?.unit
              ? restaurantDistance?.unit
              : merchantsData?.distance?.unit
          } ${t('wlFromYou')}`}</Text>
        </VStack>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  const DeliveryLocation = () => {
    return (
      <VStack style={componentStyles.deliveryContainer}>
        <Text
          style={{
            ...Fonts.bodySemiBold,
          }}>
          {t('wlDeliveryLocation')}
        </Text>
        <Spacer height={CustomSpacing(12)} />
        <HStack justifyContent="space-between">
          <VStack style={componentStyles.topPosition}>
            <Icon
              name="location-on"
              size={CustomSpacing(22)}
              color={Colors.supportMain}
            />
          </VStack>
          <VStack>
            <Text style={[Fonts.labelSemiBold]}>{defaultAddress.header}</Text>
            <Text
              numberOfLines={2}
              style={[
                Fonts.captionM,
                {
                  maxWidth: dimensions.screenWidth - CustomSpacing(90),
                },
              ]}>
              {defaultAddress.address}
            </Text>
          </VStack>
          <TouchableOpacity onPress={goToDeliveryAddress}>
            <Icon
              name="chevron-right"
              size={CustomSpacing(22)}
              color={Colors.neutral60}
            />
          </TouchableOpacity>
        </HStack>
        <Spacer height={CustomSpacing(8)} />
        <TouchableOpacity onPress={() => handlePresentModalNotesPress()}>
          <HStack style={componentStyles.addNotesBtn}>
            <Icon
              name="menu-book"
              size={CustomSpacing(16)}
              color={Colors.neutral80}
            />
            <Spacer width={CustomSpacing(4)} />
            <Text style={[Fonts.captionM]}>{t('wlAddNote')}</Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  const OrderSummary = () => {
    const _renderItem = ({item, index}) => {
      return (
        <VStack>
          <HStack>
            <VStack style={componentStyles.topPosition}>
              <Text
                style={[
                  Fonts.labelSemiBold,
                ]}>{`${item.productsprices?.quantity}x`}</Text>
            </VStack>
            <Spacer width={CustomSpacing(8)} />
            <VStack style={componentStyles.topPosition}>
              <FastImage
                source={{
                  uri: item.productspictures.path,
                }}
                style={componentStyles.imgMenuOrderSummary}
              />
            </VStack>
            <Spacer width={CustomSpacing(8)} />
            <VStack style={componentStyles.topPosition}>
              <HStack style={componentStyles.productNameContainer}>
                <Text
                  numberOfLines={2}
                  style={[
                    Fonts.labelSemiBold,
                    {
                      maxWidth: dimensions.screenWidth - CustomSpacing(90),
                    },
                  ]}>
                  {item.name}
                </Text>
                <Text style={[Fonts.labelSemiBold]}>
                  {Numbro.formatCurrency(item.productsprices.total)}
                </Text>
              </HStack>
              {item.variants &&
                item.variants.length > 0 &&
                item.variants.map((x, y) => {
                  return (
                    <HStack
                      style={componentStyles.productNameContainer}
                      key={`VARIANT-${y}`}>
                      <Text
                        numberOfLines={2}
                        style={[
                          Fonts.label,
                          {
                            maxWidth:
                              dimensions.screenWidth - CustomSpacing(90),
                          },
                        ]}>
                        {x.name}
                      </Text>
                      {x.total !== 0 && (
                        <Text
                          style={[
                            Fonts.label,
                            {
                              color: Colors.supportMain,
                            },
                          ]}>
                          +{Numbro.formatCurrency(x.total)}
                        </Text>
                      )}
                    </HStack>
                  );
                })}
              <Text
                style={[
                  Fonts.captionM,
                  {
                    maxWidth: dimensions.screenWidth - CustomSpacing(114),
                  },
                ]}>
                {item.notes}
              </Text>
            </VStack>
          </HStack>
          <Spacer height={CustomSpacing(8)} />
          <HStack justifyContent="space-between">
            <TouchableOpacity onPress={goBack}>
              <Text
                style={[Fonts.labelSemiBold, {color: Colors.secondaryMain}]}>
                {t('wlEdit')}
              </Text>
            </TouchableOpacity>

            <HStack>
              {/* <VStack style={componentStyles.btnMinusCartModal}>
                <IconFontAwesome
                  name="minus"
                  size={9}
                  color={Colors.neutral90}
                />
              </VStack> */}
              <Spacer width={CustomSpacing(14)} />
              {/* <Text style={[Fonts.bodySemiBold]}>
                {item.productsprices?.quantity}
              </Text> */}
              {/* <Spacer width={CustomSpacing(14)} /> */}
              {/* <TouchableOpacity
                activeOpacity={0.8}
                style={componentStyles.btnPlusCartModal}>
                <IconFontAwesome
                  name="plus"
                  size={9}
                  color={Colors.neutral90}
                />
              </TouchableOpacity> */}
            </HStack>
          </HStack>
          <Spacer height={CustomSpacing(12)} />
        </VStack>
      );
    };

    return (
      <VStack style={componentStyles.deliveryContainer}>
        <Text style={[Fonts.bodySemiBold]}>{t('wlOrderSummary')}</Text>
        <Spacer height={CustomSpacing(12)} />
        <FlatList
          data={checkoutData?.products}
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          keyExtractor={(item, index) => `recomended-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
        />
      </VStack>
    );
  };

  const PaymentDetails = () => {
    return (
      <VStack style={componentStyles.deliveryContainer}>
        <Text style={[Fonts.labelSemiBold]}>{t('wlPaymentDetails')}</Text>
        <Spacer height={CustomSpacing(8)} />
        <VStack
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.neutral50,
            paddingBottom: CustomSpacing(8),
            borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
          }}>
          <HStack justifyContent="space-between">
            <Text style={[Fonts.label]}>Subtotal</Text>
            <Text style={[Fonts.labelSemiBold]}>
              Rp{' '}
              {Numbro.formatCurrency(
                checkoutData?.price.totalprice +
                  checkoutData?.price.totalvariants,
              )}
            </Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text style={[Fonts.label]}>Delivery fee</Text>
            <Text style={[Fonts.labelSemiBold]}>
              Rp {Numbro.formatCurrency(checkoutData?.price.totaldeliveryall)}
            </Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text style={[Fonts.label]}>Services and other fees</Text>
            <Text style={[Fonts.labelSemiBold]}>
              Rp{' '}
              {Numbro.formatCurrency(
                checkoutData?.price.totalplatform +
                  checkoutData?.price.totalservice,
              )}
            </Text>
          </HStack>
        </VStack>
        <Spacer height={CustomSpacing(8)} />
        <HStack justifyContent="space-between">
          <Text style={[Fonts.labelSemiBold]}>Total Payment</Text>
          <Text style={[Fonts.bodySemiBold]}>
            Rp {Numbro.formatCurrency(checkoutData?.price.total)}
          </Text>
        </HStack>
      </VStack>
    );
  };

  // const OutOfRangeComponent = () => {
  //   return (
  //     <BottomSheetModalProvider>
  //       <BottomSheetModal
  //         enablePanDownToClose={false}
  //         ref={bottomSheetRef}
  //         index={1}
  //         snapPoints={snapPointsOutOfRange}
  //         onChange={handleSheetChanges}
  //         containerStyle={{
  //           backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
  //         }}>
  //         <VStack
  //           style={{
  //             padding: CustomSpacing(16),
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           <FastImage
  //             source={TooFar}
  //             style={{
  //               width: CustomSpacing(120),
  //               height: CustomSpacing(120),
  //             }}
  //           />
  //           <Spacer height={CustomSpacing(20)} />
  //           <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
  //             Ordering for someone?
  //           </Text>
  //           <Spacer height={CustomSpacing(10)} />
  //           <Text style={[Fonts.label, {textAlign: 'center'}]}>
  //             It seems that you’re too far from the restaurant, are you ordering
  //             food for your family, partner, or friends?
  //           </Text>
  //           <Spacer height={CustomSpacing(20)} />
  //           <Button
  //             label="Ok, I understand"
  //             type="primary"
  //             onPress={() => {
  //               handleCloseModalPress();
  //             }}
  //           />
  //         </VStack>
  //       </BottomSheetModal>
  //     </BottomSheetModalProvider>
  //   );
  // };

  const ValidationPaymentMethodComponent = () => {
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRefValidationPayment}
          index={1}
          snapPoints={snapPointsValidationPaymentMethod}
          onChange={handleSheetChanges}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <VStack
            style={{
              padding: CustomSpacing(16),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FastImage
              source={TooFar}
              style={{
                width: CustomSpacing(120),
                height: CustomSpacing(120),
              }}
            />
            <Spacer height={CustomSpacing(20)} />
            <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
              Please.....
            </Text>
            <Spacer height={CustomSpacing(10)} />
            <Text style={[Fonts.label, {textAlign: 'center'}]}>
              Select your payment method first.
            </Text>
            <Spacer height={CustomSpacing(20)} />
            <Button
              label="Ok, I understand"
              type="primary"
              onPress={() => {
                handleCloseModalValidationPaymentPress();
                // navigation.navigate('Explore');
              }}
            />
          </VStack>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  };

  return (
    <VStack
      style={{
        backgroundColor: Colors.backgroundSurface,
        flex: 1,
      }}>
      <Spacer topSafeAreaHeight />
      <NavigatorBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={componentStyles.separator} />
        <DeliveryLocation />
        <View style={componentStyles.separator} />
        <OrderSummary />
        <View style={componentStyles.separator} />
        {/* <HStack padding={CustomSpacing(16)} justifyContent="space-between">
          <VStack>
            <Text style={[Fonts.bodySemiBold]}>{t('wlIsEnough')}</Text>
            <Text style={[Fonts.label]}>{t('wlAddOtherDishes')}</Text>
          </VStack>
          <Button label="Add more" type="support" size="small" />
        </HStack> */}

        <VStack>
          <FastImage source={VoucherBg} style={componentStyles.voucherBg} />
          <VStack style={componentStyles.voucherPosition}>
            <VStack style={componentStyles.voucherContainer}>
              <TouchableOpacity onPress={goToSearchVoucher}>
                <HStack style={componentStyles.voucherContent}>
                  <HStack>
                    <Icon
                      name="confirmation-number"
                      size={CustomSpacing(22)}
                      color={Colors.supportMain}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text style={[Fonts.labelSemiBold]}>
                      {t('wlUseVoucherOrder')}
                    </Text>
                  </HStack>
                  <VStack style={componentStyles.voucherArrow}>
                    <Icon
                      name="arrow-forward"
                      size={CustomSpacing(16)}
                      color={Colors.neutral10}
                    />
                  </VStack>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </VStack>
        </VStack>
        {/* <View style={componentStyles.separator} /> */}
        <PaymentDetails />
        <View style={componentStyles.separator} />
        <VStack style={componentStyles.deliveryContainer}>
          <Text style={[Fonts.labelSemiBold]}>{t('wlPaymentMethod')}</Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack justifyContent="space-between">
            <HStack>
              <FastImage
                source={exploreStore.PaymentType?.id === 1 ? Payyuq : Cash}
                style={{
                  width: dimensions.screenWidth * 0.13,
                  height: CustomSpacing(27),
                }}
                resizeMode="contain"
              />
              <Spacer width={CustomSpacing(8)} />
              <Text style={[Fonts.label]}>
                {exploreStore.PaymentType ? exploreStore.PaymentType?.name : ''}
              </Text>
              <Spacer width={CustomSpacing(8)} />
              {/* <Text style={[Fonts.label]}>Rp 200.000</Text> */}
            </HStack>
            <TouchableOpacity onPress={() => handlePresentModalPaymentPress()}>
              <Text
                style={[
                  Fonts.label,
                  {
                    color: Colors.secondaryMain,
                  },
                ]}>
                {t('wlChange')}
              </Text>
            </TouchableOpacity>
          </HStack>
        </VStack>
        <View style={componentStyles.separator} />
        <VStack style={componentStyles.deliveryContainer}>
          <HStack justifyContent="space-between">
            <Text style={[Fonts.body]}>Total</Text>
            <Text style={[Fonts.titleMBold]}>
              Rp {Numbro.formatCurrency(checkoutData?.price.total)}
            </Text>
          </HStack>
          <Spacer height={CustomSpacing(16)} />
          <Button
            disabled={
              parseFloat(
                accountStore?.accountData?.userswallet?.amount
                  ? accountStore?.accountData?.userswallet?.amount
                  : 0,
              ) <
                parseFloat(exploreStore.orderCheckoutDetailData?.price.total) &&
              paymenType?.id !== 2
            }
            onPress={goToOrderDetail}
            label="Place order"
            type="primary"
            size="large"
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
        </VStack>
      </ScrollView>

      {/* <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPointsDriverNote}
          onChange={handleSheetChanges}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
        
        </BottomSheetModal>
      </BottomSheetModalProvider> */}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRefNote}
          index={0}
          snapPoints={snapPointsDriverNote}
          onChange={handleSheetChanges}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <VStack
            style={{
              padding: CustomSpacing(16),
            }}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.headlineL]}>{t('wlAddNote')}</Text>
              <TouchableOpacity onPress={() => handleCloseModalNotesPress()}>
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
              <TextInput
                multiline={true}
                numberOfLines={6}
                style={[
                  Fonts.label,
                  {
                    borderColor: Colors.neutral40,
                    borderRadius: CustomSpacing(8),
                    borderWidth: CustomSpacing(2),
                    padding: CustomSpacing(8),
                  },
                ]}
                onBlur={(focus) => {
                  console.log('Blur=>>>', focus), handleKeyboardModalBlur();
                }}
                onFocus={(focus) => {
                  console.log('focus=>>>', focus), handleKeyboardModalPress();
                }}
                value={myNotes}
                onChangeText={(text) => setMyNotes(text)}
              />
            </VStack>
            <Spacer height={CustomSpacing(12)} />
            <HStack style={{justifyContent: 'space-between'}}></HStack>
            <Spacer height={CustomSpacing(12)} />
            <Button
              onPress={() => goNote()}
              style={{color: Colors.primarySurface}}
              label="Submit"
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
              {checkoutData?.payments?.map((v, i) => {
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
              onPress={() => goChangePayment()}
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
      {/* modal Enought Balance */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRefEnoughtBallance}
          index={0}
          snapPoints={snapPointsEnoughtBallance}
          onChange={handleSheetChanges}
          containerStyle={{
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
                    Rp {Numbro.formatCurrency(checkoutData?.price.total)}
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
      {/* Validation OutOfRange */}
      {/* {<OutOfRangeComponent />} */}
      {/* Validation PaymentMethod */}
      {<ValidationPaymentMethodComponent />}
    </VStack>
  );
});

export default Checkout;
