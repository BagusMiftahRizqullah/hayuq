import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  FlatList,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import * as Animatable from 'react-native-animatable';
import CONFIG from '@config';

import Numbro from '@utils/numbro';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';

import {
  loading1,
  loading2,
  loading3,
  loading4,
  loading5,
  loading6,
  BackGreyIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';

import styles from './OrderDetail.style';

const OrderDetail = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [canCancel, setCanCancel] = useState(true);
  const [counter, setCounter] = useState(5);
  const [currentOrderData, setCurrentOrderData] = useState(null);

  const submitOrder = () => {
    const dataOrder = {
      merchants_id: currentOrderData?.merchants.id,
      paymentType: exploreStore?.PaymentType,
      notes: exploreStore?.noteDrivers ?? 'no note',
    };
    exploreStore.postCreateOrderCheckout(dataOrder);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      counter > 0 && setCounter(counter - 1);
    }, 1000);

    if (counter === 0) {
      setCanCancel(false);
      submitOrder();
    }
    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    if (exploreStore.orderCheckoutDetailData) {
      setCurrentOrderData(exploreStore.orderCheckoutDetailData);
    }
  }, [exploreStore.orderCheckoutDetailData]);

  // useEffect(() => {
  //   CONFIG.portSocket.emit('data', {
  //     users_id: authStore.userId,
  //   });
  //   CONFIG.portSocket.on('data', (data) => {
  //     console.log('REGISTER USER SOCKET', data);
  //   });
  // }, []);
  // console.log('currentOrderData =>>>>>>>>>>.', currentOrderData);
  useEffect(() => {
    console.log('orderCREATE', exploreStore.createOrderResponse);
    if (exploreStore.createOrderResponse) {
      exploreStore.setCurrentListOrderData({
        transaction_id: exploreStore.createOrderResponse.transactions.id,
        ...exploreStore.orderCheckoutDetailData,
      });
      console.log('orderCREATE masuk 1');
      CONFIG.portSocket.on('order-status', (data) => {
        console.log('order-status', data);
        exploreStore.setOrderStatus(data.status);
      });
      console.log('orderCREATE masuk 2');
      CONFIG.portSocket.on('order-locations', (data) => {
        console.log('order-locations', data);
      });
      console.log('orderCREATE masuk 3');
    }
  }, [exploreStore.createOrderResponse]);

  // useEffect(() => {
  //   console.log('orderCREATE', exploreStore.createOrderResponse);

  //   console.log('orderCREATE masuk 1');
  //   CONFIG.portSocket.on('order-status', (data) => {
  //     console.log('order-status', data);
  //     exploreStore.setOrderStatus(data.status);
  //   });
  //   console.log('orderCREATE masuk 2');
  //   CONFIG.portSocket.on('order-locations', (data) => {
  //     console.log('order-locations', data);
  //   });
  //   console.log('orderCREATE masuk 3');
  // }, []);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.navigate('Orders');
    }
  };

  const handleCancel = () => {
    goBack();
  };

  const snapPoints = useMemo(() => ['50%'], []);
  const spinValue = new Animated.Value(0);

  useFocusEffect(
    useCallback(() => {
      const handleBack = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBack);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }, []),
  );

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

  const handleSheetChanges = useCallback((index: number) => {
    console.log('tutup');
  }, []);

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
            style={[
              {
                transform: [{rotate: spin}],
              },
              componentStyles.loadingAnimation,
            ]}
            source={item.image}
          />
        </Animatable.View>
      );
    });
  };

  console.log('exploreStoreOrderStatus', exploreStore.orderStatus);
  return (
    <VStack
      style={{
        flex: 1,
      }}>
      <Spacer topSafeAreaHeight />
      <HStack style={componentStyles.navigationContainer}>
        <TouchableOpacity onPress={goBack}>
          <FastImage
            source={BackGreyIcon}
            style={componentStyles.imgBackIcon}
          />
        </TouchableOpacity>
        <Spacer width={CustomSpacing(16)} />
      </HStack>

      <VStack style={componentStyles.dashboardPosition}>
        <VStack style={componentStyles.dashboardContainer}>
          {exploreStore.orderStatus === null && (
            <>
              <HStack>
                <Icon name="schedule" size={24} color={Colors.neutral90} />
                <Spacer width={CustomSpacing(10)} />
                <Text
                  style={[
                    Fonts.subhead,
                    {
                      maxWidth: dimensions.screenWidth - CustomSpacing(95),
                    },
                  ]}>
                  {t('wlWaitRestauran')}
                </Text>
              </HStack>
              {canCancel && (
                <TouchableOpacity activeOpacity={0.8} onPress={handleCancel}>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      {color: Colors.dangerMain, textAlign: 'right'},
                    ]}>
                    {t('wlCancelOrder')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {exploreStore.orderStatus === 0 || exploreStore.orderStatus === 1 ? (
            <HStack>
              <IconFontAwesome
                name="check"
                size={24}
                color={Colors.neutral90}
              />
              <Spacer width={CustomSpacing(10)} />
              <Text
                style={[
                  Fonts.subhead,
                  {
                    maxWidth: dimensions.screenWidth - CustomSpacing(95),
                  },
                ]}>
                {t('wlOrderPreparing')}
              </Text>
            </HStack>
          ) : null}
          {exploreStore.orderStatus === 2 ? (
            <HStack>
              <IconFontAwesome
                name="check"
                size={24}
                color={Colors.neutral90}
              />
              <Spacer width={CustomSpacing(10)} />
              <Text
                style={[
                  Fonts.subhead,
                  {
                    maxWidth: dimensions.screenWidth - CustomSpacing(95),
                  },
                ]}>
                {t('wlOrderPreparing')}
              </Text>
            </HStack>
          ) : null}
        </VStack>

        <Spacer height={dimensions.screenWidth / 3} />
        <VStack
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <HStack>{RenderLoading()}</HStack>
        </VStack>
      </VStack>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetScrollView
          style={{
            padding: CustomSpacing(16),
          }}>
          {exploreStore.orderStatus === 2 && (
            <>
              <VStack
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: CustomSpacing(16),
                }}>
                <HStack>
                  <Icon name="search" size={41} color={Colors.neutral90} />
                  <Spacer width={CustomSpacing(10)} />
                  <Text style={[Fonts.subhead]}>
                    {t('wlNudgingNearbyDriver')}
                  </Text>
                </HStack>
              </VStack>
              <Spacer height={CustomSpacing(16)} />
            </>
          )}
          <VStack>
            <Text style={[Fonts.labelSemiBold]}>{t('wlDeliveryDetails')}</Text>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              <HStack>
                <VStack
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  <Icon
                    name="location-on"
                    size={21}
                    color={Colors.supportMain}
                  />
                </VStack>
                <Spacer width={CustomSpacing(12)} />
                <VStack>
                  <Text style={[Fonts.captionS]}>
                    {t('wlRestaurantLocation')}
                  </Text>
                  <Text numberOfLines={1} style={[Fonts.labelSemiBold]}>
                    {currentOrderData?.merchants.name}
                  </Text>
                  <Text numberOfLines={1} style={[Fonts.label]}>
                    {currentOrderData?.merchants.address.address}
                  </Text>
                </VStack>
              </HStack>
              <Spacer height={CustomSpacing(16)} />
              <HStack>
                <VStack
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  <Icon
                    name="location-on"
                    size={21}
                    color={Colors.supportMain}
                  />
                </VStack>
                <Spacer width={CustomSpacing(12)} />
                <VStack>
                  <Text style={[Fonts.captionS]}>
                    {t('wlDeliveryLocation')}
                  </Text>
                  <Text numberOfLines={1} style={[Fonts.labelSemiBold]}>
                    {exploreStore.currentDeliveryAddress.header}
                  </Text>
                  <Text numberOfLines={1} style={[Fonts.label]}>
                    {exploreStore.currentDeliveryAddress.address}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(24)} />
          <VStack>
            <HStack style={componentStyles.totalPaymentContainer}>
              <VStack
                style={{
                  alignSelf: 'flex-start',
                }}>
                <Text style={[Fonts.bodySemiBold]}>{t('wlTotalPayment')}</Text>
              </VStack>
              <VStack>
                <Text style={[Fonts.labelSemiBold]}>
                  Rp {currentOrderData?.price.total}
                </Text>
                {/* <Text
                  style={[
                    Fonts.captionM,
                    {
                      textDecorationLine: 'line-through',
                      textAlign: 'right',
                    },
                  ]}>
                  Rp {currentOrderData?.price.total}
                </Text> */}
              </VStack>
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              {currentOrderData !== null &&
                currentOrderData.products.map((item, index) => {
                  return (
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <HStack>
                        <VStack
                          style={{
                            alignSelf: 'flex-start',
                          }}>
                          <Text style={[Fonts.labelSemiBold]}>
                            {item.productsprices.quantity}x
                          </Text>
                        </VStack>
                        <Spacer width={CustomSpacing(8)} />
                        <VStack>
                          <Text style={[Fonts.labelSemiBold]}>{item.name}</Text>
                          <VStack marginLeft={CustomSpacing(8)}>
                            {item.variants.length > 0 &&
                              item.variants.map((x, y) => {
                                return (
                                  <Text style={[Fonts.label]}>{x.name}</Text>
                                );
                              })}
                            {item.notes && (
                              <Text style={[Fonts.captionM]}>
                                {t('wlDontSpicy')}
                              </Text>
                            )}
                          </VStack>
                        </VStack>
                      </HStack>
                      <VStack
                        style={{
                          alignSelf: 'flex-start',
                        }}>
                        <Text style={[Fonts.labelSemiBold]}>
                          {item.productsprices.total}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })}
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(30)} />
        </BottomSheetScrollView>
      </BottomSheet>
    </VStack>
  );
});

export default OrderDetail;
