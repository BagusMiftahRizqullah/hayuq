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
import * as Animatable from 'react-native-animatable';
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
  NoOrderIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';

import styles from './ExploreMenuDetail/ExploreMenuDetail.style';

const Cousines = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const filterType = useMemo(
    () => exploreStore?.routerFilterType,
    [exploreStore.routerFilterType],
  );

  const componentStyles = styles();
  const navigation = useNavigation();
  const [searchString, setSearchString] = useState('');
  const [isShowFilterModal, setIsShowFilterModal] = useState(false);
  const [listData, setListData] = useState([]);
  const [Title, setTitle] = useState('Cousines');

  const [currentFilter, setCurrentFilter] = useState({
    sort: null,
    rating: null,
    other: null,
  });

  useEffect(() => {
    const ID_COUSINES = route?.params?.idCousines;
    const NAME_COUSINES = route?.params?.nameCousines;
    setTitle(NAME_COUSINES);
    exploreStore.getExploreListCousines(8, ID_COUSINES);
  }, []);

  const handleCurrentFilter = (filter) => {
    setCurrentFilter(filter);
  };

  useEffect(() => {
    if (exploreStore.listExploreDataCousines) {
      setListData(exploreStore.listExploreDataCousines);
    }
  }, [exploreStore.routerFilterTitle, exploreStore.listExploreDataCousines]);

  useEffect(() => {
    if (searchString.length > 0) {
      const filteredList = listData.filter((item) => {
        return item.name.toLowerCase().includes(searchString.toLowerCase());
      });
      setListData(filteredList);
    }
  }, [searchString]);

  const handleShowFilterModal = () => {
    setIsShowFilterModal(!isShowFilterModal);
  };

  const handleSearchSrting = useCallback(
    (text) => {
      setSearchString(text);
    },
    [searchString],
  );

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToRestaurantPage = (id) => {
    exploreStore.setMerchantDetailId(id);
    navigation.navigate('RestaurantPage');
  };

  const goToExploreMenuDetail = () => {
    navigation.navigate('ExploreMenuDetail');
    // exploreStore.setRouterFilter('Most liked food', 'mostLiked');
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
              resizeMode={FastImage.resizeMode.cover}>
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
              style={[Fonts.bodySemiBold, {maxWidth: CustomSpacing(120)}]}
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
                  uri: `${item?.merchants?.pictures[0]?.path}`,
                }}
                style={componentStyles.imgMerchantLogo}
                resizeMode="cover"
              />
              <Spacer width={CustomSpacing(8)} />
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[Fonts.headlineM, {maxWidth: CustomSpacing(70)}]}
                maxNumberOfLines={1}>
                {item?.merchants?.name}
              </Text>
            </HStack>
          </VStack>
          {(index + 1) % 2 !== 0 && <Spacer width={CustomSpacing(16)} />}
        </HStack>
      </TouchableOpacity>
    );
  };

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
          <Text style={[Fonts.headlineL]}>{Title}</Text>
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
              placeholder={`Search in ${Title}`}
              style={componentStyles.searchInput}
              underlineColorAndroid="transparent"
              value={searchString}
              onChangeText={handleSearchSrting}
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
        {exploreStore.listExploreLoading && (
          <VStack alignItems="center" justifyContent="center">
            <Spacer height={dimensions.screenWidth * 0.4} />
            <ActivityIndicator size="large" color={Colors.primaryMain} />
            <Spacer height={CustomSpacing(16)} />
            <Text style={[Fonts.captionS]}>Please wait ...</Text>
          </VStack>
        )}
        {!exploreStore.listExploreLoading && (
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
        )}
        {!exploreStore.listExploreLoading && listData?.length == 0 && (
          <>
            <Animatable.View animation="bounceIn" delay={200}>
              <VStack
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}>
                <FastImage
                  source={NoOrderIcon}
                  style={componentStyles.imgBillIcon}
                />
                <Spacer height={CustomSpacing(16)} />
                <Text style={[Fonts.label, {textAlign: 'center'}]}>
                  {t('wlNoData')}
                </Text>
                <Spacer height={CustomSpacing(256)} />
              </VStack>
            </Animatable.View>
          </>
        )}
      </>
      <FilterModal
        handleCurrentFilter={handleCurrentFilter}
        currentFilter={currentFilter}
        showing={isShowFilterModal}
        close={handleShowFilterModal}
      />
    </VStack>
  );
});

export default Cousines;
