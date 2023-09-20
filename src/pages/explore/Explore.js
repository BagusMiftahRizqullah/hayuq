import React, {
  useRef,
  useMemo,
  Suspense,
  useEffect,
  useCallback,
  useState,
} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  RefreshControl,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  AppState,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button, LoginValidModal} from '@components';
import {dimensions} from '@config/Platform.config';
import {
  LocationIcon,
  FavouriteIcon,
  ChevronDownIcon,
  SearchOutlineIcon,
  PayyuqBg,
  HoursIcon,
  AllCuisineIcon,
  BestSellerIcon,
  FastFoodIcon,
  HealtyFoodIcon,
  NearMeIcon,
  NewRestaurantIcon,
  PromoIcon,
  BackToTop,
  MorningBG,
  AfternoonBG,
  NightBG,
  RainBG,
  BackGreyIcon,
  Getlost,
  Otw,
} from '@assets';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import Geolocation from 'react-native-geolocation-service';
import {Payyuq, Banner} from './components';
import CONFIG from '@config';
import ContentLoader, {Rect} from 'react-content-loader/native';
import BackgroundTimer from 'react-native-background-timer';

const RecomendedList = React.lazy(() => import('./components/RecomendedList'));
const OrderWithVoucher = React.lazy(() =>
  import('./components/OrderWithVoucher'),
);
const Reorder = React.lazy(() => import('./components/Reorder'));
const MostLiked = React.lazy(() => import('./components/MostLiked'));
const Popular = React.lazy(() => import('./components/Popular'));
const TopRated = React.lazy(() => import('./components/TopRated'));
const RateOrder = React.lazy(() => import('./components/RateOrder'));
const BannerH = React.lazy(() => import('./components/BannerH'));

import styles from './Explore.style';

