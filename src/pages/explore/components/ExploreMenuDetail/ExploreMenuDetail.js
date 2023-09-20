import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Numbro from '@utils/numbro';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, FilterModal} from '@components';
import {useStores} from '@store/root.store';

import {dimensions} from '@config/Platform.config';
import {
  SearchOutlineIcon,
  FilterIcon,
  WhiteBackIcon,
  StarIcon,
  TagIcon,
  WhiteSuperIcon,
  ShopOrangeIcon,
  PizzahutIcon,
  LikeOrangeIcon,
  VoucherOrangeIcon,
  LikeIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './ExploreMenuDetail.style';
import moment from 'moment';

const ExploreMenuDetail = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const filterType = useMemo(
    () => exploreStore?.routerFilterType,
    [exploreStore.routerFilterType],
  );

  const componentStyles = styles();
  const navigation = useNavigation();
  // const [searchString, setSearchString] = useState('');
  const [isShowFilterModal, setIsShowFilterModal] = useState(false);
  const [listData, setListData] = useState([]);

  const [currentFilter, setCurrentFilter] = useState({
    sort: null,
    rating: null,
    other: null,
  });

  useEffect(() => {
    if (
      exploreStore.routerFilterTitle === t('nearMe') ||
      exploreStore.routerFilterTitle === 'Top rated'
    ) {
      exploreStore.getExploreList(1);
    }
    if (exploreStore.routerFilterTitle === t('promo')) {
      exploreStore.getExploreList(2);
    }
    if (exploreStore.routerFilterTitle === t('bestSeller')) {
      exploreStore.getExploreList(3);
    }
    if (exploreStore.routerFilterTitle === t('fastFood')) {
      exploreStore.getExploreList(4);
    }
    if (exploreStore.routerFilterTitle === t('fullTimeHours')) {
      exploreStore.getExploreList(5);
    }
    if (exploreStore.routerFilterTitle === t('newResto')) {
      exploreStore.getExploreList(6);
    }
    if (exploreStore.routerFilterTitle === t('healtyFood')) {
      exploreStore.getExploreList(7);
    }
    if (exploreStore.routerFilterTitle === t('allCuisine')) {
      // exploreStore.getExploreListCousines(8);
      exploreStore.getCousinesData(3);
    }
    if (exploreStore.routerFilterTitle === t('recomendedForYou')) {
      exploreStore.getExploreList(10);
    }
    if (exploreStore.routerFilterTitle === t('orderAgain')) {
      exploreStore.getExploreList(11);
    }
    if (exploreStore.routerFilterTitle === t('mostLikedFood')) {
      exploreStore.getExploreList(12);
    }
    if (exploreStore.routerFilterTitle === t('popularInArea')) {
      exploreStore.getExploreList(13);
    }
  }, []);

  const handleCurrentFilter = (filter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    console.log(
      'exploreStore.routerFilterTitle',
      exploreStore.routerFilterTitle,
    );
    if (
      exploreStore.routerFilterTitle === 'Near Me' ||
      exploreStore.routerFilterTitle === 'Top rated'
    ) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataNearme);
    } else if (exploreStore.routerFilterTitle === 'Promos') {
      setCurrentFilter({
        ...currentFilter,
        other: 1,
      });
      setListData(exploreStore.listExploreDataPromos);
    } else if (exploreStore.routerFilterTitle === t('bestSeller')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataBestSeller);
    } else if (exploreStore.routerFilterTitle === t('fastFood')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataFastFood);
    } else if (exploreStore.routerFilterTitle === t('fullTimeHours')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataFulltimeHours);
    } else if (exploreStore.routerFilterTitle === t('newResto')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataNewResto);
    } else if (exploreStore.routerFilterTitle === t('healtyFood')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataHealtyFood);
    } else if (exploreStore.routerFilterTitle === t('recomendedForYou')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.mainRecomendedData);
    } else if (exploreStore.routerFilterTitle === t('orderAgain')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataReorder);
    } else if (exploreStore.routerFilterTitle === t('mostLikedFood')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataMostlike);
    } else if (exploreStore.routerFilterTitle === t('popularInArea')) {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData(exploreStore.listExploreDataPopular);
    } else {
      setCurrentFilter({
        ...currentFilter,
        sort: 0,
      });
      setListData([]);
    }

    if (exploreStore.routerFilterTitle === t('allCuisine')) {
      if (exploreStore.listCousinesData) {
        setListData(exploreStore.listCousinesData);
      }
    }
  }, [
    exploreStore.routerFilterTitle,
    exploreStore.listCousinesData,
    exploreStore.listExploreDataNearme,
    exploreStore.listExploreDataPromos,
    exploreStore.listExploreDataBestSeller,
    exploreStore.listExploreDataFastFood,
    exploreStore.listExploreDataFulltimeHours,
    exploreStore.listExploreDataNewResto,
    exploreStore.listExploreDataHealtyFood,
    exploreStore.listExploreDataReorder,
    exploreStore.listExploreDataMostlike,
    exploreStore.listExploreDataPopular,
    exploreStore.mainRecomendedData,
    exploreStore.mainVoucherData,
    exploreStore.merchantDetailData,
    exploreStore.mainReorderData,
    exploreStore.mainLikedData,
    exploreStore.mainPopularData,
    exploreStore.mainRatedData,
  ]);

  // ini sortingnya
  // useEffect(() => {
  //   // if (listData?.length > 0) {
  //   //   if (currentFilter.sort === 0) {
  //   //     const sortedList = listData.sort((a, b) => {
  //   //       return a.distance?.distance - b.distance?.distance;
  //   //     });
  //   //     setListData(sortedList);
  //   //   }
  //   //   if (currentFilter.sort === 1) {
  //   //     const sortedList = listData.sort((a, b) => {
  //   //       return a.ratings - b.ratings;
  //   //     });
  //   //     setListData(sortedList);
  //   //   }
  //   // }

  //   exploreStore.clearExploreList();
  //   if (
  //     exploreStore.routerFilterTitle === t('nearMe') ||
  //     exploreStore.routerFilterTitle === 'Top rated'
  //   ) {
  //     console.log('masuk near mee');
  //     exploreStore.getExploreList(1, currentFilter);
  //   }
  //   if (exploreStore.routerFilterTitle === t('promo')) {
  //     console.log('masuk Promo');
  //     exploreStore.getExploreList(2);
  //   }
  //   if (exploreStore.routerFilterTitle === t('bestSeller')) {
  //     console.log('masuk bestSeller');
  //     exploreStore.getExploreList(3);
  //   }
  //   if (exploreStore.routerFilterTitle === t('fastFood')) {
  //     console.log('masuk fastFood');
  //     exploreStore.getExploreList(4);
  //   }
  //   if (exploreStore.routerFilterTitle === t('fullTimeHours')) {
  //     console.log('masuk fullTimeHours');
  //     exploreStore.getExploreList(5);
  //   }
  //   if (exploreStore.routerFilterTitle === t('newResto')) {
  //     console.log('masuk hNew');
  //     exploreStore.getExploreList(6);
  //   }
  //   if (exploreStore.routerFilterTitle === t('healtyFood')) {
  //     console.log('masuk healtyFood');
  //     exploreStore.getExploreList(7);
  //   }
  //   if (exploreStore.routerFilterTitle === t('allCuisine')) {
  //     console.log('masuk allCuisine');
  //     exploreStore.clearExploreList();
  //     // exploreStore.getExploreListCousines(8);
  //     exploreStore.getCousinesData(3);
  //   }
  //   if (exploreStore.routerFilterTitle === t('recomendedForYou')) {
  //     console.log('masuk recomended For You');
  //     exploreStore.getExploreList(10);
  //   }
  //   if (exploreStore.routerFilterTitle === t('orderAgain')) {
  //     console.log('masuk order Again');
  //     exploreStore.getExploreList(11);
  //   }
  //   if (exploreStore.routerFilterTitle === t('mostLikedFood')) {
  //     console.log('masuk most Liked Food');
  //     exploreStore.getExploreList(12);
  //   }
  //   if (exploreStore.routerFilterTitle === t('popularInArea')) {
  //     console.log('masuk popular In Area');
  //     exploreStore.getExploreList(13);
  //   }
  // }, [currentFilter]);

  // useEffect(() => {
  //   if (searchString.length > 0) {
  //     const filteredList = listData.filter((item) => {
  //       return item.name.toLowerCase().includes(searchString.toLowerCase());
  //     });
  //     console.log('FILTEREDDATA', filteredList);
  //     setListData(filteredList);
  //   } else {
  //     if (exploreStore.routerFilterTitle === 'Near Me') {
  //       setListData(exploreStore.listExploreData);
  //     }
  //   }
  // }, [searchString]);

  const handleShowFilterModal = () => {
    setIsShowFilterModal(!isShowFilterModal);
  };

  const applyFilterModal = () => {
    setIsShowFilterModal(!isShowFilterModal);
  };

  const handleSearchSrting = (searchString) => {
    if (searchString.length > 0) {
      const filteredList = exploreStore.listExploreData?.filter((item) => {
        return item.name.toLowerCase().includes(searchString.toLowerCase());
      });

      setListData(filteredList);
    } else {
      setListData(exploreStore.listExploreData);
    }
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToRestaurantPage = (id) => {
    exploreStore.setMerchantDetailId(id);
    navigation.navigate('RestaurantPage');
  };

  const goToCousines = (id, name) => {
    // exploreStore.setRouterFilter('Recommended for you', 'mostLiked');

    navigation.navigate('Cousines', {idCousines: id, nameCousines: name});
    // navigation.navigate('ExploreMenuDetail');
  };
  /* ------ Normal Render ------ */

  const NormalRenderItem = ({item}) => {
    console.log('RECOMMENDED12', item);
    const merchantOpenAt = item.days?.data;
    const dateNow = moment(new Date()).format('dddd');
    const merchantDate = merchantOpenAt?.find((a) => a.name == dateNow);

    return (
      <TouchableOpacity
        disabled={!item.days?.open}
        activeOpacity={0.8}
        onPress={() => goToRestaurantPage(item.id)}>
        <VStack
          style={
            (componentStyles.containerContent,
            {
              opacity: item.isClosed ? 0.5 : 1,
              backgroundColor: item.days?.open ? null : Colors.neutral20,
            })
          }>
          <Spacer height={CustomSpacing(16)} />
          <HStack>
            <VStack>
              <FastImage
                source={{uri: item.pictures?.[0]?.path}}
                style={[
                  {
                    borderBottomLeftRadius: item.hayuqPartner ? 0 : Rounded.m,
                    borderBottomRightRadius: item.hayuqPartner ? 0 : Rounded.m,
                  },
                  componentStyles.imgContent,
                ]}
                resizeMode="cover">
                <HStack style={componentStyles.ratingContainer}>
                  <Text style={[Fonts.captionSSemiBold]}>
                    {item.ratings === null ? '-' : item.ratings}
                  </Text>
                  <Spacer width={CustomSpacing(4)} />
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgStarIcon}
                  />
                </HStack>
              </FastImage>
              {item.hayuqPartner && (
                <VStack style={componentStyles.hayuqPartnerContainer}>
                  <HStack>
                    <FastImage
                      source={WhiteSuperIcon}
                      style={componentStyles.imgWhiteSuper}
                      resizeMode="contain"
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text
                      style={[
                        Fonts.captionMSemiBold,
                        {color: Colors.neutral10},
                      ]}>
                      {t('hHayuqPartner')}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </VStack>
            <Spacer width={CustomSpacing(8)} />
            <VStack
              style={{
                alignSelf: 'flex-start',
              }}>
              {!item.days?.open && (
                <HStack>
                  <Text style={[Fonts.captionS, {color: Colors.dangerMain}]}>
                    {t('wlClosed')}
                  </Text>
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={[Fonts.captionS]}>{`${t('wlOpenAt')} ${
                    merchantDate?.start
                  }`}</Text>
                </HStack>
              )}
              <Text
                style={[
                  Fonts.headlineM,
                  {
                    maxWidth: dimensions.screenWidth * 0.4,
                  },
                ]}>
                {item.name}
              </Text>
              <Text style={[Fonts.captionS]}>{item.partnerstypes_name}</Text>
              {item.marketing !== null && (
                <HStack>
                  <FastImage
                    source={TagIcon}
                    style={{
                      width: CustomSpacing(14),
                      height: CustomSpacing(14),
                    }}
                    resizeMode="contain"
                  />
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={[Fonts.labelSemiBold]}>
                    {item.merchantPromo}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>
        </VStack>
      </TouchableOpacity>
    );
  };

  /* ------ Cuisine Render ------ */

  const CuisineRenderItem = ({item}) => {
    return (
      <VStack style={componentStyles.containerCuisineCard}>
        <TouchableOpacity onPress={() => goToCousines(item.id, item.name)}>
          <HStack>
            <VStack>
              <FastImage
                source={{
                  uri: `${item?.path}`,
                }}
                style={componentStyles.imgCuisineType}
              />
            </VStack>
            <Spacer width={CustomSpacing(14)} />
            <VStack
              style={{
                alignSelf: 'flex-start',
              }}>
              <Text style={[Fonts.headlineM]}>{item?.name}</Text>
              <HStack>
                <FastImage
                  source={ShopOrangeIcon}
                  style={componentStyles.imgIconCuisine}
                />
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.captionM]}>{`${
                  item?.products ? item?.products : 0
                } food in this cousines`}</Text>
              </HStack>
              {/* <HStack>
              <FastImage
                source={TagIcon}
                style={componentStyles.imgIconCuisine}
              />
              <Spacer width={CustomSpacing(4)} />
              <Text style={[Fonts.captionM]}>
                {`81 ${t('wlOngoingPromos')}`}
              </Text>
            </HStack> */}
            </VStack>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  /* ------ Popular Render ------ */
  const PopularRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          goToRestaurantPage(item.id);
        }}
        style={componentStyles.containerCuisineCard}>
        <HStack>
          <VStack
            style={{
              paddingBottom: CustomSpacing(8),
            }}>
            <FastImage
              source={{
                uri: `${item?.pictures?.[0]?.path}`,
              }}
              style={componentStyles.imgLogoMerchant}
            />
            <HStack style={componentStyles.containerPopularRating}>
              <Text style={[Fonts.captionSSemiBold]}>
                {item.merchantRating}
              </Text>
              <Spacer width={CustomSpacing(4)} />
              <FastImage
                source={StarIcon}
                style={componentStyles.imgStarIcon}
              />
            </HStack>
          </VStack>
          <Spacer width={CustomSpacing(14)} />
          <VStack
            style={{
              alignSelf: 'flex-start',
            }}>
            <Text style={[Fonts.headlineM]}>{item?.name}</Text>
            <Text style={[Fonts.captionS]} maxNumberOfLines={1}>
              {item?.tags?.map((v, i) => `${v.name},`)}
            </Text>
            <Spacer height={CustomSpacing(15)} />
            <HStack>
              <HStack>
                <FastImage
                  source={LikeOrangeIcon}
                  style={componentStyles.imgIconLike}
                  resizeMode="contain"
                />
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.captionMSemiBold]}>{`${
                  item?.rating ? item?.rating : 0
                } ${t('wlLikes')}`}</Text>
              </HStack>
              <Spacer width={CustomSpacing(16)} />
              <HStack>
                <FastImage
                  source={VoucherOrangeIcon}
                  style={componentStyles.imgIconLike}
                  resizeMode="contain"
                />
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.captionMSemiBold]}>{`0 ${t(
                  'wlVouchers',
                )}`}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  /* ------ Reorder Render ------ */
  const reorderData = ['1', '2'];
  const ReorderRenderItem = ({item, index}) => {
    const merchantOpenAt = item.days.data;
    const dateNow = moment(new Date()).format('dddd');
    const merchantDate = merchantOpenAt?.find((a) => a.name == dateNow);

    return (
      <>
        <VStack
          style={
            (componentStyles.containerContent,
            {
              opacity: item.isClosed ? 0.5 : 1,
              borderBottomWidth: 0.5,
              borderColor: Colors.neutral50,
              paddingBottom: CustomSpacing(16),
            })
          }>
          <TouchableOpacity
            disabled={!item.days?.open}
            activeOpacity={0.8}
            onPress={() => goToRestaurantPage(item.id)}>
            <Spacer height={CustomSpacing(16)} />
            <HStack>
              <VStack>
                <FastImage
                  source={{
                    uri: `${item?.productspictures?.path}`,
                  }}
                  style={[
                    {
                      backgroundColor: item.days?.open
                        ? null
                        : Colors.neutral20,
                      borderBottomLeftRadius: item.hayuqPartner ? 0 : Rounded.m,
                      borderBottomRightRadius: item.hayuqPartner
                        ? 0
                        : Rounded.m,
                    },
                    componentStyles.imgContent,
                  ]}
                  resizeMode="cover">
                  <HStack style={componentStyles.ratingContainer}>
                    <Text style={[Fonts.captionSSemiBold]}>
                      {item.merchantRating}
                    </Text>
                    <Spacer width={CustomSpacing(4)} />
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgStarIcon}
                    />
                  </HStack>
                </FastImage>
                {item.hayuqPartner && (
                  <VStack style={componentStyles.hayuqPartnerContainer}>
                    <HStack>
                      <FastImage
                        source={WhiteSuperIcon}
                        style={componentStyles.imgWhiteSuper}
                        resizeMode="contain"
                      />
                      <Spacer width={CustomSpacing(4)} />
                      <Text
                        style={[
                          Fonts.captionMSemiBold,
                          {color: Colors.neutral10},
                        ]}>
                        {t('hHayuqPartner')}
                      </Text>
                    </HStack>
                  </VStack>
                )}
              </VStack>
              <Spacer width={CustomSpacing(8)} />
              <VStack
                style={{
                  alignSelf: 'flex-start',
                }}>
                {!item.days?.open && (
                  <HStack>
                    <Text style={[Fonts.captionS, {color: Colors.dangerMain}]}>
                      {t('wlClosed')}
                    </Text>
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionS]}>{`${t('wlOpenAt')} ${
                      merchantDate?.start
                    }`}</Text>
                  </HStack>
                )}
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[Fonts.headlineM, {width: CustomSpacing(132)}]}
                  maxNumberOfLines={1}>
                  {item.merchantName}
                </Text>
                <Text style={[Fonts.captionS]}>{item.merchantType}</Text>
                <HStack>
                  <FastImage
                    source={TagIcon}
                    style={{
                      width: CustomSpacing(14),
                      height: CustomSpacing(14),
                    }}
                    resizeMode="contain"
                  />
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={[Fonts.labelSemiBold]}>
                    {item.merchantPromo}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </TouchableOpacity>
          <Spacer height={CustomSpacing(8)} />
          <Text style={[Fonts.headlineM]}>
            {t('wlYourLastOrderRestaurant')}
          </Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack>
            {/* {reorderData.map((item) => (
              <TouchableOpacity
                key={`reorder-${item}`}
                activeOpacity={0.8}
                onPress={() => goToRestaurantPage(item.id)}>
                <HStack>
                  <HStack>
                    <FastImage
                      source={{
                        uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                      }}
                      style={componentStyles.imgDishReorder}
                      resizeMode="cover"
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <VStack
                      style={{
                        alignSelf: 'flex-start',
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          Fonts.headlineM,
                          {
                            maxWidth: CustomSpacing(95),
                          },
                        ]}>
                        Chicken Burger
                      </Text>
                      <HStack>
                        <Text style={[Fonts.captionS]}>27k sold</Text>
                        <Spacer width={CustomSpacing(4)} />
                        <Text style={[Fonts.captionS]}>12k likes</Text>
                      </HStack>
                      <Text style={[Fonts.captionMSemiBold]}>40.000</Text>
                    </VStack>
                  </HStack>
                  <Spacer width={CustomSpacing(8)} />
                </HStack>
              </TouchableOpacity>
            ))} */}
          </HStack>
        </VStack>
      </>
    );
  };

  /* ------ Most Liked Render ------ */
  const MostLikedRenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => goToRestaurantPage(item.merchants_id)}>
        <HStack key={`dishResult-${index}`}>
          <VStack style={componentStyles.containerMostLiked}>
            <FastImage
              source={{
                uri: `${item?.productspictures?.path}`,
              }}
              style={componentStyles.imgDishMostLiked}
              resizeMode="cover">
              <HStack style={componentStyles.containerTotalLike}>
                {item?.rating?.likes > 0 ? (
                  <Text
                    style={[Fonts.captionSSemiBold, {color: Colors.neutral10}]}>
                    {item?.rating?.likes}
                  </Text>
                ) : null}
                <Spacer width={CustomSpacing(4)} />
                <FastImage
                  source={LikeIcon}
                  style={componentStyles.imgLikedIcon}
                />
              </HStack>
            </FastImage>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[Fonts.bodySemiBold, {width: CustomSpacing(132)}]}
              maxNumberOfLines={1}>
              {item?.name}
            </Text>
            <HStack>
              <Text style={[Fonts.labelSemiBold]}>
                {Numbro.formatCurrency(item?.productsprices?.price)}
              </Text>
              <Spacer width={CustomSpacing(4)} />
              <HStack style={componentStyles.containerDiscount}>
                {item?.productsprices?.discount_price > 0 && (
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={[
                      Fonts.captionS,
                      {
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      },
                    ]}>
                    {Numbro.formatCurrency(
                      item?.productsprices?.discount_price,
                    )}
                  </Text>
                )}
                <Spacer width={CustomSpacing(4)} />
                {item?.productsprices?.discount_price > 0 && (
                  <FastImage
                    source={TagIcon}
                    style={componentStyles.imgTagLikedIcon}
                  />
                )}
              </HStack>
            </HStack>
            <Text
              style={[
                Fonts.captionS,
                {
                  maxWidth: dimensions.screenWidth * 0.3,
                },
              ]}
              numberOfLines={1}>
              {item?.productstags?.map((v, i) => `${v.name},`)}
            </Text>
            <View style={componentStyles.containerLogoMerchantLiked} />
            <HStack>
              <FastImage
                source={{
                  uri: `${item?.productspictures?.path}`,
                }}
                style={componentStyles.imgMerchantLogo}
                resizeMode="cover"
              />
              <Spacer width={CustomSpacing(8)} />
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[Fonts.headlineM, {width: CustomSpacing(70)}]}
                maxNumberOfLines={1}>
                {item?.name}
              </Text>
            </HStack>
          </VStack>
          {(index + 1) % 2 !== 0 && <Spacer width={CustomSpacing(16)} />}
        </HStack>
      </TouchableOpacity>
    );
  };

  console.log('listDataNEW', listData);
  return (
    <VStack
      style={{
        flex: 1,
      }}>
      {/* ------ Navigator & Search Bar ------ */}
      <VStack style={componentStyles.navigatorContainer}>
        <Spacer topSafeAreaHeight />
        <HStack>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={WhiteBackIcon}
              style={componentStyles.imgBackIcon}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(12)} />
          <Text style={[Fonts.headlineL]}>
            {exploreStore.routerFilterTitle}
          </Text>
        </HStack>
        <Spacer height={CustomSpacing(16)} />
        <HStack style={componentStyles.searchBarContainer}>
          <HStack>
            <FastImage
              source={SearchOutlineIcon}
              style={componentStyles.imgSearchIcon}
            />
            <Spacer width={CustomSpacing(8)} />
            <TextInput
              placeholder={`Search in ${exploreStore.routerFilterTitle}`}
              style={componentStyles.searchInput}
              underlineColorAndroid="transparent"
              // value={searchString}
              onChangeText={_.debounce((e) => handleSearchSrting(e), 1000)}
            />
          </HStack>
          <TouchableOpacity activeOpacity={0.8} onPress={handleShowFilterModal}>
            <FastImage
              source={FilterIcon}
              style={componentStyles.imgFilterIcon}>
              {currentFilter.sort !== null ||
              currentFilter.rating !== null ||
              currentFilter.other !== null ? (
                <View style={componentStyles.dotFilter} />
              ) : null}
            </FastImage>
          </TouchableOpacity>
        </HStack>
      </VStack>
      {/* ------Content ------ */}
      <>
        {exploreStore.routerFilterTitle === t('allCuisine')
          ? exploreStore.listCousinesLoading && (
              <VStack alignItems="center" justifyContent="center">
                <Spacer height={dimensions.screenWidth * 0.4} />
                <ActivityIndicator size="large" color={Colors.primaryMain} />
                <Spacer height={CustomSpacing(16)} />
                <Text style={[Fonts.captionS]}>Please wait ...</Text>
              </VStack>
            )
          : exploreStore.listExploreLoading && (
              <VStack alignItems="center" justifyContent="center">
                <Spacer height={dimensions.screenWidth * 0.4} />
                <ActivityIndicator size="large" color={Colors.primaryMain} />
                <Spacer height={CustomSpacing(16)} />
                <Text style={[Fonts.captionS]}>Please wait ...</Text>
              </VStack>
            )}

        {exploreStore.routerFilterTitle === t('allCuisine')
          ? !exploreStore.listCousinesLoading && (
              <FlatList
                style={componentStyles.containerScrollContent}
                data={listData}
                renderItem={CuisineRenderItem}
                keyExtractor={(item, index) => `content-${index.toString()}`}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                initialNumToRender={5}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: CustomSpacing(50)}}
              />
            )
          : !exploreStore.listExploreLoading &&
            (exploreStore.routerFilterTitle === t('mostLikedFood') ? (
              <FlatList
                numColumns={2}
                style={componentStyles.containerFlatlistMostliked}
                data={listData}
                renderItem={MostLikedRenderItem}
                keyExtractor={(item, index) => `content-${index.toString()}`}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                initialNumToRender={5}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: CustomSpacing(50)}}
              />
            ) : (
              <FlatList
                style={componentStyles.containerScrollContent}
                data={listData}
                renderItem={
                  exploreStore.routerFilterTitle === t('allCuisine')
                    ? CuisineRenderItem
                    : filterType === 'popular'
                    ? PopularRenderItem
                    : filterType === 'reorder'
                    ? ReorderRenderItem
                    : NormalRenderItem
                }
                keyExtractor={(item, index) => `content-${index.toString()}`}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={100}
                initialNumToRender={5}
                windowSize={10}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: CustomSpacing(50)}}
              />
            ))}
      </>
      <FilterModal
        handleCurrentFilter={handleCurrentFilter}
        currentFilter={currentFilter}
        showing={isShowFilterModal}
        close={handleShowFilterModal}
        onFilter={applyFilterModal}
      />
    </VStack>
  );
});

export default ExploreMenuDetail;
