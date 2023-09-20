import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Platform,
  FlatList,
  SectionList,
  LogBox,
  ActivityIndicator,
  Modal,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import {
  OutOfRange,
  ChangeResto,
  BackLeft,
  SearchIcon,
  ShareIconRes,
  InforIcon,
} from '@assets';
import Numbro from '@utils/numbro';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import styles from './RestaurantPage.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Smartlook from 'react-native-smartlook-analytics';

LogBox.ignoreLogs(['VirtualizedLists']);

const RestaurantPage = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();
  const {exploreStore, routerStore} = useStores();
  const [restaurantData, setRestaurantData] = useState(null);
  const [showActionBar, setShowActionBar] = useState(false);
  const [restaurantProduct, setRestaurantProduct] = useState([]);
  const [productID, setProductID] = useState(null);
  const [resturantPromo, setResturantPromo] = useState([]);
  const [productPromo, setProductPromo] = useState([]);
  const [submitFormProduct, setSubmitFormProduct] = useState(null);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const translateY = useSharedValue(0);
  const translateYMenu = useSharedValue(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOutOfRangeModal, setShowOutOfRangeModal] = useState(false);
  const [showChangeRestoModal, setChangeRestoModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  // const [customizeProductModal, setCustomizeProductModal] = useState(false);
  const [tooggleRender, setToogelRender] = useState(false);
  const [closed, setClosed] = useState(false);
  // const [dataCustomizeProduct, setDataCustomizeProduct] = useState(null);
  const bottomSheetRef = useRef(null);
  const bottomSheetRefChangeRestaurant = useRef(null);
  const closeRestaurantModal = useRef(null);

  const snapPoints = useMemo(() => ['2%', '75%'], []);
  const snapPointsChangeRestaurant = useMemo(() => ['50%', '50%'], []);
  const snapPointsOutOfRange = useMemo(() => ['50%', '50%'], []);
  const restaurantDistance = useMemo(() => {
    return restaurantData?.distance?.distance?.distance;
  }, [restaurantData]);
  const [menuList, setMenuList] = useState(false);

  const handleMenuList = () => {
    setMenuList(!menuList);
  };

  const handleOutOfRangeModal = () => {
    // setShowOutOfRangeModal(true);
  };

  const handleChangeRestoModal = () => {
    setChangeRestoModal(true);
  };

  const handleCartModal = () => {
    setShowCartModal(true);
  };

  const handleCustomizeProductModal = () => {
    handlePresentModalPress();
  };

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      setShowCartModal(false);
      setShowOutOfRangeModal(false);
      setAddProductModal(false);
      setMenuList(false);
      setChangeRestoModal(false);
    }
  }, []);

  const goBack = useCallback(() => {
    exploreStore.clearMerchantDetailData();
    navigation.goBack();
  }, []);

  const goToSearchFood = () => {
    navigation.navigate('SearchFood', {
      merchantscategorys_id: undefined,
    });
  };

  const goToSearchVoucher = () => {
    // if (exploreStore.cartListData) {
    //   if (restaurantProduct[0].merchant_id !== exploreStore.cartListData?.cart?.[0]?.merchants_id) {
    //     handleChangeRestoModal();
    //   } else {
    //     navigation.navigate('SearchVoucher', {checkout: false});
    //   }
    // } else {
    navigation.navigate('SearchVoucher', {checkout: false});
    // }
  };

  const goToCategoryList = (merchantscategorys_id) => {
    setMenuList(false);
    navigation.navigate('SearchFood', {
      merchantscategorys_id: merchantscategorys_id,
    });
  };

  const goToRestaurantPageDetail = () => {
    navigation.navigate('RestaurantPageDetail');
  };

  const goToFoodDetail = (id, edit) => {
    exploreStore.clearCreateCartListResponse();
    exploreStore.getProductDetail(id);

    setToogelRender(!tooggleRender);
    navigation.navigate('FoodDetails', {edit: edit});
  };

  const goToCheckout = async () => {
    const dataArry = [];
    await exploreStore.cartListData?.cart.map((v, i) => {
      dataArry.push(v['_id']);
    });
    // console.log('Go set analytics1', dataArry);

    await analytics().logEvent('begin_checkout', {
      id_merchant: exploreStore.cartListData?.cart?.[0]?.merchants_id,
      id_user: await AsyncStorage.getItem('USER_ID'),
      item_list: dataArry,
    });

    exploreStore.postOrderCheckoutDetail({
      merchants_id: exploreStore.cartListData?.cart?.[0]?.merchants_id,
    });
    handleCloseModalPress();

    navigation.navigate('Checkout');
  };

  const handleSheetChangesCustomize = useCallback((index) => {}, []);
  console.log('closedNew=>>>', closed);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Here is my favourite restaurant, you can check it out on Hayuq App.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const filterPromo = (data) => {
    let dataPromo = [];
    data.map((item) => {
      item.data?.map((item2) => {
        if (item2.productsprices.discount_type !== 0) {
          dataPromo.push(item2);
        }
      });
    });
    setProductPromo(dataPromo);
  };

  // useEffect(() => {
  //   // if (exploreStore?.listCartProductData?.length > 0) {
  //   //   setDataCustomizeProduct(exploreStore?.listCartProductData);
  //   // }
  //   // console.log('listCartProductData', exploreStore?.listCartProductData.cart);
  // }, [exploreStore?.listCartProductData]);

  useEffect(() => {
    if (restaurantData) {
      const merchantOpenAt = restaurantData?.days?.open;

      if (merchantOpenAt == false || merchantOpenAt == null) {
        setClosed(true);
      }
      if (restaurantData?.categorys?.length > 0) {
        let data = [];

        restaurantData.categorys?.map((item, index) => {
          data.push({
            title: item.name ? item.name : null,
            data: item.products ? item.products : [],
          });
        });

        setRestaurantProduct(data);
        filterPromo(data);
      } else {
        let data = [];
        setRestaurantProduct(data);
        filterPromo(data);
      }
      if (restaurantData.marketing !== null) {
        setResturantPromo(restaurantData.marketing);
      }
    }
  }, [restaurantData]);

  useEffect(() => {
    if (exploreStore?.distanceCheckData?.status == false) {
      setShowOutOfRangeModal(true);
    }
  }, [exploreStore?.distanceCheckData]);

  // useEffect(() => {
  //   // if (restaurantData) {
  //   //   if (restaurantData?.categorys?.length > 0) {
  //   //     let data = [];
  //   //     restaurantData.categorys.map((item, index) => {
  //   //       data.push({
  //   //         title: item.name,
  //   //         data: item.products,
  //   //       });
  //   //     });
  //   //     setRestaurantProduct(data);
  //   //     filterPromo(data);
  //   //   }
  //   //   if (restaurantData.marketing !== null) {
  //   //     setResturantPromo(restaurantData.marketing);
  //   //   }
  //   // }
  // }, [exploreStore.cartListData]);

  useEffect(() => {
    if (exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, [exploreStore.updateCartData]);
  // exploreStore.updateCartData
  // exploreStore.cartListData
  useFocusEffect(
    useCallback(() => {
      setShowOutOfRangeModal(false);
      if (exploreStore.merchantDetailId) {
        exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
      }
      exploreStore.getCartList();
    }, [tooggleRender]),
  );

  useEffect(() => {
    exploreStore.getCartList();
  }, [tooggleRender]);

  useEffect(() => {
    if (exploreStore.merchantDetailData) {
      setRestaurantData(exploreStore.merchantDetailData);

      exploreStore.setCurrentLocationAddress(
        exploreStore.merchantDetailData?.distance?.longitude,
        exploreStore.merchantDetailData?.distance?.latitude,
        exploreStore.merchantDetailData?.address?.address,
        exploreStore.merchantDetailData?.address?.address,
      );
    }
  }, [exploreStore.merchantDetailData]);

  useEffect(() => {
    if (
      (exploreStore.merchantDetailData?.distance?.longitude,
      exploreStore.merchantDetailData?.distance?.latitude)
    ) {
      exploreStore.getDistanceCheck();
    }
  }, [
    exploreStore.merchantDetailData?.distance?.longitude,
    exploreStore.merchantDetailData?.distance?.latitude,
  ]);

  useEffect(() => {
    if (exploreStore.createCartResponse) {
      exploreStore.getCartList();
    }
  }, [exploreStore.createCartResponse]);

  useEffect(() => {
    if (exploreStore.updateCartData) {
      exploreStore.getCartList();
    }
  }, [exploreStore.updateCartData]);

  useEffect(() => {
    if (exploreStore.listCartProductData) {
      exploreStore.getCartList();
    }
  }, [exploreStore.listCartProductData]);

  useEffect(() => {
    if (restaurantDistance) {
      if (restaurantDistance > 5) {
        handleOutOfRangeModal();
      }
    }
  }, [restaurantDistance]);

  const actionBar = useAnimatedStyle(() => {
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

  const menuBar = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateYMenu.value, {
            duration: 750,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = -100;
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = Platform.OS === 'ios' ? 140 : 120;
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: (e) => {
      isScrolling.value = true;
      translateYMenu.value = 24;
    },
    onEndDrag: (e) => {
      isScrolling.value = false;
      translateYMenu.value = Platform.OS === 'ios' ? -100 : -10;
    },
  });

  const checkMyCart = async (merchant_id_one, merchant_id_two, products_id) => {
    // console.log('merchant_id_one=>>>>>>>>', merchant_id_one);
    // console.log('CART merchant_id_two=>>>>>>>>', merchant_id_two);
    if (exploreStore.cartListData) {
      if (merchant_id_one !== merchant_id_two) {
        setProductID(products_id);
        handleChangeRestoModal();
      } else {
        goToFoodDetail(products_id);
      }
    } else {
      goToFoodDetail(products_id);
    }
  };

  const Navigator = () => {
    return (
      <HStack style={componentStyles.actionPosition}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={componentStyles.actionContainer}
          onPress={goBack}>
          <FastImage
            source={BackLeft}
            style={{
              width: CustomSpacing(21),
              height: CustomSpacing(21),
            }}
          />
        </TouchableOpacity>
        <HStack>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToSearchFood}
            style={componentStyles.actionContainer}>
            <FastImage
              source={SearchIcon}
              style={{
                width: CustomSpacing(21),
                height: CustomSpacing(21),
              }}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(8)} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onShare}
            style={componentStyles.actionContainer}>
            <FastImage
              source={ShareIconRes}
              style={{
                width: CustomSpacing(21),
                height: CustomSpacing(21),
              }}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(8)} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={componentStyles.actionContainer}>
            <FastImage
              source={InforIcon}
              style={{
                width: CustomSpacing(21),
                height: CustomSpacing(21),
              }}
            />
          </TouchableOpacity>
        </HStack>
      </HStack>
    );
  };

  const HeaderContainer = (data) => {
    const headerData = data.data;
    const merchantOpenAt = headerData.days.data;
    const dateNow = moment(new Date()).format('dddd');
    const merchantDate = merchantOpenAt?.find((a) => a.name == dateNow);

    return (
      <VStack style={componentStyles.headerContainerRestaurant}>
        <FastImage
          source={{uri: headerData?.pictures[0].path}}
          style={componentStyles.imgAvatar}
          resizeMode={FastImage.resizeMode.contain}
        />
        <VStack>
          <Spacer height={CustomSpacing(64)} />
          <TouchableOpacity onPress={goToRestaurantPageDetail}>
            <HStack
              paddingHorizontal={CustomSpacing(16)}
              justifyContent="space-between">
              <Text
                numberOfLines={2}
                style={[
                  Fonts.titleMBold,
                  {
                    maxWidth: dimensions.screenWidth * 0.65,
                  },
                ]}>
                {headerData?.name}
              </Text>
              <Icon name="chevron-right" size={18} color={Colors.neutral80} />
            </HStack>
          </TouchableOpacity>

          <VStack paddingHorizontal={CustomSpacing(16)}>
            <Text numberOfLines={3} style={[Fonts.label]}>
              {headerData?.description}
            </Text>
          </VStack>
          <HStack style={componentStyles.detailContainer}>
            <VStack>
              <HStack style={componentStyles.ratingContainer}>
                {headerData?.ratings?.avg > 0 ? (
                  <Text style={[Fonts.labelSemiBold]}>
                    {headerData?.ratings ? headerData?.ratings?.avg : 0}
                  </Text>
                ) : (
                  <Text style={[Fonts.labelSemiBold]}>0.0</Text>
                )}
                <Spacer width={CustomSpacing(4)} />
                <Icon name="star" size={18} color={Colors.neutral90} />
              </HStack>
              <Spacer height={CustomSpacing(5)} />

              <Text
                style={[
                  Fonts.captionSSemiBold,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {`${
                  headerData?.ratings?.avg > 0
                    ? headerData?.ratings?.avg
                    : '0.0'
                } ${t('wlRatings')}`}
              </Text>
            </VStack>
            <Spacer width={CustomSpacing(4)} />
            <View style={componentStyles.separatorDetail} />
            <Spacer width={CustomSpacing(4)} />
            <VStack>
              {headerData.distance?.distance?.distance ? (
                <HStack>
                  <Icon name="place" size={18} color={Colors.supportMain} />
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={[Fonts.labelSemiBold]}>
                    {`${headerData.distance?.distance?.distance} ${headerData.distance?.distance?.unit}`}
                  </Text>
                </HStack>
              ) : null}
              <Spacer height={CustomSpacing(5)} />
              <Text
                style={[
                  Fonts.captionSSemiBold,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {t('wlDistance')}
              </Text>
            </VStack>
            <Spacer width={CustomSpacing(4)} />
            <View style={componentStyles.separatorDetail} />
            <Spacer width={CustomSpacing(4)} />
            <VStack>
              <HStack style={componentStyles.totalLikesContainer}>
                {headerData?.likes > 0 ? (
                  <Text
                    style={[Fonts.labelSemiBold, {color: Colors.neutral10}]}>
                    {headerData?.likes}
                  </Text>
                ) : (
                  <Text
                    style={[Fonts.labelSemiBold, {color: Colors.neutral10}]}>
                    0
                  </Text>
                )}

                <Spacer width={CustomSpacing(4)} />
                <Icon
                  style={{marginBottom: 2}}
                  name="thumb-up"
                  size={16}
                  color={Colors.neutral10}
                />
              </HStack>
              <Spacer height={CustomSpacing(5)} />
              <Text
                style={[
                  Fonts.captionSSemiBold,
                  {
                    textAlign: 'center',
                  },
                ]}>
                {t('wlFoodLikes')}
              </Text>
            </VStack>
            <Spacer width={CustomSpacing(4)} />
            <View style={componentStyles.separatorDetail} />
            <Spacer width={CustomSpacing(4)} />
            <VStack>
              <HStack>
                <Icon
                  name="watch-later"
                  size={16}
                  color={
                    headerData.days.hours24
                      ? Colors.successMain
                      : headerData.days.open
                      ? Colors.dangerMain
                      : Colors.successMain
                  }
                />

                <Spacer width={CustomSpacing(4)} />
                {headerData.days.hours24 ? (
                  <Text style={[Fonts.labelSemiBold]}>24 Hours</Text>
                ) : (
                  <Text style={[Fonts.labelSemiBold]}>
                    {headerData.days.open
                      ? merchantDate?.end
                      : merchantDate?.start}
                  </Text>
                )}
              </HStack>
              <Spacer height={CustomSpacing(5)} />
              {headerData.days.hours24 ? null : (
                <Text
                  style={[
                    Fonts.captionSSemiBold,
                    {
                      textAlign: 'center',
                    },
                  ]}>
                  {headerData.days.open ? t('wlCloseAt') : t('wlOpenAt')}
                </Text>
              )}
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  const Voucher = () => {
    return (
      <HStack style={componentStyles.voucherContainer}>
        <HStack>
          <Icon
            name="confirmation-number"
            size={18}
            color={Colors.supportMain}
          />
          <Spacer width={CustomSpacing(12)} />
          <Text style={[Fonts.subhead]}>{`${resturantPromo?.length} ${t(
            'wlVoucherAvailable',
          )}`}</Text>
        </HStack>
        <TouchableOpacity onPress={() => goToSearchVoucher()}>
          <HStack>
            <Text style={[Fonts.labelSemiBold, {color: Colors.secondaryMain}]}>
              {t('wlViewall')}
            </Text>
            <Spacer width={CustomSpacing(12)} />
            <VStack style={componentStyles.viewAllIcon}>
              <Icon name="arrow-forward" size={18} color={Colors.neutral10} />
            </VStack>
          </HStack>
        </TouchableOpacity>
      </HStack>
    );
  };

  const RenderPromo = ({item, index}) => {
    return (
      <VStack
        style={{
          marginVertical: CustomSpacing(4),
          marginHorizontal: CustomSpacing(4),
        }}>
        <VStack style={componentStyles.promoCard}>
          <VStack>
            <FastImage
              source={{uri: item.productspictures.path}}
              style={componentStyles.imgPromoIcon}
            />
          </VStack>
          <Spacer height={CustomSpacing(16)} />
          <Text numberOfLines={1} style={[Fonts.headlineM]}>
            {item.name}
          </Text>
          <HStack>
            <Text style={[Fonts.labelSemiBold]}>
              {Numbro.formatCurrency(item.productsprices.total)}
            </Text>
            <Spacer width={CustomSpacing(8)} />
            <VStack
              style={{
                alignSelf: 'flex-start',
              }}>
              <HStack>
                <Text
                  style={[
                    Fonts.captionS,
                    {
                      textDecorationLine: 'line-through',
                    },
                  ]}>
                  {Numbro.formatCurrency(item.productsprices.price)}
                </Text>
                <Icon name="local-offer" size={10} color={Colors.supportMain} />
              </HStack>
            </VStack>
          </HStack>
          {item.productsprices.discount_type === 1 ? (
            <VStack>
              <HStack style={componentStyles.discountCountainer}>
                <Icon name="local-offer" size={10} color={Colors.supportMain} />
                <Text
                  style={[
                    Fonts.captionSSemiBold,
                    {
                      textAlign: 'center',
                      color: Colors.supportMain,
                    },
                  ]}>
                  {`${item.productsprices.discount_price}% off`}
                </Text>
              </HStack>
            </VStack>
          ) : null}
          <VStack style={{width: CustomSpacing(388)}}>
            <Spacer height={CustomSpacing(12)} />
            <Button
              disabled={showOutOfRangeModal}
              onPress={async () => {
                checkMyCart(
                  item.merchants_id,
                  exploreStore.cartListData?.cart?.[0]?.merchants_id,
                  item.products_id,
                );
              }}
              label={t('lAdd')}
              type="primary"
              size="small"
            />
          </VStack>
        </VStack>
      </VStack>
    );
  };

  // console.log(JSON.stringify(exploreStore.cartListData, null, 2));

  const RenderSection = ({item, index}) => {
    const alreadyOnCart = exploreStore.cartListData?.cart.find(
      (cartItem) => cartItem.products_id === item.products_id,
    );
    const cartItemFilter = exploreStore.cartListData?.cart.filter(
      (cartItem, indexs) => {
        if (cartItem.products_id === item.products_id) {
          return exploreStore.cartListData.cart[indexs];
        }
      },
    );

    return (
      <HStack
        key={index}
        style={[
          {
            borderBottomWidth: 1,
          },
          componentStyles.renderSectionContainer,
        ]}>
        <FastImage
          source={{uri: item.productspictures?.path}}
          style={componentStyles.imgRenderSection}
        />
        <Spacer width={CustomSpacing(12)} />
        <VStack
          style={{
            width: dimensions.screenWidth - CustomSpacing(130),
          }}>
          <Text style={[Fonts.bodySemiBold]}>{item.name}</Text>
          <Text style={[Fonts.captionS]}>
            {item.rating !== null ? item.rating?.sold : 0} {t('wlSold')}{' '}
            {item.rating?.likes} {t('wlLikes')}
          </Text>
          <Spacer height={CustomSpacing(12)} />
          <HStack justifyContent="space-between">
            <Text style={[Fonts.bodySemiBold]}>
              {Numbro.formatCurrency(item.productsprices?.total)}
            </Text>
            {alreadyOnCart !== undefined &&
            cartItemFilter[0]?.productsprices?.quantity > 0 ? (
              <Button
                disabled={showOutOfRangeModal}
                onPress={async () => {
                  exploreStore.setCurrentCartVariant({
                    ...cartItemFilter[0],
                  });

                  // goToFoodDetail(item);

                  await exploreStore.getListProductCart(
                    cartItemFilter?.[0]?.id,
                  );
                  // console.log(
                  //   '1 =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
                  //   exploreStore.cartListLoading,
                  // );
                  if (
                    // exploreStore.listCartProductDataLoading == false &&
                    exploreStore.listCartProductDataLoading == false ||
                    exploreStore.listCartProductData?.length > 0
                  ) {
                    handlePresentModalPress();
                  }
                }}
                label={`${cartItemFilter[0]?.productsprices?.quantity} item`}
                type="primary"
                size="small"
              />
            ) : (
              <Button
                disabled={showOutOfRangeModal}
                onPress={() => {
                  checkMyCart(
                    item.merchants_id,
                    exploreStore.cartListData?.cart?.[0]?.merchants_id,
                    item.products_id,
                  );
                }}
                label={t('lAdd')}
                type="primary"
                size="small"
              />
            )}
          </HStack>
        </VStack>
      </HStack>
    );
  };

  const ActionBarComponent = () => {
    return (
      <Animated.View
        style={[componentStyles.actionBarParalaxContainer, actionBar]}>
        <VStack>
          {Platform.OS === 'ios' ? (
            <Spacer height={CustomSpacing(55)} />
          ) : (
            <Spacer height={CustomSpacing(24)} />
          )}
          <HStack justifyContent="space-between">
            <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
              <Icon name="arrow-back" size={20} color={Colors.neutral80} />
            </TouchableOpacity>
            <HStack>
              <TouchableOpacity activeOpacity={0.8} onPress={goToSearchFood}>
                <Icon name="search" size={20} color={Colors.neutral80} />
              </TouchableOpacity>
              <Spacer width={CustomSpacing(16)} />
              <TouchableOpacity activeOpacity={0.8} onPress={onShare}>
                <Icon name="share" size={20} color={Colors.neutral80} />
              </TouchableOpacity>
              <Spacer width={CustomSpacing(16)} />
              <TouchableOpacity activeOpacity={0.8}>
                <Icon name="info-outline" size={20} color={Colors.neutral80} />
              </TouchableOpacity>
            </HStack>
          </HStack>
          <Spacer height={CustomSpacing(16)} />
          <Text numberOfLines={1} style={[Fonts.titleMBold]}>
            {restaurantData.name}
          </Text>
        </VStack>
      </Animated.View>
    );
  };

  const MenuParalax = () => {
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom:
              Platform.OS === 'ios'
                ? -CustomSpacing(65)
                : -CustomSpacing(restaurantProduct?.length <= 1 ? -8 : -12),
            left: CustomSpacing(16),
          },
          menuBar,
        ]}>
        <VStack
          style={{
            width: dimensions.screenWidth - CustomSpacing(32),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {menuList ? (
            <Animated.View
              duration={500}
              easing="ease-out"
              animation={menuList ? 'bounceInUp' : 'bounceOutDown'}
              useNativeDriver
              style={componentStyles.menuListModal}>
              <Text
                style={[
                  Fonts.headlineL,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Restaurant Category Menu
              </Text>
              <Spacer height={CustomSpacing(24)} />
              <VStack>
                {restaurantProduct &&
                  restaurantProduct.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          goToCategoryList(
                            item.data?.[0]?.merchantscategorys_id,
                          )
                        }
                        activeOpacity={0.8}
                        key={`menulist-${index}`}>
                        <HStack
                          justifyContent="space-between"
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: Colors.neutral70,
                            paddingBottom: CustomSpacing(12),
                          }}>
                          <Text style={[Fonts.labelSemiBold]}>
                            {item.title}
                          </Text>
                          <Text style={[Fonts.label]}>
                            {item.data && item.data.length}
                          </Text>
                        </HStack>
                        <Spacer height={CustomSpacing(12)} />
                      </TouchableOpacity>
                    );
                  })}
              </VStack>
            </Animated.View>
          ) : null}
          <VStack style={[componentStyles.btnMenuParalax]}>
            <TouchableOpacity onPress={handleMenuList} activeOpacity={0.8}>
              <HStack justifyContent="center" alignItems="center">
                <Icon
                  name={menuList ? 'close' : 'menu-book'}
                  size={20}
                  color={Colors.neutral10}
                />
                <Spacer width={CustomSpacing(8)} />
                <Text
                  style={[
                    Fonts.subhead,
                    {
                      color: Colors.neutral10,
                    },
                  ]}>
                  {menuList ? 'Close' : t('Hmenu')}
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
          {exploreStore.cartListData !== null && (
            <>
              <Spacer height={CustomSpacing(16)} />
              <TouchableOpacity activeOpacity={0.8} onPress={handleCartModal}>
                <HStack style={componentStyles.btnCart}>
                  <VStack>
                    <Text style={[Fonts.captionSSemiBold]}>{`${
                      exploreStore.cartListData?.cart?.length
                    } ${t('wlItem')}`}</Text>
                    <Text style={[Fonts.captionS]}>
                      {exploreStore.cartListData?.merchant?.name}
                    </Text>
                  </VStack>
                  <HStack>
                    <Text style={[Fonts.bodySemiBold]}>
                      Rp{' '}
                      {Numbro.formatCurrency(
                        exploreStore.cartListData?.price.total,
                      )}
                    </Text>
                    <Spacer width={CustomSpacing(4)} />
                    <Icon
                      name="shopping-bag"
                      size={20}
                      color={Colors.neutral80}
                    />
                  </HStack>
                </HStack>
              </TouchableOpacity>
            </>
          )}
        </VStack>
      </Animated.View>
    );
  };

  const CartModal = () => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        containerStyle={{
          backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
        }}>
        <BottomSheetScrollView>
          <HStack style={componentStyles.headerCartModal}>
            <HStack>
              <Spacer width={CustomSpacing(16)} />
              <Text style={[Fonts.headlineL]}>{t('Hcart')}</Text>
            </HStack>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleSheetChanges(0);
              }}>
              <HStack>
                <Icon name="close" size={20} color={Colors.neutral80} />
                <Spacer width={CustomSpacing(16)} />
              </HStack>
            </TouchableOpacity>
          </HStack>
          <VStack
            style={{
              padding: CustomSpacing(16),
            }}>
            {exploreStore.cartListData !== null &&
              exploreStore.cartListData?.cart.map((item, index) => {
                const totalVariantPrice = item.variants.reduce(
                  (acc, variant) => {
                    return acc + variant.price;
                  },
                  0,
                );

                const totalPrice =
                  item.productsprices.total + totalVariantPrice;

                return (
                  <VStack
                    style={componentStyles.containerItem}
                    key={`cart-${index}`}>
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <HStack>
                        <VStack
                          style={{
                            alignSelf: 'flex-start',
                          }}>
                          <FastImage
                            source={{uri: item.productspictures.path}}
                            style={{
                              width: CustomSpacing(50),
                              height: CustomSpacing(50),
                            }}
                          />
                        </VStack>
                        <Spacer width={CustomSpacing(8)} />
                        <VStack>
                          <Text style={[Fonts.label]}>{item.name}</Text>
                          <Text
                            numberOfLines={1}
                            style={[
                              Fonts.captionM,
                              {
                                maxWidth: dimensions.screenWidth * 0.5,
                              },
                            ]}>
                            {item.productsdetails.description}
                          </Text>
                          <HStack>
                            <Icon
                              name="menu-book"
                              size={10}
                              color={Colors.neutral80}
                            />
                            <Spacer width={CustomSpacing(4)} />
                            <Text style={[Fonts.captionM]}>
                              {item.notes !== '' ? item.notes : t('pAddNotes')}
                            </Text>
                          </HStack>
                          {item.productsprices.discount_type !== 0 && (
                            <Text
                              style={{
                                textDecorationLine: 'line-through',
                                ...Fonts.subhead,
                                color: Colors.neutral60,
                              }}>
                              {Numbro.formatCurrency(item.productsprices.price)}
                            </Text>
                          )}
                          <Text style={[Fonts.bodySemiBold]}>
                            {Numbro.formatCurrency(totalPrice ?? 0)}
                          </Text>
                        </VStack>
                      </HStack>
                      <VStack
                        style={{
                          alignSelf: 'flex-start',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={async () => {
                            handleSheetChanges(0);
                            await exploreStore.getListProductCart(item?.id);
                            if (
                              exploreStore.listCartProductDataLoading == false
                            ) {
                              handleCustomizeProductModal();
                            }
                          }}>
                          <Text
                            style={[
                              Fonts.labelSemiBold,
                              {
                                color: Colors.secondaryMain,
                                textAlign: 'right',
                              },
                            ]}>
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <Spacer height={CustomSpacing(32)} />
                        <HStack style={componentStyles.qtyCartModal}>
                          {/* <TouchableOpacity
                            activeOpacity={0.8}
                            style={componentStyles.btnPlusCartModal}>
                            <IconFontAwesome
                              name="minus"
                              size={9}
                              color={Colors.neutral90}
                            />
                          </TouchableOpacity> */}
                          <Spacer width={CustomSpacing(14)} />
                          <Text style={[Fonts.bodySemiBold]}>
                            {`${item.productsprices.quantity} item`}
                          </Text>
                          <Spacer width={CustomSpacing(14)} />
                          {/* <TouchableOpacity
                            onPress={async () => {
                              var newCartsQty =
                                exploreStore.cartListData?.cart[index];
                              newCartsQty['quantity'] =
                                Number(newCartsQty?.productsprices?.quantity) +
                                1;
                              await exploreStore.updateCartList({
                                newCartsQty,
                              });
                            }}
                            labe
                            activeOpacity={0.8}
                            style={componentStyles.btnPlusCartModal}>
                            <IconFontAwesome
                              name="plus"
                              size={9}
                              color={Colors.neutral90}
                            />
                          </TouchableOpacity> */}
                        </HStack>
                      </VStack>
                    </HStack>
                  </VStack>
                );
              })}
          </VStack>
        </BottomSheetScrollView>
        <VStack padding={CustomSpacing(16)}>
          <Button
            onPress={() => {
              Smartlook.instance.analytics.trackEvent('checkout_food'),
                goToCheckout();
            }}
            label={`${t('lCheckout')} - Rp ${Numbro.formatCurrency(
              exploreStore.cartListData?.price.totalprice,
            )}`}
            type="primary"
          />
          {/* <Text>{JSON.stringify(exploreStore.cartListData?.price?)}</Text> */}
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
        </VStack>
      </BottomSheet>
    );
  };

  // const AddProductModal = () => {
  //   return (
  //     <BottomSheet
  //       ref={bottomSheetRef}
  //       index={1}
  //       snapPoints={snapPoints}
  //       onChange={handleSheetChanges}
  //       containerStyle={{
  //         backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
  //       }}>
  //       <BottomSheetScrollView>
  //         <HStack style={componentStyles.headerCartModal}>
  //           <HStack>
  //             <Spacer width={CustomSpacing(16)} />
  //             <Text style={[Fonts.headlineL]}>Add item</Text>
  //           </HStack>
  //           <TouchableOpacity
  //             activeOpacity={0.8}
  //             onPress={() => {
  //               handleSheetChanges(0);
  //             }}>
  //             <HStack>
  //               <Icon name="close" size={20} color={Colors.neutral80} />
  //               <Spacer width={CustomSpacing(16)} />
  //             </HStack>
  //           </TouchableOpacity>
  //         </HStack>
  //         <VStack
  //           style={{
  //             padding: CustomSpacing(16),
  //           }}>
  //           {exploreStore.cartListData !== null &&
  //             exploreStore.cartListData?.cart.map((item, index) => {
  //               const totalVariantPrice = item.variants.reduce(
  //                 (acc, variant) => {
  //                   return acc + variant.price;
  //                 },
  //                 0,
  //               );

  //               const totalPrice =
  //                 item.productsprices.total + totalVariantPrice;

  //               return (
  //                 <VStack
  //                   style={componentStyles.containerItem}
  //                   key={`cart-${index}`}>
  //                   <HStack
  //                     style={{
  //                       justifyContent: 'space-between',
  //                     }}>
  //                     <HStack>
  //                       <VStack
  //                         style={{
  //                           alignSelf: 'flex-start',
  //                         }}>
  //                         <FastImage
  //                           source={{uri: item.productspictures.path}}
  //                           style={{
  //                             width: CustomSpacing(50),
  //                             height: CustomSpacing(50),
  //                           }}
  //                         />
  //                       </VStack>
  //                       <Spacer width={CustomSpacing(8)} />
  //                       <VStack>
  //                         <Text style={[Fonts.label]}>{item.name}</Text>
  //                         <Text
  //                           numberOfLines={1}
  //                           style={[
  //                             Fonts.captionM,
  //                             {
  //                               maxWidth: dimensions.screenWidth * 0.5,
  //                             },
  //                           ]}>
  //                           {item.productsdetails.description}
  //                         </Text>
  //                         <HStack>
  //                           <Icon
  //                             name="menu-book"
  //                             size={10}
  //                             color={Colors.neutral80}
  //                           />
  //                           <Spacer width={CustomSpacing(4)} />
  //                           <Text style={[Fonts.captionM]}>
  //                             {item.notes !== ''
  //                               ? item.notes
  //                               : t('pAddNotes')}
  //                           </Text>
  //                         </HStack>
  //                         {item.productsprices.discount_type !== 0 && (
  //                           <Text
  //                             style={{
  //                               textDecorationLine: 'line-through',
  //                               ...Fonts.subhead,
  //                               color: Colors.neutral60,
  //                             }}>
  //                             {Numbro.formatCurrency(item.productsprices.price)}
  //                           </Text>
  //                         )}
  //                         <Text style={[Fonts.bodySemiBold]}>
  //                           {Numbro.formatCurrency(totalPrice ?? 0)}
  //                         </Text>
  //                       </VStack>
  //                     </HStack>
  //                     <VStack
  //                       style={{
  //                         alignSelf: 'flex-start',
  //                       }}>
  //                       <TouchableOpacity
  //                         activeOpacity={0.8}
  //                         onPress={() => {
  //                           handleSheetChanges(0);
  //                           console.log('itemsss', item);
  //                           goToFoodDetail(
  //                             item?.productsdetails?.products_id,
  //                             true,
  //                           );
  //                         }}>
  //                         <Text
  //                           style={[
  //                             Fonts.labelSemiBold,
  //                             {
  //                               color: Colors.secondaryMain,
  //                               textAlign: 'right',
  //                             },
  //                           ]}>
  //                           Edit
  //                         </Text>
  //                       </TouchableOpacity>
  //                       <Spacer height={CustomSpacing(32)} />
  //                       <HStack>
  //                         <TouchableOpacity
  //                           onPress={() => {
  //                             // exploreStore.setCurrentCartVariant({
  //                             //   ...cartItemFilter[0],
  //                             // });
  //                             console.log(cartItemFilter);
  //                             // goToFoodDetail(item);
  //                             // handleAddProductModal();
  //                           }}
  //                           activeOpacity={0.8}
  //                           style={componentStyles.btnPlusCartModal}>
  //                           <IconFontAwesome
  //                             name="minus"
  //                             size={9}
  //                             color={Colors.neutral90}
  //                           />
  //                         </TouchableOpacity>
  //                         <Spacer width={CustomSpacing(14)} />
  //                         <Text style={[Fonts.bodySemiBold]}>
  //                           {item.productsprices.quantity}
  //                         </Text>
  //                         <Spacer width={CustomSpacing(14)} />
  //                         <TouchableOpacity
  //                           onPress={() => {
  //                             exploreStore.setCurrentCartVariant({
  //                               ...item,
  //                             });
  //                             console.log('itemModal', item);
  //                             // goToFoodDetail(item);
  //                             handleAddProductModal();
  //                           }}
  //                           activeOpacity={0.8}
  //                           style={componentStyles.btnPlusCartModal}>
  //                           <IconFontAwesome
  //                             name="plus"
  //                             size={9}
  //                             color={Colors.neutral90}
  //                           />
  //                         </TouchableOpacity>
  //                       </HStack>
  //                     </VStack>
  //                   </HStack>
  //                 </VStack>
  //               );
  //             })}
  //         </VStack>
  //       </BottomSheetScrollView>
  //       <VStack padding={CustomSpacing(16)}>
  //         <Button
  //           onPress={() => goToFoodDetail()}
  //           label="Customize another"
  //           type="primary"
  //         />
  //         {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
  //       </VStack>
  //     </BottomSheet>
  //   );
  // };

  // const Menus = () => {
  //   return (
  //     <BottomSheetModalProvider>
  //       <BottomSheetModal
  //         ref={bottomSheetRef}
  //         index={1}
  //         snapPoints={snapPoints}
  //         onChange={handleSheetChangesCustomize}
  //         containerStyle={{
  //           backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
  //         }}>
  //         <BottomSheetScrollView>
  //           <HStack style={componentStyles.headerCartModal}>
  //             <HStack>
  //               <Spacer width={CustomSpacing(16)} />
  //               <Text style={[Fonts.headlineL]}>
  //                 {exploreStore.listCartProductData?.cart[0]?.name
  //                   ? exploreStore.listCartProductData?.cart[0]?.name
  //                   : ''}
  //               </Text>
  //             </HStack>
  //             <TouchableOpacity
  //               activeOpacity={0.8}
  //               onPress={() => {
  //                 handleCloseModalPress();
  //               }}>
  //               <HStack>
  //                 <Icon name="close" size={20} color={Colors.neutral80} />
  //                 <Spacer width={CustomSpacing(16)} />
  //               </HStack>
  //             </TouchableOpacity>
  //           </HStack>
  //           <VStack
  //             style={{
  //               padding: CustomSpacing(16),
  //             }}>
  //             {exploreStore.listCartProductData !== null &&
  //               exploreStore.listCartProductData?.cart.map((item, index) => {
  //                 const totalVariantPrice = item.variants.reduce(
  //                   (acc, variant) => {
  //                     return acc + variant.price;
  //                   },
  //                   0,
  //                 );
  //                 // console.log(
  //                 //   'length =>>>>>>>>>>>>',
  //                 //   exploreStore.listCartProductData?.cart[index],
  //                 // );
  //                 const totalPrice =
  //                   item.productsprices.total + totalVariantPrice;
  //                 const productQty = item?.productsprices?.quantity;
  //                 return (
  //                   <VStack>
  //                     <ScrollView
  //                       style={componentStyles.containerItem}
  //                       key={`cart-${index}`}>
  //                       <HStack
  //                         style={{
  //                           justifyContent: 'space-between',
  //                         }}>
  //                         <HStack>
  //                           <VStack
  //                             style={{
  //                               alignSelf: 'flex-start',
  //                             }}>
  //                             <FastImage
  //                               source={{uri: item.productspictures.path}}
  //                               style={{
  //                                 width: CustomSpacing(50),
  //                                 height: CustomSpacing(50),
  //                               }}
  //                             />
  //                           </VStack>
  //                           <Spacer width={CustomSpacing(8)} />
  //                           <VStack>
  //                             <Text style={[Fonts.label]}>{item.name}</Text>
  //                             <Text
  //                               numberOfLines={1}
  //                               style={[
  //                                 Fonts.captionM,
  //                                 {
  //                                   maxWidth: dimensions.screenWidth * 0.5,
  //                                 },
  //                               ]}>
  //                               {item.productsdetails.description}
  //                             </Text>
  //                             <HStack>
  //                               <Icon
  //                                 name="menu-book"
  //                                 size={10}
  //                                 color={Colors.neutral80}
  //                               />
  //                               <Spacer width={CustomSpacing(4)} />
  //                               <Text style={[Fonts.captionM]}>
  //                                 {item.notes !== ''
  //                                   ? item.notes
  //                                   : t('pAddNotes')}
  //                               </Text>
  //                             </HStack>
  //                             {item.productsprices.discount_type !== 0 && (
  //                               <Text
  //                                 style={{
  //                                   textDecorationLine: 'line-through',
  //                                   ...Fonts.subhead,
  //                                   color: Colors.neutral60,
  //                                 }}>
  //                                 {Numbro.formatCurrency(
  //                                   item.productsprices.price,
  //                                 )}
  //                               </Text>
  //                             )}
  //                             <Text style={[Fonts.bodySemiBold]}>
  //                               {Numbro.formatCurrency(totalPrice ?? 0)}
  //                             </Text>
  //                           </VStack>
  //                         </HStack>
  //                         <VStack
  //                           style={{
  //                             alignSelf: 'flex-start',
  //                           }}>
  //                           <TouchableOpacity
  //                             activeOpacity={0.8}
  //                             onPress={() => {
  //                               handleCloseModalPress();
  //                               exploreStore.setIdVarians(item?.['_id']);
  //                               goToFoodDetail(
  //                                 item?.productsdetails?.products_id,
  //                                 true,
  //                               );
  //                               console.log(
  //                                 'item=>>>>',
  //                                 item?.productsdetails?.products_id,
  //                               );
  //                             }}>
  //                             <Text
  //                               style={[
  //                                 Fonts.labelSemiBold,
  //                                 {
  //                                   color: Colors.secondaryMain,
  //                                   textAlign: 'right',
  //                                 },
  //                               ]}>
  //                               Edit
  //                             </Text>
  //                           </TouchableOpacity>
  //                           <Spacer height={CustomSpacing(32)} />
  //                           <HStack>
  //                             <TouchableOpacity
  //                               onPress={async () => {
  //                                 var newCartsQty = item;
  //                                 console.log(
  //                                   'QTY=>>>>>>>',
  //                                   exploreStore.cartListData?.cart[index],
  //                                   item.productsprices.quantity,
  //                                 );
  //                                 if (item.productsprices.quantity == 1) {
  //                                   await exploreStore.dellartListProducts(
  //                                     newCartsQty['_id'],
  //                                   );
  //                                   await exploreStore.getCartList();
  //                                   setToogelRender(!tooggleRender);
  //                                   handleCloseModalPress();
  //                                 } else {
  //                                   newCartsQty['quantity'] =
  //                                     Number(
  //                                       newCartsQty?.productsprices?.quantity,
  //                                     ) - 1;
  //                                   await exploreStore.updateCartList({
  //                                     newCartsQty,
  //                                   });
  //                                   await exploreStore.getCartList();

  //                                   setToogelRender(!tooggleRender);
  //                                   handleCloseModalPress();
  //                                 }
  //                               }}
  //                               activeOpacity={0.8}
  //                               style={componentStyles.btnPlusCartModal}>
  //                               <IconFontAwesome
  //                                 name="minus"
  //                                 size={9}
  //                                 color={Colors.neutral90}
  //                               />
  //                             </TouchableOpacity>
  //                             <Spacer width={CustomSpacing(14)} />
  //                             <Text style={[Fonts.bodySemiBold]}>
  //                               {item.productsprices.quantity}
  //                             </Text>
  //                             <Spacer width={CustomSpacing(14)} />
  //                             <TouchableOpacity
  //                               onPress={async () => {
  //                                 var newCartsQty = item;
  //                                 newCartsQty['quantity'] =
  //                                   Number(
  //                                     newCartsQty?.productsprices?.quantity,
  //                                   ) + 1;

  //                                 await exploreStore.updateCartList({
  //                                   newCartsQty,
  //                                 });

  //                                 await exploreStore.getCartList();

  //                                 setToogelRender(!tooggleRender);
  //                                 handleCloseModalPress();
  //                               }}
  //                               activeOpacity={0.8}
  //                               style={componentStyles.btnPlusCartModal}>
  //                               <IconFontAwesome
  //                                 name="plus"
  //                                 size={9}
  //                                 color={Colors.neutral90}
  //                               />
  //                             </TouchableOpacity>
  //                           </HStack>
  //                         </VStack>
  //                       </HStack>
  //                     </ScrollView>
  //                     <Spacer height={CustomSpacing(24)} />
  //                     {index ==
  //                       exploreStore.listCartProductData?.cart?.length - 1 && (
  //                       <VStack padding={CustomSpacing(16)}>
  //                         <Button
  //                           onPress={() =>
  //                             goToFoodDetail(item?.productsdetails?.products_id)
  //                           }
  //                           label="Customize another"
  //                           type="primary"
  //                         />
  //                         {Platform.OS === 'ios' && (
  //                           <Spacer height={CustomSpacing(24)} />
  //                         )}
  //                       </VStack>
  //                     )}
  //                   </VStack>
  //                 );
  //               })}
  //           </VStack>
  //         </BottomSheetScrollView>
  //         {/* <VStack padding={CustomSpacing(16)}>
  //           <Button
  //             onPress={() =>
  //               goToFoodDetail(exploreStore.listCartProductData?.cart[0])
  //             }
  //             label="Customize another"
  //             type="primary"
  //           />
  //           {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
  //         </VStack> */}
  //       </BottomSheetModal>
  //     </BottomSheetModalProvider>
  //   );
  // };

  const Customizeanother = () => {
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChangesCustomize}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
          }}>
          <BottomSheetScrollView>
            <HStack style={componentStyles.headerCartModal}>
              <HStack>
                <Spacer width={CustomSpacing(16)} />
                <Text style={[Fonts.headlineL]}>
                  {exploreStore.listCartProductData?.cart[0]?.name
                    ? exploreStore.listCartProductData?.cart[0]?.name
                    : ''}
                </Text>
              </HStack>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  handleCloseModalPress();
                }}>
                <HStack>
                  <Icon name="close" size={20} color={Colors.neutral80} />
                  <Spacer width={CustomSpacing(16)} />
                </HStack>
              </TouchableOpacity>
            </HStack>
            <VStack
              style={{
                padding: CustomSpacing(16),
              }}>
              {exploreStore.listCartProductData !== null &&
                exploreStore.listCartProductData?.cart.map((item, index) => {
                  const totalVariantPrice = item.variants.reduce(
                    (acc, variant) => {
                      return acc + variant.price;
                    },
                    0,
                  );

                  const totalPrice =
                    item.productsprices.total + totalVariantPrice;
                  const productQty = item?.productsprices?.quantity;
                  return (
                    <VStack>
                      <ScrollView
                        style={componentStyles.containerItem}
                        key={`cart-${index}`}>
                        <HStack
                          style={{
                            justifyContent: 'space-between',
                          }}>
                          <HStack>
                            <VStack
                              style={{
                                alignSelf: 'flex-start',
                              }}>
                              <FastImage
                                source={{uri: item.productspictures.path}}
                                style={{
                                  width: CustomSpacing(50),
                                  height: CustomSpacing(50),
                                }}
                              />
                            </VStack>
                            <Spacer width={CustomSpacing(8)} />
                            <VStack>
                              <Text style={[Fonts.label]}>{item.name}</Text>
                              <Text
                                numberOfLines={1}
                                style={[
                                  Fonts.captionM,
                                  {
                                    maxWidth: dimensions.screenWidth * 0.5,
                                  },
                                ]}>
                                {item.productsdetails.description}
                              </Text>
                              <HStack>
                                <Icon
                                  name="menu-book"
                                  size={10}
                                  color={Colors.neutral80}
                                />
                                <Spacer width={CustomSpacing(4)} />
                                <Text style={[Fonts.captionM]}>
                                  {item.notes !== ''
                                    ? item.notes
                                    : t('pAddNotes')}
                                </Text>
                              </HStack>
                              {item.productsprices.discount_type !== 0 && (
                                <Text
                                  style={{
                                    textDecorationLine: 'line-through',
                                    ...Fonts.subhead,
                                    color: Colors.neutral60,
                                  }}>
                                  {Numbro.formatCurrency(
                                    item.productsprices.price,
                                  )}
                                </Text>
                              )}
                              <Text style={[Fonts.bodySemiBold]}>
                                {Numbro.formatCurrency(totalPrice ?? 0)}
                              </Text>
                            </VStack>
                          </HStack>
                          <VStack
                            style={{
                              alignSelf: 'flex-start',
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => {
                                handleCloseModalPress();
                                exploreStore.setIdVarians(item?.['_id']);
                                goToFoodDetail(
                                  item?.productsdetails?.products_id,
                                  true,
                                );
                              }}>
                              <Text
                                style={[
                                  Fonts.labelSemiBold,
                                  {
                                    color: Colors.secondaryMain,
                                    textAlign: 'right',
                                  },
                                ]}>
                                Edit
                              </Text>
                            </TouchableOpacity>
                            <Spacer height={CustomSpacing(32)} />
                            <HStack>
                              <TouchableOpacity
                                onPress={async () => {
                                  var newCartsQty = item;

                                  if (item.productsprices.quantity == 1) {
                                    await exploreStore.dellartListProducts(
                                      newCartsQty['_id'],
                                    );
                                    await exploreStore.getCartList();
                                    setToogelRender(!tooggleRender);
                                    handleCloseModalPress();
                                  } else {
                                    newCartsQty['quantity'] =
                                      Number(
                                        newCartsQty?.productsprices?.quantity,
                                      ) - 1;
                                    await exploreStore.updateCartList({
                                      newCartsQty,
                                    });
                                    await exploreStore.getCartList();

                                    setToogelRender(!tooggleRender);
                                    handleCloseModalPress();
                                  }
                                }}
                                activeOpacity={0.8}
                                style={componentStyles.btnPlusCartModal}>
                                <IconFontAwesome
                                  name="minus"
                                  size={9}
                                  color={Colors.neutral90}
                                />
                              </TouchableOpacity>
                              <Spacer width={CustomSpacing(14)} />
                              <Text style={[Fonts.bodySemiBold]}>
                                {item.productsprices.quantity}
                              </Text>
                              <Spacer width={CustomSpacing(14)} />
                              <TouchableOpacity
                                onPress={async () => {
                                  var newCartsQty = item;
                                  newCartsQty['quantity'] =
                                    Number(
                                      newCartsQty?.productsprices?.quantity,
                                    ) + 1;

                                  await exploreStore.updateCartList({
                                    newCartsQty,
                                  });

                                  await exploreStore.getCartList();

                                  setToogelRender(!tooggleRender);
                                  handleCloseModalPress();
                                }}
                                activeOpacity={0.8}
                                style={componentStyles.btnPlusCartModal}>
                                <IconFontAwesome
                                  name="plus"
                                  size={9}
                                  color={Colors.neutral90}
                                />
                              </TouchableOpacity>
                            </HStack>
                          </VStack>
                        </HStack>
                      </ScrollView>
                      <Spacer height={CustomSpacing(24)} />
                      {index ==
                        exploreStore.listCartProductData?.cart?.length - 1 && (
                        <VStack padding={CustomSpacing(16)}>
                          <Button
                            onPress={() =>
                              goToFoodDetail(item?.productsdetails?.products_id)
                            }
                            label="Customize another"
                            type="primary"
                          />
                          {Platform.OS === 'ios' && (
                            <Spacer height={CustomSpacing(24)} />
                          )}
                        </VStack>
                      )}
                    </VStack>
                  );
                })}
            </VStack>
          </BottomSheetScrollView>
          {/* <VStack padding={CustomSpacing(16)}>
            <Button
              onPress={() =>
                goToFoodDetail(exploreStore.listCartProductData?.cart[0])
              }
              label="Customize another"
              type="primary"
            />
            {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
          </VStack> */}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  };

  // const ClosedTime = (data) => {
  //   const headerData = data.data;
  //   const merchantOpenAt = headerData.days.data;
  //   const dateNow = moment(new Date()).format('dddd');
  //   const merchantDate = merchantOpenAt?.find((a) => a.name == dateNow);

  //   return (
  //     <Modal
  //       animationType="slide"
  //       transparent={true}
  //       visible={closed}
  //       ref={closeRestaurantModal}
  //       // onRequestClose={() => {
  //       //   Alert.alert('Modal has been closed.');
  //       //   setClosed(!closed);
  //       // }}
  //     >
  //       <TouchableOpacity
  //         style={componentStyles.centeredView}
  //         onPress={() => {
  //           // setClosed(!closed);
  //           goBack();
  //         }}>
  //         <VStack style={componentStyles.centeredView}>
  //           <HStack style={componentStyles.modalText}>
  //             <Text style={[Fonts.subhead, {color: Colors.neutral10}]}>
  //               {`${t('wlClosed')} ${t('wlOpenAt')} ${merchantDate?.start}`}
  //             </Text>
  //           </HStack>
  //         </VStack>
  //       </TouchableOpacity>
  //     </Modal>
  //   );
  // };

  const ModalColsedRestaurant = ({data: headerData}) => {
    const merchantOpenAt = headerData.days.data;
    const dateNow = moment().format('dddd');
    const merchantDate = merchantOpenAt?.find((a) => a.name == dateNow);

    return (
      <>
        <View style={componentStyles.backgroundModal} />
        <TouchableOpacity style={componentStyles.buttonModal} onPress={goBack}>
          <Text style={componentStyles.textButtonModal}>
            {`${t('wlClosed')} ${t('wlOpenAt')} ${merchantDate?.start}`}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const OutOfRangeComponent = () => {
    return (
      <BottomSheet
        enablePanDownToClose={false}
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPointsOutOfRange}
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
            source={OutOfRange}
            style={{
              width: CustomSpacing(120),
              height: CustomSpacing(120),
            }}
          />
          <Spacer height={CustomSpacing(20)} />
          <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
            Di luar lokasi anda
          </Text>
          <Spacer height={CustomSpacing(10)} />
          <Text style={[Fonts.label, {textAlign: 'center'}]}>
            Restauran ini terlalu jauh dari lokasi anda, kami sarankan untuk
            memesan dari restauran di sekitar.
          </Text>
          <Spacer height={CustomSpacing(20)} />
          <Button
            label="Lihat Sekitar"
            type="primary"
            onPress={async () => {
              await exploreStore.setCurrentLocationAddress(null, null, '', '');
              await handleSheetChanges(0);
              await routerStore.setMyMenu('Explore');
              await navigation.navigate('Explore');
            }}
          />
        </VStack>
      </BottomSheet>
    );
  };

  const ChangeRestaurantComponent = () => {
    return (
      <BottomSheet
        ref={bottomSheetRefChangeRestaurant}
        index={1}
        snapPoints={snapPointsChangeRestaurant}
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
            source={ChangeResto}
            style={{
              width: CustomSpacing(120),
              height: CustomSpacing(120),
            }}
          />
          <Spacer height={CustomSpacing(20)} />
          <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
            Do you want to change resto?
          </Text>
          <Spacer height={CustomSpacing(10)} />
          <Text style={[Fonts.label, {textAlign: 'center'}]}>
            If you want to change resto, we need to clear your previous cart
            first.
          </Text>
          <Spacer height={CustomSpacing(20)} />
          <HStack
            style={{
              alignItems: 'flex-start',
            }}>
            <Button
              style={{maxWidth: CustomSpacing(150)}}
              label="Cancle"
              type="primary"
              onPress={() => {
                handleSheetChanges(0);
              }}
            />
            <Spacer width={CustomSpacing(20)} />
            <Button
              style={{maxWidth: CustomSpacing(150)}}
              label="Yes, Delete"
              type="primary"
              onPress={() => {
                handleSheetChanges(0);
                goToFoodDetail(productID);
              }}
            />
          </HStack>
        </VStack>
      </BottomSheet>
    );
  };

  return (
    <VStack style={componentStyles.restaurantContainer}>
      {restaurantData !== null ? (
        <VStack>
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            showsVerticalScrollIndicator={false}>
            <VStack>
              {/* Profile Picture */}
              <FastImage
                source={{uri: restaurantData?.pictures[1].path}}
                style={componentStyles.imgProfileBg}
              />
              {/* Navigator */}
              <Navigator />
            </VStack>
            <VStack>
              {/* Header */}
              <HeaderContainer data={restaurantData} />
              <Spacer height={dimensions.screenWidth * 0.43} />
              {restaurantData.description &&
                restaurantData.description?.length > 50 && (
                  <Spacer height={CustomSpacing(90)} />
                )}
              {restaurantData.name && restaurantData.name?.length > 15 && (
                <Spacer height={CustomSpacing(20)} />
              )}
              <Spacer height={CustomSpacing(16)} />
              <VStack style={componentStyles.contentContainer}>
                {/* Voucher */}
                {resturantPromo?.length > 0 && (
                  <VStack>
                    <Voucher />
                    <Spacer height={CustomSpacing(16)} />
                  </VStack>
                )}
                {/* Promo Item */}
                <VStack>
                  {productPromo?.length > 0 && (
                    <VStack>
                      <VStack style={componentStyles.titlePromo}>
                        <Text style={[Fonts.headlineL]}>
                          {t('wlPromoItem')}
                        </Text>
                      </VStack>
                      <Spacer height={CustomSpacing(16)} />
                      <FlatList
                        data={productPromo}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={RenderPromo}
                        keyExtractor={(item, index) =>
                          `promo-${index.toString()}`
                        }
                        maxToRenderPerBatch={5}
                        updateCellsBatchingPeriod={100}
                        initialNumToRender={5}
                        windowSize={10}
                      />
                      <Spacer height={CustomSpacing(16)} />
                    </VStack>
                  )}
                  {/* Menu */}
                  {/* <FlatList
                    data={restaurantProduct}
                    showsHorizontalScrollIndicator={false}
                    renderItem={RenderSection}
                    renderSectionHeader={({section}) => (
                      <VStack>
                        <VStack style={componentStyles.titlePromo}>
                          <Text style={[Fonts.headlineL]}>{section.title}</Text>
                        </VStack>
                        <Spacer height={CustomSpacing(16)} />
                      </VStack>
                    )}
                    keyExtractor={(item, index) => index}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={100}
                    initialNumToRender={5}
                    windowSize={10}
                  /> */}
                  {restaurantProduct?.length > 0 && (
                    <SectionList
                      sections={restaurantProduct ? restaurantProduct : []}
                      renderItem={RenderSection}
                      renderSectionHeader={({section}) => (
                        <VStack>
                          <VStack style={componentStyles.titlePromo}>
                            <Text style={[Fonts.headlineL]}>
                              {section?.title ? section?.title : ''}
                            </Text>
                          </VStack>
                          <Spacer height={CustomSpacing(16)} />
                        </VStack>
                      )}
                      keyExtractor={(item, index) => index}
                      stickySectionHeadersEnabled
                      maxToRenderPerBatch={5}
                      updateCellsBatchingPeriod={100}
                      initialNumToRender={5}
                      windowSize={10}
                    />
                  )}

                  {/* <Spacer height={18} /> */}
                  {Platform.OS === 'ios' ? (
                    <Spacer height={dimensions.screenWidth * 0.5} />
                  ) : (
                    <Spacer height={showCartModal ? 256 : 18} />
                  )}
                </VStack>
              </VStack>
            </VStack>
            {Platform.OS === 'ios' ? (
              <Spacer height={dimensions.screenWidth * 0.5} />
            ) : (
              <Spacer
                height={CustomSpacing(
                  restaurantProduct?.length <= 1 ? 108 : 63,
                )}
              />
            )}
          </Animated.ScrollView>
          {showCartModal ? (
            <CartModal />
          ) : showOutOfRangeModal ? (
            <OutOfRangeComponent />
          ) : showChangeRestoModal ? (
            <ChangeRestaurantComponent />
          ) : (
            <MenuParalax />
          )}

          {closed ? <ModalColsedRestaurant data={restaurantData} /> : null}

          {/* {<ClosedTime data={restaurantData} />} */}
          {/* {addProductModal && <AddProductModal />} */}

          {<Customizeanother />}

          <ActionBarComponent />
        </VStack>
      ) : (
        <>
          <Spacer height={dimensions.screenWidth * 0.8} />
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

export default RestaurantPage;
