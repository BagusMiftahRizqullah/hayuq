import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useStores} from '@store/root.store';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {NoOrderIcon, StarIcon, CallIcon, MessageNotifIcon} from '@assets';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import CONFIG from '@config';
import styles from './Order.style';

const HistoryPayyuq = observer((props) => {
  const {t, i18n} = useTranslation();
  const {orderStore, routerStore, exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [OrderData, setOrderData] = useState([]);
  const translateY = useSharedValue(0);

  const handleGotoDetail = (item) => {
    const list = exploreStore.currentListOrderData.find((data) => {
      return data.transaction_id === item.transactions.id;
    });
    navigation.navigate('OrderDetail');
    exploreStore.postOrderCheckoutSuccess(list);
  };

  const goToExplore = () => {
    navigation.navigate('Explore');
  };

  const goToChat = async (data) => {
    const dataOrders = data;
    await orderStore.setListChat(null);
    console.log('setnull first');
    await CONFIG.portSocketChat.emit('find-rooms', {
      code: dataOrders?.transactions?.code,
      users_id: dataOrders?.transactions?.users_id,
    });

    await CONFIG.portSocketChat.on('find-rooms', (data) => {
      console.log('chat USER SOCKET FIND ROOMS', data.data);

      orderStore.setListChat(data.data.list, true);
    });

    if (orderStore.receiverOn === false) {
      await CONFIG.portSocketChat.on('received', async (data) => {
        console.log('received USER SOCKET123 =>>>>>>>', data.data);
        orderStore.setReceiverOn(true);
        if (data.data) {
          await orderStore.setListChat(data.data);
        }
      });
    } else {
      console.log('received SUDAH ACTIVED =>>>>>>>');
    }

    await navigation.navigate('Chat', data);
  };
  const getOrders = async () => {
    await orderStore.getOrderList();
  };
  const goToCall = useCallback(() => {
    routerStore.setOnCall(true);
  }, []);

  useFocusEffect(
    useCallback(async () => {
      orderStore.setListChat(null);
      console.log('setnull first');
      await orderStore.setPageOrder(1);
      await orderStore.getOrderList();
    }, []),
  );

  useEffect(() => {
    console.log('ORDER_DATA', orderStore.listOrderData);
    if (orderStore.listOrderData !== null && orderStore.listOrderData) {
      setOrderData(orderStore.listOrderData);
    }
  }, [orderStore.listOrderData]);

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <Spacer widht={CustomSpacing(24)} />
        <Text style={[Fonts.subhead]}>Orders</Text>
        <Spacer widht={CustomSpacing(24)} />
      </HStack>
    );
  };

  const downReflesh = useAnimatedStyle(() => {
    console.log('translateY=>>>', translateY.value);
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 750,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  const renderItem = ({item, index}) => {
    // console.log(
    //   'transactionsdrivers',
    //   item?.transactionsaddress?.drivers?.driverdetails?.[0]?.path,
    // );
    const statusOrderId = item.transactions?.status;
    const driverData = item.transactionsaddress?.drivers;
    let driverDetailShow = false;
    let statusText = '';
    let driverId =
      item?.transactionsaddress?.drivers?.driverdetails?.[0]?.drivers_id;
    let codeTRX = item?.transactions?.code;
    const driverRating = item.ratings?.drivers?.ratings;
    switch (true) {
      case statusOrderId === 0:
        driverDetailShow = false;
        statusText = t('wlWaitingRestauranConfirm');
        break;
      case statusOrderId === 1:
        driverDetailShow = false;
        statusText = t('wlOrderPrepared');
        break;
      case statusOrderId === 2:
        statusText = t('wlOrderPickupDriver');
        driverDetailShow = true;
        break;
      case statusOrderId === 4:
        statusText = t('wlOrderPickupDriver');
        driverDetailShow = true;
        break;
      case statusOrderId === 5:
        statusText = t('wlOrderOnTheWay');
        driverDetailShow = true;
        break;
      default:
        driverDetailShow = false;
        statusText = t('wlOrderPrepared');
        break;
    }
    return (
      <TouchableOpacity
        onPress={() => handleGotoDetail(item)}
        key={`order-${index}`}
        style={componentStyles.orderCard}>
        <HStack
          borderBottomWidth={driverDetailShow ? 1 : 0}
          borderBottomColor={Colors.neutral70}
          bottom={driverDetailShow ? CustomSpacing(10) : 0}>
          <VStack
            style={{
              alignSelf: 'flex-start',
            }}>
            <FastImage
              source={{
                uri: item?.transactionsaddress?.merchants?.pictures?.[0][
                  'path'
                ],
              }}
              style={componentStyles.imgIconOrder}
            />
          </VStack>
          <Spacer width={CustomSpacing(8)} />
          <VStack>
            <Text
              numberOfLines={1}
              style={[Fonts.subhead, componentStyles.textContainer]}>
              {item?.transactionsaddress?.merchants?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[Fonts.captionM, componentStyles.textContainer]}>
              {item?.transactionsaddress?.merchants?.address?.address}
            </Text>
            <Text
              numberOfLines={1}
              style={[Fonts.label, componentStyles.textContainer]}>
              {statusText}
            </Text>
          </VStack>
        </HStack>
        {driverDetailShow && (
          <HStack
            top={CustomSpacing(10)}
            style={{
              justifyContent: 'space-between',
            }}>
            {/* <VStack>
              <FastImage
                source={{
                  uri: item?.transactionsaddress?.drivers?.driverdetails?.[0]
                    ?.path,
                }}
                style={componentStyles.imgIconOrder}
              />
            </VStack> */}
            <VStack>
              <Text style={[Fonts.subhead]}>
                {item?.transactionsaddress?.drivers?.driverdetails?.[0]?.name}
              </Text>
              <HStack>
                <FastImage
                  source={StarIcon}
                  style={componentStyles.imgRatingIcon}
                />
                <Spacer width={CustomSpacing(2)} />
                <Text style={[Fonts.labelSemiBold]}>
                  {driverRating ? driverRating : '0'}
                </Text>
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.label]}>
                  {driverData?.drivervehicles?.plate_number}
                </Text>
              </HStack>
            </VStack>
            <HStack>
              {/* <TouchableOpacity activeOpacity={0.8} onPress={goToCall}>
                <FastImage
                  source={CallIcon}
                  style={componentStyles.imgCommunicationIcon}
                />
              </TouchableOpacity> */}

              <Spacer width={CustomSpacing(16)} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => goToChat(item)}>
                <FastImage
                  source={MessageNotifIcon}
                  style={componentStyles.imgCommunicationIcon}
                />
              </TouchableOpacity>
            </HStack>
          </HStack>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      {/* ------ OrderData------ */}
      {OrderData.length > 0 && (
        <Animated.ScrollView
          style={
            ({
              position: 'absolute',
              bottom:
                Platform.OS === 'ios'
                  ? -CustomSpacing(65)
                  : -CustomSpacing(-83),
              left: CustomSpacing(16),
            },
            [downReflesh])
          }>
          <VStack>
            <FlatList
              data={OrderData}
              renderItem={renderItem ?? []}
              keyExtractor={(item, index) => `order-list-${index.toString()}`}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={100}
              initialNumToRender={5}
              windowSize={10}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: CustomSpacing(16),
              }}
              // onEndReachedThreshold={0.1}
              // onEndReached={getOrders}
            />
            <Spacer height={CustomSpacing(12)} />
          </VStack>
          {orderStore.lisOrderPages < orderStore.allPages ? (
            <VStack>
              <TouchableOpacity onPress={() => getOrders()} activeOpacity={0.8}>
                <HStack style={[Layout.flexCenterMid]}>
                  {orderStore.listOrderLoading ? (
                    <ActivityIndicator
                      size="large"
                      color={Colors.primaryMain}
                    />
                  ) : (
                    <Text style={[Fonts.body, {color: Colors.neutral60}]}>
                      Load more
                    </Text>
                  )}

                  <Spacer width={CustomSpacing(12)} />
                  {/* <FastImage
              source={BackToTop}
              style={{
                width: CustomSpacing(24),
                height: CustomSpacing(24),
              }}
              resizeMode={'contain'}
            /> */}
                </HStack>
              </TouchableOpacity>
              <Spacer height={CustomSpacing(18)} />
            </VStack>
          ) : null}
        </Animated.ScrollView>
      )}

      {/* ------ Empty Order------ */}
      {OrderData.length === 0 && !orderStore.listOrderLoading && (
        <>
          <Spacer height={dimensions.screenWidth * 0.28} />
          <Animatable.View animation="bounceIn" delay={200}>
            <VStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                source={NoOrderIcon}
                style={componentStyles.imgBillIcon}
              />
              <Spacer height={CustomSpacing(16)} />
              <Text style={[Fonts.label, {textAlign: 'center'}]}>
                {t('wlNoOngoingOrder')}
              </Text>
              <Spacer height={CustomSpacing(40)} />
              <Button
                label={t('btnLetMakeOrder')}
                type="primary"
                size="medium"
                onPress={goToExplore}
              />
            </VStack>
          </Animatable.View>
        </>
      )}

      {orderStore.listOrderLoading && OrderData.length === 0 && (
        <>
          <Spacer height={dimensions.screenWidth * 0.28} />
          <Animatable.View animation="bounceIn" delay={200}>
            <VStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color={Colors.primaryMain} />
              <Spacer height={CustomSpacing(16)} />
              <Text style={[Fonts.label]}>{t('wlPleaseWait')}</Text>
            </VStack>
          </Animatable.View>
        </>
      )}
    </VStack>
  );
});

export default HistoryPayyuq;
