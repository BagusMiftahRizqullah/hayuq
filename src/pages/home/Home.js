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
  FlatList,
  View,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Keyboard,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  AppState,
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
  BackToTop,
  MorningBG,
  AfternoonBG,
  NightBG,
  RainBG,
  Getlost,
  Otw,
  FoodMenuBG,
  RideMenuBG,
  Food,
  Ride,
} from '@assets';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import Geolocation from 'react-native-geolocation-service';
import {Payyuq, Banner} from '../explore/components';
import CONFIG from '@config';
import ContentLoader, {Rect} from 'react-content-loader/native';
import BackgroundTimer from 'react-native-background-timer';

const RecomendedList = React.lazy(() =>
  import('../explore/components/RecomendedList'),
);
const OrderWithVoucher = React.lazy(() =>
  import('../explore/components/OrderWithVoucher'),
);
// const Reorder = React.lazy(() => import('../explore/components/Reorder'));
const TopRated = React.lazy(() => import('./components/TopRated'));
const BannerH = React.lazy(() => import('../explore/components/BannerH'));

import styles from './Home.style';

const Home = observer((props) => {
  const {t, i18n} = useTranslation();

  const {
    exploreStore,
    authStore,
    homeStore,
    routerStore,
    pickyuqStore,
    accountStore,
  } = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const scrollRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalBanner, setIsModalBanner] = useState(false);
  const [bannerDatas, setBannerDatas] = useState(null);
  // const [account, setAccount] = useState(false);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);

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

  // useEffect(() => {
  //   if (accountStore?.accountData) {
  //     setAccount(true);
  //   }
  // }, [accountStore?.accountData]);

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
    pickyuqStore.getOrderPickyuq();
    homeStore.getExploreHayuqers(14);
    accountStore.getDetailsAccount();
    exploreStore.getCartList();
    exploreStore.getHistoryTopUpData();
    exploreStore.getBannerData(routerStore.defaultLanguage, 1);

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

  const goToExploreMenuDetail = async (title) => {
    if (title === 'All Cuisines') {
      exploreStore.setRouterFilter(title, 'cuisine');
      (await CekUserToken()) ? navigation.navigate('ExploreMenuDetail') : null;
    } else {
      exploreStore.setRouterFilter(title, 'normal');
      (await CekUserToken()) ? navigation.navigate('ExploreMenuDetail') : null;
    }
  };

  const backToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(async () => {
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    console.log('daftar ID Useeffect', USER_ID),
      CONFIG.portSocket.emit('data', {
        users_id: USER_ID,
      });
    CONFIG.portSocket.on('data', (data) => {
      console.log('REGISTER USER SOCKET', data);
    });
  }, []);

  useEffect(() => {
    // requestLocationPermission();

    if (
      exploreStore.currentDeliveryAddress.lat &&
      exploreStore.currentDeliveryAddress.lng
    ) {
      pickyuqStore.getOrderPickyuq();
      homeStore.getExploreHayuqers(14);
      accountStore.getDetailsAccount();
      exploreStore.getCartList();
      exploreStore.getHistoryTopUpData();
      exploreStore.getBannerData(routerStore.defaultLanguage, 1);
    }
  }, [exploreStore.currentDeliveryAddress]);

  const CekUserToken = async () => {
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    if (TOKEN !== null) {
      console.log('MEMILIKI TOKENN');
      authStore.setIsToken('IS_TOKEN');
      return true;
    } else {
      console.log('TIDAK ada TOKENN');
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
            x="-80"
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
        {exploreStore.listExploreData !== null && (
          <VStack
            style={{
              paddingHorizontal: CustomSpacing(16),
              position: 'absolute',
              bottom: -CustomSpacing(26),
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

      {/* {exploreStore.listExploreLoading == false &&
      exploreStore.listExploreDataNearme == null &&
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
              width: dimensions.screenWidth * 0.6,
              height: dimensions.screenWidth * 0.6,
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
      ) : null} */}

      {/* {exploreStore.listExploreLoading == false &&
      exploreStore.listExploreDataNearme == null &&
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
              width: dimensions.screenWidth * 0.7,
              height: dimensions.screenWidth * 0.7,
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
      ) : null} */}

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
        {accountStore.accountLoading ? (
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
        <VStack>
          <HStack
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={async () => {
                if (await CekUserToken()) {
                  routerStore.setMyMenu('Explore');
                } else {
                  null;
                }

                // navigation.navigate('Explore');
              }}>
              <FastImage
                source={FoodMenuBG}
                style={{
                  width:
                    Platform.OS == 'ios'
                      ? CustomSpacing(130)
                      : CustomSpacing(144),
                  height: CustomSpacing(50),
                  borderRadius: 8,
                }}
              />
              <HStack
                style={{
                  width: CustomSpacing(144),
                  position: 'absolute',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  top: -4,
                  right: -23,
                }}>
                <Text style={[Fonts.headlineL, {color: Colors.neutral20}]}>
                  Food
                </Text>
                <FastImage
                  source={Food}
                  style={{
                    width:
                      Platform.OS == 'ios'
                        ? CustomSpacing(71)
                        : CustomSpacing(91),
                    height: CustomSpacing(56),
                  }}
                />
              </HStack>
            </TouchableOpacity>
            {/* <Spacer width={CustomSpacing(12)} /> */}
            <TouchableOpacity
              style={{
                width: CustomSpacing(144),
              }}
              onPress={async () => {
                if (await CekUserToken()) {
                  routerStore.setMyMenu('Home');
                  navigation.navigate('Pickyuq');
                } else {
                  return null;
                }
              }}>
              <FastImage
                source={RideMenuBG}
                style={{
                  width:
                    Platform.OS == 'ios'
                      ? CustomSpacing(130)
                      : CustomSpacing(128),
                  height: CustomSpacing(50),
                  borderRadius: 8,
                }}
              />
              <HStack
                style={{
                  width: CustomSpacing(144),
                  position: 'absolute',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  top: -15,
                  right: -12,
                }}>
                <Text style={[Fonts.headlineL, {color: Colors.neutral20}]}>
                  Ride
                </Text>
                <FastImage
                  source={Ride}
                  style={{
                    width: CustomSpacing(73),
                    height: CustomSpacing(73),
                  }}
                />
              </HStack>
            </TouchableOpacity>
          </HStack>
        </VStack>
        <Spacer height={CustomSpacing(12)} />
        {/* Crausel Banner */}
        {exploreStore.bannerDataLoading == false ? (
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
        {/* <HStack style={componentStyles.containerMenu}>
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
        </HStack> */}
        {/* ------- Banner -----------*/}
        <Suspense fallback={<LoadingSuspense title={'Banner'} />}>
          {exploreStore.bannerDataLoading ? <LoadingSuspense /> : <BannerH />}
        </Suspense>

        {/* ------ Reorder ------ */}
        {/* {exploreStore.listExploreReorderData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('yuqOrder')} />}>
            {exploreStore.mainReorderLoading ? (
              <LoadingSuspense />
            ) : (
              <Reorder />
            )}
          </Suspense>
        )} */}

        {/* ------ Top Rated ------ */}
        <Spacer height={CustomSpacing(8)} />
        {homeStore.listExploreHayuqersData !== null && (
          <Suspense fallback={<LoadingSuspense title={t('topRatedHayuqer')} />}>
            {homeStore.listExploreHayuqersLoading ? (
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

export default Home;