const Explore = observer((props) => {
  const {t, i18n} = useTranslation();
  const {exploreStore, authStore, accountStore, routerStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const scrollRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalBanner, setIsModalBanner] = useState(false);
  const [bannerDatas, setBannerDatas] = useState(null);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      const handleBack = () => {
        goBack();

        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBack);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }, []),
  );
  const handleShowLoginValidModal = () => {
    authStore.setIsToken(null);
  };
  const handleNotify = () => {
    exploreStore.setNotifyStatus(true);
  };
  const appState = useRef(AppState.currentState);
  var interval;

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      //clearInterval when your app has come back to the foreground
      BackgroundTimer.clearInterval(interval);
    } else {
      //app goes to background
      console.log('app goes to background');
      //tell the server that your app is still online when your app detect that it goes to background
      interval = BackgroundTimer.setInterval(async () => {
        // console.log('connection status ', CONFIG.portSocket.connected);
        const USER_ID = await AsyncStorage.getItem('USER_ID');
        console.log('daftar ID', USER_ID),
          CONFIG.portSocket.emit('data', {
            users_id: USER_ID,
          });
      }, 5000);
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          console.log('IOS GRANTED LOCATION');
          setPermissionLocationStatus(true);
          return true;
        } else {
          console.log('IOS NOT GRANTED LOCATION');
          setPermissionLocationStatus(false);
          return false;
        }
      } catch (err) {
        console.log('Permission error', err);
        return false;
      }
    } else {
      try {
        // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message:
              'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          console.log('ANDROID GRANTED LOCATION');
          setPermissionLocationStatus(true);
          return true;
        } else {
          console.log('ANDROID NOT GRANTED LOCATION');
          setPermissionLocationStatus(false);
          return false;
        }
      } catch (err) {
        console.log('Permission error', err);
        return false;
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    exploreStore.getExploreList(10);
    accountStore.getDetailsAccount();
    exploreStore.getAddressList();
    exploreStore.getHistoryList();
    exploreStore.getAccountDetail();
    exploreStore.getCartList();
    exploreStore.getListFavorite();
    exploreStore.getExploreMostLikeList(12);
    exploreStore.getExplorePromo(2);
    exploreStore.getExplorePopulars(13);
    exploreStore.getExploreHayuqers(14);
    exploreStore.getExploreReorder(11);
    exploreStore.getCousinesData(3);
    exploreStore.getHistoryTopUpData();
    exploreStore.getBannerData(routerStore.defaultLanguage, 1);
    // exploreStore.getBannerData(routerStore.defaultLanguage, 2);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (exploreStore.bannerDataPotrait !== null) {
      setBannerDatas(exploreStore.bannerDataPotrait);
    } else {
      setBannerDatas([]);
    }
  }, [exploreStore.bannerDataPotrait]);

  const defaultAddress = useMemo(
    () => exploreStore.currentDeliveryAddress.header,
    [exploreStore.currentDeliveryAddress],
  );

  const isVerified = useMemo(
    () => exploreStore.accountDetailData?.users.status,
    [exploreStore?.accountDetailData],
  );

  const requestVerifyEmail = () => {
    exploreStore.requestVerifyEmail(exploreStore.accountDetailData.users.email);
    navigation.navigate('OtpVerify');
  };

  const goToDeliveryAddress = () => {
    navigation.navigate('DeliveryAddress');
  };

  const gotToFavourite = async () => {
    (await CekUserToken()) ? navigation.navigate('Favourite') : null;
  };

  const goToSearchBar = async () => {
    (await CekUserToken())
      ? navigation.navigate('SearchBar')
      : Keyboard.dismiss();
  };
  const goBack = () => {
    routerStore.setMyMenu('Home');
    navigation.navigate('Home');
  };

  const goToExploreMenuDetail = async (title) => {
    if (title === 'All Cuisines') {
      exploreStore.setRouterFilter(title, 'cuisine');
      (await CekUserToken()) ? navigation.navigate('ExploreMenuDetail') : null;
    } else {
      exploreStore.setRouterFilter(title, 'normal');
      (await CekUserToken()) ? navigation.navigate('ExploreMenuDetail') : null;
    }
  };

  const menuData = [
    {
      id: 1,
      title: t('nearMe'),
      icon: NearMeIcon,
    },
    {
      id: 2,
      title: t('promo'),
      icon: PromoIcon,
    },
    {
      id: 3,
      title: t('bestSeller'),
      icon: BestSellerIcon,
    },
    {
      id: 4,
      title: t('fastFood'),
      icon: FastFoodIcon,
    },
    {
      id: 5,
      title: t('fullTimeHours'),
      icon: HoursIcon,
    },
    {
      id: 6,
      title: t('newResto'),
      icon: NewRestaurantIcon,
    },
    {
      id: 7,
      title: t('healtyFood'),
      icon: HealtyFoodIcon,
    },
    {
      id: 8,
      title: t('allCuisine'),
      icon: AllCuisineIcon,
    },
  ];

  const backToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(async () => {
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    console.log('daftar ID', USER_ID),
      CONFIG.portSocket.emit('data', {
        users_id: USER_ID,
      });
    CONFIG.portSocket.on('data', (data) => {
      console.log('REGISTER USER SOCKET', data);
    });
  }, []);

  useEffect(() => {
    requestLocationPermission();

    if (
      exploreStore.currentDeliveryAddress.lat &&
      exploreStore.currentDeliveryAddress.lng
    ) {
      exploreStore.getExploreList(10);
      accountStore.getDetailsAccount();
      exploreStore.getAddressList();
      exploreStore.getHistoryList();
      exploreStore.getAccountDetail();
      exploreStore.getCartList();
      exploreStore.getListFavorite();
      exploreStore.getExploreMostLikeList(12);
      exploreStore.getExplorePromo(2);
      exploreStore.getExplorePopulars(13);
      exploreStore.getExploreHayuqers(14);
      exploreStore.getExploreReorder(11);
      exploreStore.getCousinesData(3);
      exploreStore.getHistoryTopUpData();
      exploreStore.getBannerData(routerStore.defaultLanguage, 1);
    }
  }, [exploreStore.currentDeliveryAddress]);

  const CekUserToken = async () => {
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    if (TOKEN !== null) {
      authStore.setIsToken('IS_TOKEN');
      return true;
    } else {
      authStore.setIsToken('NO_TOKEN');
      return false;
    }
  };

  const LoadingSuspense = ({title}) => {
    return (
      <VStack
        style={{
          paddingHorizontal: CustomSpacing(16),
        }}>
        <Spacer height={CustomSpacing(16)} />
        <ContentLoader
          speed={2}
          width={475}
          height={124}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          {...props}>
          <Rect
            x="-1"
            y="-1"
            rx="0"
            ry="0"
            width={dimensions.screenWidth - CustomSpacing(32)}
            height={CustomSpacing(164)}
          />
        </ContentLoader>
        <Spacer height={CustomSpacing(16)} />
      </VStack>
    );
  };

  const TimeBackground = () => {
    const date = new Date();
    const hours = date.getHours();
    const Rain = false;

    if (Rain) {
      return RainBG;
    } else if (hours >= 5 && hours <= 11) {
      return MorningBG;
    } else if (hours >= 12 && hours <= 18) {
      return AfternoonBG;
    } else if (hours >= 18 || hours <= 5) {
      return NightBG;
    }
  };

  const toggleModalBanner = () => {
    setIsModalBanner(!isModalBanner);
  };

  return (
    <VStack style={componentStyles.exploreContainer}>
      {/* ------ Set Delivery Address ------ */}

      <VStack style={componentStyles.deliveryAddressContainer}>
        <Spacer topSafeAreaHeight />
        <VStack>
          <FastImage
            source={TimeBackground()}
            style={componentStyles.imgHeaderBg}
            resizeMode="cover"
          />
        </VStack>

        <VStack style={componentStyles.deliveryAddressContainerHead}>
          <Spacer height={CustomSpacing(32)} />
          <VStack style={componentStyles.deliveryAddressContent}>
            <HStack>
              <HStack>
                <TouchableOpacity onPress={goBack}>
                  <FastImage
                    source={BackGreyIcon}
                    style={componentStyles.imgGoback}
                  />
                </TouchableOpacity>
              </HStack>
              <Spacer width={CustomSpacing(12)} />
              <FastImage
                source={LocationIcon}
                style={componentStyles.imgLocationIcon}
              />
              <Spacer width={CustomSpacing(4)} />
              <Text
                style={[
                  Fonts.label,
                  {
                    color:
                      TimeBackground() == NightBG || TimeBackground() == RainBG
                        ? Colors.neutral10
                        : null,
                  },
                ]}>
                {t('deliverTo')}
              </Text>
            </HStack>
            <Spacer height={CustomSpacing(8)} />
            <HStack
              style={{
                justifyContent: 'space-between',
                width: dimensions.screenWidth - CustomSpacing(32),
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToDeliveryAddress}>
                <HStack>
                  <Text
                    style={[
                      Fonts.headlineL,
                      {
                        color:
                          TimeBackground() == NightBG ||
                          TimeBackground() == RainBG
                            ? Colors.neutral10
                            : null,
                      },
                    ]}>
                    {defaultAddress?.length > 30
                      ? `${defaultAddress.substring(0, 25)}...`
                      : defaultAddress}
                  </Text>
                  <FastImage
                    source={ChevronDownIcon}
                    style={componentStyles.imgChevronDownIcon}
                    tintColor={
                      TimeBackground() == NightBG || TimeBackground() == RainBG
                        ? Colors.neutral10
                        : null
                    }
                  />
                </HStack>
              </TouchableOpacity>
              {/* {exploreStore.listExplorePopularsData !== null && ( */}
              <TouchableOpacity activeOpacity={0.8} onPress={gotToFavourite}>
                <FastImage
                  source={FavouriteIcon}
                  style={componentStyles.imgFavoriteIcon}
                  tintColor={
                    TimeBackground() == NightBG || TimeBackground() == RainBG
                      ? Colors.neutral10
                      : null
                  }
                />
              </TouchableOpacity>
              {/* )} */}
            </HStack>
          </VStack>
        </VStack>
        {/* ------ Search Bar ------ */}
        {exploreStore.listExplorePopularsData !== null &&
          exploreStore.listExploreData !== null && (
            <VStack
              style={{
                paddingHorizontal: CustomSpacing(16),
                position: 'absolute',
                bottom: -CustomSpacing(36),
                width: '100%',
              }}>
              <TouchableWithoutFeedback
                onPress={goToSearchBar}
                accessible={false}>
                <HStack style={componentStyles.searchBarContainer}>
                  <FastImage
                    source={SearchOutlineIcon}
                    style={componentStyles.imgSearchOutlineIcon}
                  />
                  <Spacer width={CustomSpacing(6)} />
                  <TextInput
                    // editable={false}
                    placeholder={t('exploreInputPlaceholder')}
                    style={componentStyles.searchInput}
                    underlineColorAndroid="transparent"
                    onFocus={goToSearchBar}
                  />
                </HStack>
              </TouchableWithoutFeedback>
            </VStack>
          )}
      </VStack>
      <Spacer height={CustomSpacing(8)} />

      {exploreStore.listExploreLoading == false &&
      exploreStore.mainRecomendedData == null &&
      !exploreStore.notifyStatus ? (
        <VStack
          style={{
            height: dimensions.screenHeight * 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            padding: CustomSpacing(26),
          }}>
          <FastImage
            source={Getlost}
            style={{
              width: dimensions.screenWidth * 0.5,
              height: dimensions.screenWidth * 0.5,
            }}
          />
          <Spacer height={CustomSpacing(16)} />

          <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
            Sorry, we’re not yet available here
          </Text>
          <Text style={[Fonts.label, {textAlign: 'center'}]}>
            Our service still not available here at the moment.
          </Text>
          <Spacer height={CustomSpacing(50)} />
          <Button type="primary" label={'Notify me!'} onPress={handleNotify} />
        </VStack>
      ) : null}

      {exploreStore.listExploreLoading == false &&
      exploreStore.mainRecomendedData == null &&
      exploreStore.notifyStatus ? (
        <VStack
          style={{
            height: dimensions.screenHeight * 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            padding: CustomSpacing(46),
          }}>
          <FastImage
            source={Otw}
            style={{
              width: dimensions.screenWidth * 0.5,
              height: dimensions.screenWidth * 0.5,
            }}
            resizeMode={'contain'}
          />
          <Spacer height={CustomSpacing(50)} />

          <Text style={[Fonts.titleS, {textAlign: 'center'}]}>
            We are on the way
          </Text>
          <Text style={[Fonts.label, {textAlign: 'center'}]}>
            You’re request has been sent to us, we will notify you as soon as
            possible.
          </Text>
        </VStack>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* ------ Payyuq Balance ------ */}
        {exploreStore.listExploreLoading ? (
          <VStack
            style={{
              paddingHorizontal: CustomSpacing(16),
            }}>
            <ContentLoader
              speed={2}
              width={476}
              height={124}
              viewBox="0 0 476 124"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              {...props}>
              <Rect
                x="-1"
                y="-1"
                rx="0"
                ry="0"
                width={dimensions.screenWidth - CustomSpacing(32)}
                height={CustomSpacing(164)}
              />
            </ContentLoader>
          </VStack>
        ) : (
          <VStack
            style={{
              paddingHorizontal: CustomSpacing(16),
            }}>
            <FastImage
              source={PayyuqBg}
              style={{
                width: '100%',
                height: CustomSpacing(110),
                borderRadius: Rounded.l,
              }}
              resizeMode={'cover'}
            />

            <Payyuq />
          </VStack>
        )}
        <Spacer height={CustomSpacing(16)} />

        {/* Crausel Banner */}
        {bannerDatas && exploreStore.listExploreLoading == false ? (
          <Banner
            isModalVisible={isModalBanner}
            toggleModalBanner={toggleModalBanner}
            bannerData={bannerDatas}
          />
        ) : (
          <VStack
            style={{
              paddingHorizontal: CustomSpacing(16),
            }}>
            <ContentLoader
              speed={2}
              width={476}
              height={124}
              viewBox="0 0 476 124"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              {...props}>
              <Rect
                x="-1"
                y="-1"
                rx="0"
                ry="0"
                width={dimensions.screenWidth - CustomSpacing(32)}
                height={CustomSpacing(164)}
              />
            </ContentLoader>
          </VStack>
        )}

        {/* ------ Verify Email ------ */}
        {isVerified === 1 && exploreStore.listExploreLoading == false && (
          <VStack
            style={{
              paddingHorizontal: CustomSpacing(16),
            }}>
            <VStack style={componentStyles.verifyEmailContainer}>
              <Text style={[Fonts.label, {color: Colors.supportMain}]}>
                {t('verifyYourEmail')}&nbsp;
                <Text
                  onPress={requestVerifyEmail}
                  style={[Fonts.labelSemiBold, {color: Colors.supportMain}]}>
                  {t('verifyNow')}
                </Text>
              </Text>
            </VStack>
          </VStack>
        )}
        <Spacer height={CustomSpacing(16)} />
        {/* ------ Explore Menu ------ */}
        <HStack style={componentStyles.containerMenu}>
          {exploreStore.listExploreLoading ? (
            <ContentLoader
              speed={2}
              width={476}
              height={200}
              viewBox="0 0 476 124"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              {...props}>
              <Rect x="60" y="15" rx="2" ry="2" width="60" height="60" />
              <Rect x="150" y="15" rx="2" ry="2" width="60" height="60" />
              <Rect x="250" y="15" rx="2" ry="2" width="60" height="60" />
              <Rect x="350" y="15" rx="2" ry="2" width="60" height="60" />

              <Rect x="60" y="90" rx="2" ry="2" width="60" height="60" />
              <Rect x="150" y="90" rx="2" ry="2" width="60" height="60" />
              <Rect x="250" y="90" rx="2" ry="2" width="60" height="60" />
              <Rect x="350" y="90" rx="2" ry="2" width="60" height="60" />
            </ContentLoader>
          ) : (
            <HStack style={componentStyles.containerMenu}>
              {menuData.map((item, index) => {
                return (
                  <TouchableOpacity
                    disabled={exploreStore.listExploreLoading}
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => goToExploreMenuDetail(item.title)}>
                    <Animatable.View
                      animation="bounceIn"
                      delay={200}
                      style={componentStyles.containerIcon}>
                      <FastImage
                        source={item.icon}
                        style={componentStyles.imgIconMenu}
                      />
                      <Spacer height={CustomSpacing(8)} />
                      <Text numberOfLines={1} style={[Fonts.captionM]}>
                        {item.title}
                      </Text>
                    </Animatable.View>
                  </TouchableOpacity>
                );
              })}
            </HStack>
          )}
        </HStack>

        {/* ------- Banner -----------*/}
        <Suspense fallback={<LoadingSuspense title={'Banner'} />}>
          {exploreStore.bannerDataLoading ? <LoadingSuspense /> : <BannerH />}
        </Suspense>

        {/* ------ RateYourOrder ------ */}
        <Suspense fallback={<LoadingSuspense title={t('rateYourOrder')} />}>
          {exploreStore.mainRatedLoading ? <LoadingSuspense /> : <RateOrder />}
        </Suspense>

        {/* ------ Recomended ------ */}
        {exploreStore.mainRecomendedData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('Recomended')} />}>
            {exploreStore.listExploreLoading ? (
              <LoadingSuspense />
            ) : (
              <RecomendedList />
            )}
          </Suspense>
        )}
        {/* ------ Order with voucher ------ */}
        {exploreStore.listExplorePromoData !== null && (
          <Suspense
            fallback={<LoadingSuspense title={t('orderWithVoucher')} />}>
            {exploreStore.mainVoucherLoading ? (
              <LoadingSuspense />
            ) : (
              <OrderWithVoucher />
            )}
          </Suspense>
        )}
        {/* ------ Reorder ------ */}
        {exploreStore.listExploreReorderData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('yuqOrder')} />}>
            {exploreStore.listExploreReorderLoading ? (
              <LoadingSuspense />
            ) : (
              <Reorder />
            )}
          </Suspense>
        )}
        {/* ------ Most Liked ------ */}
        {exploreStore.listExploreLikeData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('mostLikedFood')} />}>
            {exploreStore.listExploreLikeLoading ? (
              <LoadingSuspense />
            ) : (
              <MostLiked />
            )}
          </Suspense>
        )}
        {/* ------ Popular ------ */}
        {exploreStore.listExplorePopularsData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('popularInArea')} />}>
            {exploreStore.listExplorePopularsLoading ? (
              <LoadingSuspense />
            ) : (
              <Popular />
            )}
          </Suspense>
        )}

        {/* ------ Top Rated Hayuqers------ */}
        <Spacer height={CustomSpacing(8)} />
        {exploreStore.listExploreHayuqersData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('topRatedHayuqer')} />}>
            {exploreStore.listExploreHayuqersLoading ? (
              <LoadingSuspense />
            ) : (
              <TopRated />
            )}
          </Suspense>
        )}
        <Spacer height={CustomSpacing(25)} />
        <TouchableOpacity activeOpacity={0.8} onPress={backToTop}>
          <HStack style={[Layout.flexCenterMid]}>
            <Text style={[Fonts.body, {color: Colors.neutral60}]}>
              {t('backToTop')}
            </Text>
            <Spacer width={CustomSpacing(8)} />
            <FastImage
              source={BackToTop}
              style={{
                width: CustomSpacing(24),
                height: CustomSpacing(24),
              }}
              resizeMode={'contain'}
            />
          </HStack>
        </TouchableOpacity>
        <Spacer height={CustomSpacing(20)} />
      </ScrollView>
      <LoginValidModal
        showing={authStore.isToken == 'NO_TOKEN'}
        close={handleShowLoginValidModal}
      />
    </VStack>
  );
});

export default Explore;
