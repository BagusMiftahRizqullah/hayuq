import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Numbro from '@utils/numbro';

import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, FilterModal} from '@components';
import {dimensions} from '@config/Platform.config';
import {
  SearchOutlineIcon,
  CloseOutlineIcon,
  FilterIcon,
  ArrowDownIcon,
  TagIcon,
  StarIcon,
  LikeIcon,
} from '@assets';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './Searchbar.style';
import {observer} from 'mobx-react-lite';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const SearchBar = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();

  const componentStyles = styles();
  const navigation = useNavigation();
  const [isActiveSearchType, setIsActiveSearchType] = useState(2);

  const [searchResult, setSearchResult] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [cousinus, setCousinus] = useState(null);
  const [searchStatus, setSearchStatus] = useState(false);
  const [isShowFilterModal, setIsShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dataLoad = [1, 2, 3, 4, 5];
  useEffect(() => {
    if (exploreStore.listCousinesData !== null) {
      setCousinus(exploreStore.listCousinesData);
    } else {
      setCousinus([]);
    }
  }, [exploreStore.listCousinesData]);

  useEffect(() => {
    if (exploreStore.recentSearch) {
      setRecentSearch(exploreStore.recentSearch);
    }
  }, [exploreStore.recentSearch]);

  const goToRestaurantPage = (id) => {
    exploreStore.setMerchantDetailId(id);
    navigation.navigate('RestaurantPage');
  };

  // useEffect(() => {
  //   if (searchString.length > 2) {
  //     const data = {
  //       search: searchString.toLowerCase(),
  //       status: isActiveSearchType,
  //     };
  //     exploreStore.getSearchList(data);
  //   }
  // }, [searchString, isActiveSearchType]);

  useEffect(() => {
    if (exploreStore.searchData) {
      setSearchResult(exploreStore.searchData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setSearchResult([]);
    }
  }, [exploreStore.searchData]);

  const handleShowFilterModal = () => {
    setIsShowFilterModal(!isShowFilterModal);
  };

  const handleSearchSrting = (text) => {
    if (text.length > 0) {
      const data = {
        search: text?.toLowerCase(),
        status: isActiveSearchType,
      };
      setIsLoading(true);
      exploreStore.getSearchList(data);
    } else {
      exploreStore.getSearchListFailed(null);
      setSearchResult([]);
      setIsLoading(false);
    }
  };
  const goToCousines = (id, name) => {
    // exploreStore.setRouterFilter('Recommended for you', 'mostLiked');

    navigation.navigate('Cousines', {idCousines: id, nameCousines: name});
    // navigation.navigate('ExploreMenuDetail');
  };

  const handleSearchTypeActive = (id) => {
    setSearchResult([]);
    setIsActiveSearchType(id);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const searchType = [
    {
      id: 2,
      title: 'Restaurant',
    },
    {
      id: 1,
      title: 'Dishes',
    },
  ];

  const NavigatorBar = () => {
    return (
      <HStack
        style={{
          justifyContent: 'space-between',
        }}>
        {route?.name === 'Search' ? (
          <View
            style={{
              width: CustomSpacing(24),
            }}
          />
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={CloseOutlineIcon}
              style={componentStyles.imgBackIcon}
            />
          </TouchableOpacity>
        )}

        <Text style={[Fonts.subhead]}>{t('search')}</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  return (
    <VStack style={componentStyles.searchBarContainer}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      <Spacer height={CustomSpacing(16)} />
      {/* ------ Search Bar ------ */}
      <VStack>
        <HStack
          style={{
            backgroundColor: Colors.neutral30,
            paddingHorizontal: CustomSpacing(16),
            borderRadius: Rounded.xl,
            justifyContent: 'space-between',
          }}>
          <HStack style={{color: Colors.neutral70}}>
            <FastImage
              source={SearchOutlineIcon}
              style={componentStyles.imgSearchOutlineIcon}
            />
            <Spacer width={CustomSpacing(8)} />
            <TextInput
              placeholder={
                isActiveSearchType === 2
                  ? 'Enter restaurant name'
                  : 'Enter dish name'
              }
              style={{
                ...Fonts.labelSemiBold,
                color: Colors.neutral70,
                height: CustomSpacing(50),
              }}
              underlineColorAndroid="transparent"
              // value={searchString}
              // onChangeText={handleSearchSrting}
              onChangeText={_.debounce((e) => handleSearchSrting(e), 500)}
              autoFocus={true}
            />
          </HStack>
          {/* <TouchableOpacity activeOpacity={0.8} onPress={handleShowFilterModal}>
            <FastImage
              source={FilterIcon}
              style={componentStyles.imgFilterIcon}
            />
          </TouchableOpacity> */}
        </HStack>
        <Spacer height={CustomSpacing(8)} />
        {/* ------ Search Type ------ */}
        <HStack>
          <HStack>
            {searchType.map((item) => (
              <TouchableOpacity
                style={{color: Colors.neutral70}}
                key={`searchType-${item.id}`}
                activeOpacity={0.8}
                onPress={() => handleSearchTypeActive(item.id)}>
                <VStack
                  style={[
                    componentStyles.containerSearchType,
                    {
                      color: Colors.neutral70,
                      backgroundColor:
                        isActiveSearchType === item.id
                          ? Colors.supportMain
                          : Colors.neutral10,
                      borderWidth: isActiveSearchType === item.id ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.captionM,
                      {
                        color:
                          isActiveSearchType === item.id
                            ? Colors.neutral90
                            : Colors.neutral80,
                      },
                    ]}>
                    {item.title}
                  </Text>
                </VStack>
              </TouchableOpacity>
            ))}
          </HStack>
        </HStack>
        <Spacer height={CustomSpacing(8)} />
        {/* ------ searchString.length === 0 ------ */}
        {isLoading ? (
          <VStack style={componentStyles.containerRestaurantDetail}>
            {dataLoad?.map((v, i) => {
              return (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    height: '100%',
                  }}>
                  <VStack>
                    <ContentLoader
                      speed={2}
                      width={400}
                      height={460}
                      viewBox="0 0 400 460"
                      backgroundColor="#f3f3f3"
                      foregroundColor="#ecebeb">
                      <Rect
                        x="179"
                        y="189"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="178"
                        y="210"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="-18"
                        y="182"
                        rx="0"
                        ry="0"
                        width="177"
                        height="104"
                      />
                      <Rect
                        x="179"
                        y="41"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="-18"
                        y="34"
                        rx="0"
                        ry="0"
                        width="177"
                        height="104"
                      />
                      <Rect
                        x="179"
                        y="62"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="181"
                        y="323"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="180"
                        y="344"
                        rx="2"
                        ry="2"
                        width="140"
                        height="10"
                      />
                      <Rect
                        x="-16"
                        y="316"
                        rx="0"
                        ry="0"
                        width="177"
                        height="104"
                      />
                    </ContentLoader>
                  </VStack>
                </ScrollView>
              );
            })}
          </VStack>
        ) : (
          <>
            {searchResult.length === 0 && (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    height: '100%',
                  }}>
                  {/* ------ Recent Search ------ */}
                  <VStack>
                    <Text style={[Fonts.bodySemiBold]}>
                      {t('hRecentSearch')}
                    </Text>
                    <HStack style={{flexWrap: 'wrap'}}>
                      {recentSearch.length > 0 &&
                        recentSearch.map((item, index) => (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleSearchSrting(item)}
                            key={`recent-type-${index}`}>
                            <HStack style={componentStyles.containerRecentType}>
                              <Text style={[Fonts.captionM]}>{item}</Text>
                              <Spacer width={CustomSpacing(4)} />
                            </HStack>
                          </TouchableOpacity>
                        ))}
                    </HStack>
                  </VStack>
                  <Spacer height={CustomSpacing(8)} />
                  {/* ------ Trending Search ------ */}
                  {/* <VStack>
                <Text style={[Fonts.bodySemiBold]}>Trending search</Text>
                <HStack style={{flexWrap: 'wrap'}}>
                  {trendingSearchData.map((item, index) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={`trending-search-${index}`}>
                      <HStack style={componentStyles.containerTrendingSearch}>
                        <Text style={[Fonts.captionM]}>{item}</Text>
                        <Spacer width={CustomSpacing(4)} />
                      </HStack>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </VStack> */}
                  <Spacer height={CustomSpacing(8)} />
                  {/* ------ Search in cuisines ------ */}
                  <VStack>
                    <Text style={[Fonts.bodySemiBold]}>
                      {t('hSearchCuisines')}
                    </Text>
                    <HStack
                      style={{
                        flexWrap: 'wrap',
                      }}>
                      {cousinus?.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => goToCousines(item.id, item.name)}>
                          <VStack
                            key={`cuisine-type-${index}`}
                            style={componentStyles.containerSearchInCuisines}>
                            <FastImage
                              source={{
                                uri: item?.path,
                              }}
                              style={componentStyles.imgCuisine}
                            />
                            <Spacer height={CustomSpacing(4)} />
                            <Text
                              style={[Fonts.headlineM, {textAlign: 'center'}]}>
                              {item?.name}
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                      ))}
                    </HStack>
                  </VStack>
                  <Spacer height={CustomSpacing(8)} />
                </ScrollView>
              </>
            )}
            {/* ------ searchString.length > 0 && isActiveSearchType === Restaurant ------ */}
            {searchResult.length > 0 && isActiveSearchType === 2 && (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    height: '100%',
                    zIndex: -10,
                  }}>
                  {/* ------  Restaurant Detail ------ */}
                  {searchResult.map((item, index) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        exploreStore.setRecentSearch(item.name);
                        goToRestaurantPage(item.id);
                      }}
                      style={componentStyles.containerRestaurantDetail}
                      key={`restaurant-list-${index}`}>
                      <Spacer height={CustomSpacing(16)} />
                      <HStack>
                        <FastImage
                          source={{
                            uri: item?.pictures?.[0]?.path,
                          }}
                          style={componentStyles.imgRestaurant}
                          resizeMode="cover">
                          <HStack
                            style={componentStyles.restaurantRatingContainer}>
                            {item?.ratings == null ? null : (
                              <Text style={[Fonts.captionSSemiBold]}>
                                {item?.ratings === null ? '-' : item?.ratings}
                              </Text>
                            )}

                            <Spacer width={CustomSpacing(4)} />
                            <FastImage
                              source={StarIcon}
                              style={componentStyles.imgStarIcon}
                            />
                          </HStack>
                        </FastImage>
                        <Spacer width={CustomSpacing(8)} />
                        <VStack
                          style={{
                            alignSelf: 'flex-start',
                          }}>
                          <Text style={[Fonts.headlineM]}>{item?.name}</Text>
                          <Text style={[Fonts.captionS]}>
                            {item?.partnerstypes_name}
                          </Text>
                          {item?.marketing !== null && (
                            <HStack>
                              <FastImage
                                source={TagIcon}
                                style={componentStyles.imgTagIcon}
                                resizeMode="contain"
                              />
                              <Spacer width={CustomSpacing(4)} />
                              {item?.marketing?.[0]?.discount_type === 1 ? (
                                <Text style={[Fonts.labelSemiBold]}>
                                  {`${
                                    item?.marketing?.[0]?.discount_amount
                                  }% off up to ${Numbro.formatCurrency(
                                    item?.marketing?.[0]?.max_transaction,
                                  )}`}
                                </Text>
                              ) : (
                                <Text style={[Fonts.labelSemiBold]}>
                                  {`Cut off up to ${Numbro.formatCurrency(
                                    item?.marketing?.[0]?.discount_amount,
                                  )}`}
                                </Text>
                              )}
                            </HStack>
                          )}
                        </VStack>
                      </HStack>
                      <Spacer height={CustomSpacing(12)} />
                      {/* ------  Restaurant Dish Detail ------ */}
                      <VStack>
                        <Text style={[Fonts.headlineM]}>
                          Related dishes from restaurant
                        </Text>
                        <Spacer height={CustomSpacing(8)} />
                        <HStack>
                          {item?.products?.map((e, i) => (
                            <HStack key={`dishes-data-${i}`}>
                              <FastImage
                                source={{
                                  uri: e.productspictures.path,
                                }}
                                style={componentStyles.imgRestaurantDish}
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
                                      width: dimensions.screenWidth * 0.2,
                                    },
                                  ]}>
                                  {e.name}
                                </Text>
                                <HStack>
                                  <Text style={[Fonts.captionS]}>
                                    {e.dishSold} sold
                                  </Text>
                                  <Spacer width={CustomSpacing(4)} />
                                  <Text style={[Fonts.captionS]}>
                                    {e.dishLike} likes
                                  </Text>
                                </HStack>
                                <Text style={[Fonts.captionMSemiBold]}>
                                  {Numbro.formatCurrency(
                                    e.productsprices.price,
                                  )}
                                </Text>
                              </VStack>
                              <Spacer width={CustomSpacing(12)} />
                            </HStack>
                          ))}
                        </HStack>
                      </VStack>
                    </TouchableOpacity>
                  ))}
                  <Spacer height={dimensions.screenWidth * 0.5} />
                </ScrollView>
              </>
            )}
            {/* ------ searchString.length > 0 && isActiveSearchType === Dishes ------ */}
            {searchResult.length > 0 && isActiveSearchType === 1 && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={componentStyles.containerDishResult}
                style={{
                  flex: 1,
                  paddingBottom: CustomSpacing(520),
                }}>
                {/* ------ Dish Detail ------ */}
                {searchResult.length > 0 &&
                  searchResult.map((item, index) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        exploreStore.setRecentSearch(item.name);
                        goToRestaurantPage(item.merchants_id);
                      }}
                      style={[
                        {
                          marginRight: index % 2 === 0 ? CustomSpacing(8) : 0,
                        },
                        componentStyles.containerDishResultItem,
                      ]}
                      key={`dishResult-${index}`}>
                      <VStack>
                        <FastImage
                          source={{
                            uri: item?.productspictures?.path,
                          }}
                          style={componentStyles.imgDishResult}
                          resizeMode="cover">
                          <HStack style={componentStyles.dishRatingContainer}>
                            {item?.rating?.likes > 0 ? (
                              <Text
                                style={[
                                  Fonts.captionSSemiBold,
                                  {color: Colors.neutral10},
                                ]}>
                                {item?.rating?.likes}
                              </Text>
                            ) : null}
                            <Spacer width={CustomSpacing(4)} />
                            <FastImage
                              source={LikeIcon}
                              style={componentStyles.imgStarIcon}
                            />
                          </HStack>
                        </FastImage>
                        <Text
                          style={[
                            Fonts.bodySemiBold,
                            {
                              maxWidth: dimensions.screenWidth * 0.3,
                            },
                          ]}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                        <HStack>
                          <Text style={[Fonts.labelSemiBold]}>
                            {Numbro.formatCurrency(item?.productsprices?.price)}
                          </Text>
                          <Spacer width={CustomSpacing(4)} />
                          {item?.productsprices?.discount_type !== 0 && (
                            <HStack
                              style={componentStyles.discountTextContainer}>
                              <Text
                                style={[
                                  Fonts.captionS,
                                  componentStyles.discountText,
                                ]}>
                                {Numbro.formatCurrency(
                                  item?.productsprices?.price -
                                    item?.productsprices?.discount_price,
                                )}
                              </Text>
                              <Spacer width={CustomSpacing(4)} />
                              <FastImage
                                source={TagIcon}
                                style={componentStyles.imgTagDiscountIcon}
                              />
                            </HStack>
                          )}
                        </HStack>
                        <Text
                          numberOfLines={1}
                          style={[
                            Fonts.captionS,
                            {
                              maxWidth: dimensions.screenWidth * 0.3,
                            },
                          ]}>
                          {item?.productstags?.map((e, i) => e.name).join(', ')}
                        </Text>
                        <View style={componentStyles.separator} />
                        <HStack>
                          <FastImage
                            source={{
                              uri: item?.path,
                            }}
                            style={componentStyles.imgLogoRestaurant}
                            resizeMode="cover"
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <Text
                            style={[
                              Fonts.headlineM,
                              {maxWidth: CustomSpacing(70)},
                            ]}
                            numberOfLines={2}>
                            {item?.merchantsname}
                          </Text>
                        </HStack>
                      </VStack>
                      {(index + 1) % 2 !== 0 && (
                        <Spacer width={CustomSpacing(16)} />
                      )}
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}
            {searchResult.length === 0 && (
              <VStack
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Spacer height={CustomSpacing(50)} />

                <FastImage
                  source={SearchOutlineIcon}
                  style={{
                    width: dimensions.screenWidth * 0.2,
                    height: dimensions.screenWidth * 0.2,
                  }}
                />
                <Spacer height={CustomSpacing(30)} />
                <Text
                  style={[
                    Fonts.label,
                    {
                      textAlign: 'center',
                      width: dimensions.screenWidth * 0.7,
                    },
                  ]}>
                  Hmm sorry we couldn’t find it.
                </Text>
              </VStack>
            )}
          </>
        )}
      </VStack>
      <FilterModal showing={isShowFilterModal} close={handleShowFilterModal} />
    </VStack>
  );
});

export default SearchBar;
