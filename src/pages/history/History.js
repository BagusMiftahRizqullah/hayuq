import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {useStores} from '@store/root.store';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  NoOrderIcon,
  StarIcon,
  CloseOutlineIcon,
  wallet,
  HideEye,
} from '@assets';
import {dimensions} from '@config/Platform.config';
import Numbro from '@utils/numbro';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './History.style';
import {useTranslation} from 'react-i18next';

import {Rating, AirbnbRating} from 'react-native-ratings';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import stylesReviewModal from './components/HistoryDetail/ReviewModal.style';

const HistoryPayyuq = observer(() => {
  const {t} = useTranslation();
  const {historyStore, routerStore} = useStores();
  const bottomSheetRef = useRef(null);
  const componentStyles = styles();
  const componentStylesReviewModal = stylesReviewModal();
  const navigation = useNavigation();
  const [HistoryData, setHistoryData] = useState([]);
  // const [tooogle, setToogle] = useState(false);
  const [starTouch, setStarTouch] = useState();
  const [myReview, setMyReview] = useState('');
  const snapPointsDriverRatings = useMemo(() => ['75%', '75%'], []);
  const ratingCompleted = async (rating) => {
    setStarTouch(rating);
    handlePresentModalPress();
  };

  const goToExplore = () => {
    navigation.navigate('Explore');
  };

  const goToDetail = (id_trx) => {
    historyStore.setHistoryDetailTransactionId(id_trx);
    navigation.navigate('HistoryDetail');
  };
  const getHistorys = async () => {
    historyStore.getHistoryList();
  };

  // useEffect(() => {
  //   historyStore.setPageHistory(1);
  //   historyStore.getHistoryList();
  //   historyStore.ReOrderSuccess(null);
  // }, []);

  useFocusEffect(
    useCallback(() => {
      historyStore.setPageHistory(1);
      historyStore.getHistoryList();
      historyStore.ReOrderSuccess(null);
    }, []),
  );

  useEffect(() => {
    if (historyStore.listHistoryData !== null && historyStore.listHistoryData) {
      setHistoryData(historyStore.listHistoryData);
    }
  }, [historyStore.listHistoryData]);

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
        <Text style={[Fonts.subhead]}>{t('hHistoryOrder')}</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    console.log('ref=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    console.log('ref=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.close();
  }, []);

  const handleKeyboardModalPress = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('85%');
  }, []);

  const handleKeyboardModalBlur = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('75%');
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const goReview = async () => {
    const newData = {
      rating: starTouch,
      myReview: myReview,
    };
    await historyStore.setRatingParam(newData);
    console.log(
      'newData lisHistoryPages =>>>>>>',
      historyStore.lisHistoryPages,
    );
    await historyStore.setRatingDriver();
    await historyStore.getHistoryLists();
    await handleCloseModalPress();
  };

  const renderItem = ({item, index}) => {
    const StatusDelivery = [
      {status: 0, name: 'New Order'},
      {status: 1, name: 'Order Accept'},
      {status: 2, name: 'Order Ready'},
      {status: 3, name: 'Driver Waiting'},
      {status: 4, name: 'Driver Accept'},
      {status: 5, name: 'Driver Send'},
      {status: 6, name: 'Delivery Finished'},
      {status: 7, name: 'Merchant Cancelled'},
      {status: 8, name: 'Driver Cancelled'},
      {status: 9, name: 'User Cancelled'},
    ];
    const transactionId = item.transactions?.id;
    const driverData = item.transactionsaddress?.drivers;
    const statusRating = item.ratings?.transactions;
    const driverRating = item.ratings?.drivers?.ratings;

    const myStatusDelivery = StatusDelivery.find(
      (a) => a?.status == item?.delivery.status,
    );
    const rateRestauran =
      statusRating && myStatusDelivery?.status == 6 ? true : false;
    let reviewFood = false;
    let cancelOrder = false;
    let haveReviewFood = false;

    console.log('driverData = >>>>>>>>>>>>>>>>>>>>>>', driverData);

    return (
      <TouchableOpacity
        onPress={() => goToDetail(transactionId)}
        key={index}
        style={componentStyles.orderCard}>
        <VStack
          borderBottomWidth={0}
          borderBottomColor={Colors.neutral70}
          bottom={0}>
          <HStack>
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
                tintColor={cancelOrder ? Colors.neutral90 : null}
              />
            </VStack>
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <HStack
                style={{
                  justifyContent: 'space-between',
                  width: dimensions.screenWidth - CustomSpacing(127),
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    Fonts.subhead,
                    componentStyles.textContainer,
                    {
                      width: dimensions.screenWidth * 0.5,
                    },
                  ]}>
                  {item?.transactionsaddress?.merchants?.name}
                </Text>
                <Text
                  style={
                    (Fonts.subhead,
                    {
                      color: Colors.primaryPressed,
                    })
                  }>{`Rp.${Numbro.formatCurrency(item?.price?.total)}`}</Text>
              </HStack>
              <HStack
                style={{
                  justifyContent: 'space-between',
                  width: dimensions.screenWidth - CustomSpacing(127),
                }}>
                <VStack>
                  <Text style={[Fonts.captionMSemiBold]}>Food delivery</Text>
                  <Text style={[Fonts.captionM]}>
                    {item?.transactions?.updated_at
                      ? moment(item?.transactions?.updated_at).format(
                          'DD MMM YYYY, HH:MM',
                        )
                      : ''}
                  </Text>
                </VStack>
                <VStack
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  <HStack>
                    <FastImage
                      source={wallet}
                      style={componentStyles.imgRatingIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text
                      style={[
                        Fonts.captionM,
                        {
                          color: Colors.primaryPressed,
                        },
                      ]}>
                      {item.payments?.userswallets_id}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
          <VStack>
            <HStack style={{alignSelf: 'flex-end'}}>
              <VStack style={componentStyles.btnReorder}>
                <Text
                  style={[
                    Fonts.captionMSemiBold,
                    {color: Colors.secondaryMain},
                  ]}>
                  {myStatusDelivery?.name}
                </Text>
              </VStack>
            </HStack>
          </VStack>
          <View
            style={{
              borderBottomColor: Colors.neutral30,
              borderBottomWidth: 1,
              width: dimensions.screenWidth - CustomSpacing(64),
              alignSelf: 'center',
              marginVertical: CustomSpacing(8),
            }}
          />
        </VStack>

        {/* Rate Restauran */}
        {rateRestauran && (
          <TouchableOpacity onPress={() => goToDetail(item)}>
            <HStack style={componentStyles.containerRateRestauran}>
              <Text style={[Fonts.labelSemiBold, {color: '#404040'}]}>
                {t('wlRateRestaurant')}
              </Text>
              <HStack>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#FFD202'}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
              </HStack>
            </HStack>
            <Spacer height={CustomSpacing(12)} />
          </TouchableOpacity>
        )}

        {/* Review Food */}
        {reviewFood && (
          <HStack style={componentStyles.constinerReviewRestauran}>
            <HStack>
              <Text
                style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
                {statusRating}
              </Text>
              <FastImage
                source={StarIcon}
                style={componentStyles.imgRatingIconReviewFood}
                tintColor={'#FFD202'}
              />
            </HStack>
            <VStack
              style={{
                alignSelf: 'center',
              }}>
              <Text style={[Fonts.bodySemiBold]}>
                {item.my_rating_food > 0 ? t('wlYourReview') : t('wlNoReview')}
              </Text>
              <Text style={[Fonts.captionM]}>
                {item.my_rating_food > 0
                  ? item.food_review
                  : t('wlHowWasYourFood')}
              </Text>
            </VStack>
            <TouchableOpacity>
              <Icon name="arrowright" size={23} color={Colors.neutral80} />
            </TouchableOpacity>
          </HStack>
        )}

        {/* Order Cancelled */}

        <HStack
          style={{
            alignItems: 'center',
          }}>
          <VStack
            style={{
              alignSelf: 'flex-start',
            }}>
            <FastImage
              source={{uri: driverData?.driverdetails?.path}}
              style={componentStyles.imgRatingIconTouch}
            />
          </VStack>
          <Spacer width={CustomSpacing(8)} />
          <VStack>
            <HStack
              style={{
                justifyContent: 'space-between',
                width: dimensions.screenWidth - CustomSpacing(109),
              }}>
              <VStack>
                <Text style={[Fonts.subhead, componentStyles.textContainer]}>
                  {driverData.driverdetails?.name}
                </Text>
                <HStack>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIcon}
                    tintColor={'#FFD202'}
                  />
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={Fonts.labelSemiBold}>
                    {driverRating ? driverRating : '0'}
                  </Text>
                  <Text style={Fonts.captionM}>{` • ${
                    driverData?.drivervehicles?.plate_number
                      ? driverData?.drivervehicles?.plate_number
                      : ''
                  }`}</Text>
                </HStack>
              </VStack>
              {item.ratings?.drivers?.ratings == null && (
                <VStack>
                  <Text
                    style={[
                      Fonts.captionS,
                      componentStyles.textContainer,
                      {fontSize: 10},
                    ]}>
                    {t('wlHowDelivery')}
                  </Text>
                  <HStack>
                    <Rating
                      readonly={
                        item.ratings?.drivers?.ratings > 0 ? true : false
                      }
                      isDisabled={
                        item.ratings?.drivers?.ratings > 0 ? true : false
                      }
                      defaultRating={item.ratings?.drivers?.ratings}
                      startingValue={item.ratings?.drivers?.ratings}
                      ratingColor="#FFD202"
                      ratingBackgroundColor="#EDEDED"
                      ratingCount={5}
                      imageSize={23}
                      onFinishRating={async (a) => {
                        await historyStore.setTransactionID(
                          item.transactions?.id,
                        );
                        await historyStore.setDriverId(
                          item.transactionsaddress?.drivers?.driverdetails?.[0]
                            ?.drivers_id,
                        );

                        console.log(
                          'RATINGS SELECT',
                          transactionId,
                          item.transactionsaddress?.drivers?.driverdetails?.[0]
                            ?.drivers_id,
                        );
                        await ratingCompleted(a);
                      }}
                      style={{paddingVertical: 10}}
                    />
                  </HStack>
                </VStack>
              )}

              {rateRestauran && (
                <VStack>
                  <Text
                    style={[
                      Fonts.captionMSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {t('wlYourRating')}
                  </Text>
                  <HStack>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgRatingIcon}
                      tintColor={Colors.primaryMain}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.subhead]}>
                      {item?.ratings ? item.ratings : '0.0'}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </HStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  console.log('HistoryData', HistoryData);
  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      {/* ------ OrderData------ */}
      {HistoryData.length > 0 && (
        <ScrollView>
          <VStack
            style={{
              padding: CustomSpacing(16),
            }}>
            <FlatList
              data={HistoryData}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={100}
              initialNumToRender={5}
              windowSize={10}
            />

            <Spacer height={CustomSpacing(12)} />
          </VStack>
          <VStack>
            {historyStore.lisHistoryPages < historyStore.allPages ? (
              <TouchableOpacity
                onPress={() => getHistorys()}
                activeOpacity={0.8}>
                <HStack style={[Layout.flexCenterMid]}>
                  {historyStore.listHistoryLoading ? (
                    <ActivityIndicator
                      size="large"
                      color={Colors.primaryMain}
                    />
                  ) : (
                    <Text style={[Fonts.body, {color: Colors.neutral60}]}>
                      Load more
                    </Text>
                  )}

                  {/* <Spacer width={CustomSpacing(18)} /> */}
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
            ) : null}
          </VStack>
          <Spacer height={CustomSpacing(18)} />
        </ScrollView>
      )}

      {/* ------ Empty Order------ */}
      {HistoryData.length == 0 && !historyStore.listHistoryLoading && (
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
                {t('wlNoOrder')}
              </Text>
              <Spacer height={CustomSpacing(40)} />
              <Button
                label="Let’s make an order"
                type="primary"
                size="medium"
                onPress={goToExplore}
              />
            </VStack>
          </Animatable.View>
        </>
      )}

      {/* Modal Driver RatingNotes */}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPointsDriverRatings}
          onChange={handleSheetChanges}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <VStack style={componentStylesReviewModal.bottomSheetContainer}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.headlineL]}>{t('wlTellUsMore')}</Text>
              <TouchableOpacity onPress={() => handleCloseModalPress()}>
                <FastImage
                  source={CloseOutlineIcon}
                  style={componentStylesReviewModal.imgCloseIcon}
                />
              </TouchableOpacity>
            </HStack>
            <VStack>
              <Spacer height={CustomSpacing(18)} />
              <TextInput
                multiline={true}
                numberOfLines={6}
                style={[Fonts.label, componentStylesReviewModal.inputStyle]}
                onBlur={(focus) => {
                  console.log('Blur=>>>', focus), handleKeyboardModalBlur();
                }}
                onFocus={(focus) => {
                  console.log('focus=>>>', focus), handleKeyboardModalPress();
                }}
                value={myReview}
                onChangeText={(text) => setMyReview(text)}
              />
            </VStack>
            <Spacer height={CustomSpacing(12)} />
            <HStack style={{justifyContent: 'space-between'}}></HStack>
            <Spacer height={CustomSpacing(12)} />
            <Button
              onPress={() => goReview()}
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

      {/* Loadings */}
      {historyStore.listHistoryLoading && HistoryData.length == 0 && (
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
