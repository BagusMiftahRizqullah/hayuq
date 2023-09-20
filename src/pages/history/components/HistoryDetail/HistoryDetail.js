import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useStores} from '@store/root.store';
import ToggleSwitch from 'toggle-switch-react-native';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  CloseOutlineIcon,
  PizzahutIcon,
  StarIcon,
  james,
  Location,
  deliveryLocation,
  foodTest,
  LikeHistory,
  InfoCircle,
  HideEye,
} from '@assets';
import Numbro from '@utils/numbro';
import {observer} from 'mobx-react-lite';
import {dimensions} from '@config/Platform.config';
import styles from './HistoryDetail.style';
import Icon from 'react-native-vector-icons/AntDesign';
import stylesReviewModal from './ReviewModal.style';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

import {Rating, AirbnbRating} from 'react-native-ratings';

const HistoryDetail = observer((route) => {
  const {t, i18n} = useTranslation();
  const {historyStore, exploreStore} = useStores();
  const componentStyles = styles();
  const componentStylesReviewModal = stylesReviewModal();
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [isOn, setIsOn] = useState(false);
  const [HistoryDetail, setHistoryDetail] = useState([]);
  const [starTouch, setStarTouch] = useState();
  const [refreshing, setRefreshing] = useState(false);
  // const orderData = {
  //   id: 1,
  //   nama_store: 'KFC, Kemang Pratama',
  //   type: 'Food Delivery',
  //   price: 'Rp40.000',
  //   time_order: 'Monday, 21 Nov, 09:45',
  //   store_review: 0,
  //   store_pic: PizzahutIcon,
  //   driver_pic: '',
  //   driver_name: 'James Warden',
  //   driver_rate: 0,
  //   driver_code: 'B1234QWE',
  //   my_rating_store: 0,
  //   my_rating_driver: 4.0,
  //   orderStatus: 'COMPLETED',
  //   driverStatus: '',
  //   metode_pembayaran: 'payyuq',
  //   food_review: 'mantapp',
  // };

  goReorders = async () => {
    await historyStore.postReOrder();
    if (historyStore.ReOrderData !== null) {
      console.log('GO REORDER');
      await exploreStore.setMerchantDetailId(historyStore.merchantID);
      console.log('GO REORDER22');
      navigation.navigate('RestaurantPage');
    }
  };

  // useEffect(async () => {
  //   if (historyStore.ReOrderData !== null) {
  //     console.log('GO REORDER');
  //     await exploreStore.setMerchantDetailId(historyStore.merchantID);
  //     console.log('GO REORDER22');
  //     navigation.navigate('RestaurantPage');
  //   }
  // }, [historyStore.ReOrderData]);

  useEffect(() => {
    historyStore.getHistoryDetail();
  }, []);

  useEffect(() => {
    if (
      historyStore.detailHistoryData !== null &&
      historyStore.detailHistoryData
    ) {
      setHistoryDetail(historyStore.detailHistoryData);
      historyStore.setMerchantId(
        historyStore.detailHistoryData?.transactionsaddress?.merchants?.id,
      );

      historyStore.setTransactionID(
        historyStore.detailHistoryData?.transactions?.id,
      );
    }
  }, [historyStore.detailHistoryData]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
        if (scrollRef && scrollRef.current) {
          scrollRef.current.scrollToEnd({animated: true});
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['75%', '75%'], []);

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
    bottomSheetRef.current?.snapToPosition('95%');
  }, []);

  const handleKeyboardModalBlur = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('75%');
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
    setStarTouch(rating);
  };

  const goReview = async () => {
    const newData = {
      rating: starTouch,
      myReview: myReview,
    };
    await historyStore.setRatingParam(newData);
    console.log('newData Ratingss', newData);
    await historyStore.setRatingHistory();
    await onRefresh();
    await goBack();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.navigatorBarContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgCloseIcon}
          />
        </TouchableOpacity>
        <Spacer
          width={CustomSpacing(dimensions.screenWidth - CustomSpacing(298))}
        />
        <HStack style={{alignItems: 'center'}}>
          <HStack>
            <Text style={[Fonts.subhead]}>
              {HistoryDetail?.transactions?.code}
            </Text>
          </HStack>
        </HStack>
      </HStack>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <VStack key={index}>
        <HStack>
          <Spacer width={CustomSpacing(18)} />
          <Text style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
            {`${item?.productsprice?.quantitys}x`}
          </Text>
          <Spacer width={CustomSpacing(12)} />
          <FastImage source={foodTest} style={componentStyles.imgDev} />
          <Spacer width={CustomSpacing(8)} />
          <HStack
            style={{
              justifyContent: 'space-between',
              maxWidth: CustomSpacing(160),
            }}>
            <VStack style={{maxWidth: CustomSpacing(100)}}>
              <Text style={[Fonts.label, componentStyles.textContainer]}>
                {item?.name}
              </Text>
              <Spacer
                width={CustomSpacing(
                  item?.productsvariants?.length > 0 && showMore ? 80 : 100,
                )}
              />
              {item?.productsvariants?.length > 0 && showMore && (
                <VStack>
                  {item?.productsvariants?.map((v, i) => {
                    return (
                      <HStack>
                        <Text
                          style={[
                            Fonts.captionM,
                            componentStyles.textContainer,
                          ]}>
                          {`${v?.quantity}x ${v?.name}`}
                        </Text>
                        <HStack>
                          <Spacer width={CustomSpacing(8)} />
                          <FastImage
                            source={LikeHistory}
                            style={componentStyles.imgLike}
                          />
                        </HStack>
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </VStack>
            <Spacer
              width={CustomSpacing(
                item?.productsvariants?.length > 0 && showMore ? 80 : 80,
              )}
            />

            {item?.productsvariants?.length > 0 && showMore && (
              <VStack>
                <HStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(item?.productsprice?.price)}`}
                  </Text>
                  <Spacer width={CustomSpacing(8)} />
                  <FastImage
                    source={LikeHistory}
                    style={componentStyles.imgLike}
                  />
                </HStack>
                <Text
                  style={[Fonts.captionM, componentStyles.textContainerOrange]}>
                  {`Rp. ${Numbro.formatCurrency(
                    item?.productsvariants[index]?.price,
                  )}`}
                </Text>
              </VStack>
            )}

            {!showMore && (
              <VStack>
                <HStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(item?.productsprice?.price)}`}
                  </Text>
                  <Spacer width={CustomSpacing(8)} />
                  <FastImage
                    source={LikeHistory}
                    style={componentStyles.imgLike}
                  />
                </HStack>
              </VStack>
            )}
          </HStack>

          <Spacer
            width={CustomSpacing(
              dimensions.screenWidth - CustomSpacing(showMore ? 262 : 254),
            )}
          />
        </HStack>
        <Spacer height={CustomSpacing(8)} />
      </VStack>
    );
  };

  const DriverDetails = HistoryDetail?.transactionsaddress?.drivers;
  const MerchantRating = HistoryDetail?.ratings?.transactions;
  const ProductsVariants =
    HistoryDetail?.transactionproducts?.[0].productsvariants;
  const MerchantLocation =
    HistoryDetail?.transactionsaddress?.merchants?.address;
  const userLocation = HistoryDetail?.transactionsaddress?.users;

  console.log('users=>>>', JSON.stringify(userLocation, 2, null));
  // const MerchantRating = 1;
  return (
    <VStack style={componentStyles.containerChat}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <VStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack style={{alignItems: 'center'}}>
            <FastImage
              source={{
                uri: HistoryDetail?.transactionsaddress?.merchants
                  ?.pictures?.[0]['path'],
              }}
              style={componentStyles.imgIconStore}
            />
            <Spacer height={CustomSpacing(8)} />
            <Text style={[Fonts.subhead, componentStyles.textContainer]}>
              {HistoryDetail?.transactionsaddress?.merchants?.name}
            </Text>
            <Text style={[Fonts.label, componentStyles.textContainer]}>
              {HistoryDetail?.transactions?.updated_at}
            </Text>
            <Text
              style={[Fonts.labelSemiBold, componentStyles.textFoodDelivery]}>
              {t('wlFoodDelivery')}
            </Text>
            <Spacer height={CustomSpacing(8)} />
            <Text style={[Fonts.headlineL, componentStyles.textq]}>
              {t('wlHowWasYourFood')}
            </Text>
            <Text style={[Fonts.headlineL, componentStyles.textq]}>
              {t('wlRateRestaurant')}
            </Text>
            <Spacer height={CustomSpacing(8)} />
            {/* starts */}
            <HStack>
              <Rating
                readonly={MerchantRating?.ratings ? true : false}
                isDisabled={MerchantRating?.ratings ? true : false}
                defaultRating={MerchantRating?.ratings}
                startingValue={MerchantRating?.ratings}
                ratingColor="#FFD202"
                ratingBackgroundColor="#EDEDED"
                ratingCount={5}
                imageSize={45}
                onFinishRating={ratingCompleted}
                style={{paddingVertical: 10}}
              />
            </HStack>
            <Spacer height={CustomSpacing(32)} />
            {/* Review */}
            <HStack style={componentStyles.constinerReviewRestauran}>
              <Spacer width={CustomSpacing(100)} />
              <VStack
                style={{
                  alignSelf: 'center',
                }}>
                {MerchantRating?.ratings ? (
                  <VStack>
                    <Text style={[Fonts.bodySemiBold, {fontSize: 17}]}>
                      {t('wlYourReview')}
                    </Text>
                    <Text style={[Fonts.captionM, {fontSize: 12}]}>
                      {MerchantRating?.notes}
                    </Text>
                  </VStack>
                ) : (
                  <VStack>
                    <Text style={[Fonts.bodySemiBold, {fontSize: 17}]}>
                      {t('wlNoReview')}
                    </Text>
                    <Text style={[Fonts.captionM, {fontSize: 12}]}>
                      {t('wlTeelUs')}
                    </Text>
                  </VStack>
                )}
              </VStack>
              {MerchantRating?.ratings == null && (
                <TouchableOpacity onPress={handlePresentModalPress}>
                  <Icon name="arrowright" size={23} color={Colors.neutral80} />
                </TouchableOpacity>
              )}
              <Spacer width={CustomSpacing(100)} />
            </HStack>
            <Spacer height={CustomSpacing(32)} />
            {/* Myratings */}
            <VStack
              style={{
                alignSelf: 'flex-start',
                maxWidth: dimensions.screenWidth,
              }}>
              <Spacer width={CustomSpacing(dimensions.screenWidth)} />
              <HStack>
                <Spacer width={CustomSpacing(12)} />
                <FastImage
                  source={{uri: DriverDetails?.driverdetails?.path}}
                  style={componentStyles.imgRatingIconTouch}
                />
                <Spacer width={CustomSpacing(12)} />
                <VStack>
                  <Text style={[Fonts.subhead, componentStyles.textContainer]}>
                    {DriverDetails?.driverdetails?.name}
                  </Text>
                  <HStack>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgRatingIcon}
                      tintColor={'#FFD202'}
                    />
                    <Text style={Fonts.labelSemiBold}>5.0</Text>
                    <Text style={Fonts.label}>{` • ${
                      DriverDetails?.drivervehicles?.plate_number
                        ? DriverDetails?.drivervehicles?.plate_number
                        : ''
                    }`}</Text>
                  </HStack>
                </VStack>
              </HStack>
              <Spacer height={CustomSpacing(8)} />

              <HStack
                style={{
                  height: 1,
                  borderColor: Colors.neutral40,
                  borderWidth: 1,
                  margin: CustomSpacing(8),
                }}
              />
              <Spacer height={CustomSpacing(8)} />
              {MerchantRating && (
                <VStack style={{alignItems: 'center'}}>
                  <Text style={[Fonts.captionM, componentStyles.textContainer]}>
                    {t('wlThakyouForRate')}
                  </Text>
                  <Spacer height={CustomSpacing(4)} />

                  <HStack>
                    <Rating
                      readonly={true}
                      isDisabled={true}
                      defaultRating={MerchantRating?.ratings}
                      startingValue={MerchantRating?.ratings}
                      ratingColor="#FFD202"
                      ratingBackgroundColor="#EDEDED"
                      ratingCount={5}
                      imageSize={45}
                      style={{paddingVertical: 10}}
                    />
                  </HStack>
                </VStack>
              )}
            </VStack>
            {/* Delivery Detail */}

            <Spacer height={CustomSpacing(23)} />
            <VStack
              style={{
                alignSelf: 'flex-start',
                maxWidth: dimensions.screenWidth,
              }}>
              <HStack>
                <Spacer width={CustomSpacing(18)} />
                <Text
                  style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
                  {t('wlDeliveryDetails')}
                </Text>
              </HStack>
              <Spacer height={CustomSpacing(12)} />
              <HStack>
                <Spacer width={CustomSpacing(18)} />
                <VStack>
                  {/* Restauran Location */}
                  <HStack>
                    <VStack>
                      <FastImage
                        source={Location}
                        style={componentStyles.imgDev}
                      />
                      <Spacer width={CustomSpacing(43)} />
                    </VStack>
                    <VStack>
                      <Text
                        style={[Fonts.captionS, componentStyles.textContainer]}>
                        {t('wlRestauranLocation')}
                      </Text>
                      <Text
                        style={[
                          Fonts.labelSemiBold,
                          componentStyles.textContainer,
                        ]}>
                        {MerchantLocation?.address}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Spacer width={CustomSpacing(11)} />
                    <VStack
                      style={{
                        // position: 'absolute',
                        width: 2,
                        height: CustomSpacing(30),
                        backgroundColor: Colors.neutral30,
                        borderStyle: 'dotted',
                        borderWidth: 0,
                      }}
                    />
                  </HStack>

                  {/* Delivery Location */}

                  <HStack>
                    <VStack>
                      <FastImage
                        source={deliveryLocation}
                        style={componentStyles.imgDev}
                      />
                      <Spacer width={CustomSpacing(43)} />
                    </VStack>
                    <VStack>
                      <Text
                        style={[Fonts.captionS, componentStyles.textContainer]}>
                        {t('wlDeliveryLocation')}
                      </Text>
                      <Text
                        style={[
                          Fonts.labelSemiBold,
                          componentStyles.textContainer,
                        ]}>
                        {userLocation?.usersaddress?.[0]?.address}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <Spacer height={CustomSpacing(36)} />
            {/* Order Summary */}
            <VStack
              style={{
                alignSelf: 'flex-start',
                maxWidth: dimensions.screenWidth,
              }}>
              <HStack>
                <Spacer width={CustomSpacing(18)} />
                <Text
                  style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
                  {t('hOrdersummary')}
                </Text>
              </HStack>
              <Spacer height={CustomSpacing(12)} />
              {/* <FlatList
                data={HistoryDetail?.transactionproducts}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                // maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                initialNumToRender={5}
                // windowSize={10}
              /> */}
              {HistoryDetail?.transactionproducts?.map((item, index) => {
                return renderItem({item, index});
              })}
              <Spacer height={CustomSpacing(8)} />

              <HStack
                style={{
                  height: 1,
                  borderColor: Colors.neutral40,
                  borderWidth: 1,
                }}
              />
              <Spacer height={CustomSpacing(8)} />
              {ProductsVariants?.length > 0 && (
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    paddingLeft: CustomSpacing(12),
                  }}>
                  <Text style={[Fonts.label, componentStyles.textContainer]}>
                    {showMore ? `Less details` : 'More details'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMore(!showMore);
                    }}>
                    <Icon
                      name={showMore ? 'up' : 'down'}
                      size={23}
                      color={Colors.neutral80}
                    />
                  </TouchableOpacity>
                </HStack>
              )}
            </VStack>

            <Spacer height={CustomSpacing(24)} />
            {/* Payment Detail */}
            <VStack
              style={{
                alignSelf: 'flex-start',
                maxWidth: dimensions.screenWidth,
              }}>
              <HStack>
                <Spacer width={CustomSpacing(18)} />
                <Text
                  style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
                  {t('wlPaymentDetails')}
                </Text>
              </HStack>
              <Spacer height={CustomSpacing(8)} />
              <VStack
                style={{
                  justifyContent: 'space-between',
                  height: dimensions.screenHeight - CustomSpacing(256),
                }}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <Text style={[Fonts.label, componentStyles.textContainer]}>
                    {t('wlSubTotal')}
                  </Text>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(
                      HistoryDetail?.price?.totalmerchantstotal,
                    )}`}
                  </Text>
                </HStack>

                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <HStack>
                    <Text style={[Fonts.label, componentStyles.textContainer]}>
                      {t('wlDeliveryFee')}
                    </Text>
                    <Spacer width={CustomSpacing(6)} />
                    <FastImage
                      source={InfoCircle}
                      style={componentStyles.imgInfo}
                    />
                  </HStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(
                      HistoryDetail?.price?.totaldelivery,
                    )}`}
                  </Text>
                </HStack>

                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <HStack>
                    <Text style={[Fonts.label, componentStyles.textContainer]}>
                      {t('wlServiceOtherFees')}
                    </Text>
                    <Spacer width={CustomSpacing(6)} />
                    <FastImage
                      source={InfoCircle}
                      style={componentStyles.imgInfo}
                    />
                  </HStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(
                      HistoryDetail?.price?.totalservice +
                        HistoryDetail?.price?.totalplatform,
                    )}`}
                  </Text>
                </HStack>

                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <HStack>
                    <Text style={[Fonts.label, componentStyles.textContainer]}>
                      {t('wlDiscounts')}
                    </Text>
                    <Spacer width={CustomSpacing(6)} />
                    <FastImage
                      source={InfoCircle}
                      style={componentStyles.imgInfo}
                    />
                  </HStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainerOrange,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(
                      HistoryDetail?.price?.totalpromotions,
                    )}`}
                  </Text>
                </HStack>
                <Spacer height={CustomSpacing(8)} />
                <HStack
                  style={{
                    height: 1,
                    borderColor: Colors.neutral40,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                  }}
                />
                <Spacer height={CustomSpacing(8)} />
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {t('wlTotalPayment')}
                  </Text>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {`Rp. ${Numbro.formatCurrency(
                      HistoryDetail?.price?.total,
                    )}`}
                  </Text>
                </HStack>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    width: dimensions.screenWidth - CustomSpacing(16),
                    paddingLeft: CustomSpacing(18),
                  }}>
                  <Text style={[Fonts.label, componentStyles.textContainer]}>
                    {t('wlPayment')}
                  </Text>
                  <Text style={[Fonts.label, componentStyles.textContainer]}>
                    {HistoryDetail?.payments?.userswallets_id}
                  </Text>
                </HStack>
                <Spacer height={CustomSpacing(24)} />

                {/* Button Order Again */}
                <VStack style={componentStyles.ButtonOrderAgain}>
                  <Button
                    onPress={() => goReorders()}
                    style={{color: Colors.primarySurface}}
                    label="Order again"
                    type="primary"
                    size="large"
                  />
                </VStack>
              </VStack>
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(42)} />
        </VStack>
        <BottomSheetModalProvider>
          <VStack>
            <BottomSheetModal
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <VStack style={componentStylesReviewModal.bottomSheetContainer}>
                <HStack style={{justifyContent: 'space-between'}}>
                  <Text style={[Fonts.headlineL]}>{t('wlTellUsMore')}</Text>
                  <TouchableOpacity onPress={handleCloseModalPress}>
                    <FastImage
                      source={CloseOutlineIcon}
                      style={componentStylesReviewModal.imgCloseIcon}
                    />
                  </TouchableOpacity>
                </HStack>
                <VStack>
                  <Spacer height={CustomSpacing(18)} />
                  <TextInput
                    multiline
                    numberOfLines={6}
                    style={[Fonts.label, componentStylesReviewModal.inputStyle]}
                    onBlur={(focus) => {
                      console.log('Blur=>>>', focus), handleKeyboardModalBlur();
                    }}
                    onFocus={(focus) => {
                      console.log('focus=>>>', focus),
                        handleKeyboardModalPress();
                    }}
                    value={myReview}
                    onChangeText={(text) => setMyReview(text)}
                  />
                </VStack>
                <Spacer height={CustomSpacing(12)} />
                <HStack style={{justifyContent: 'space-between'}}>
                  <HStack>
                    <FastImage
                      source={HideEye}
                      style={componentStylesReviewModal.imgHideEye}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text>{t('wlHideMyName')}</Text>
                  </HStack>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={Colors.secondaryMain}
                    offColor={Colors.neutral70}
                    labelStyle={{color: 'black', fontWeight: '900'}}
                    size="medium"
                    onToggle={() => setIsOn(!isOn)}
                  />
                </HStack>
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
          </VStack>
        </BottomSheetModalProvider>
      </ScrollView>
    </VStack>
  );
});

export default HistoryDetail;
