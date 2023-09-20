import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, TextInput, FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CloseOutlineIcon,
  VoucherInfo,
  VoucherCard,
  VoucherNotFound,
  EatYuq,
  TimerOrange,
} from '@assets';

import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';

import Numbro from '@utils/numbro';
import styles from './RestaurantPage.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';

const SearchVoucher = observer(({route}) => {
  const {checkout} = route.params;
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();

  const [restaurantFoodData, setRestaurantFoodData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [voucherSearch, setVoucherSearch] = useState([]);

  const [isActiveFilter, setActiveFilter] = useState(1);
  const [searchString, setSearchString] = useState('');

  const filterList = [
    {
      id: 1,
      title: 'All voucher',
    },
    {
      id: 2,
      title: 'Percentage discount',
    },
    {
      id: 3,
      title: 'Fix amount',
    },
  ];

  const handleSetActiveFilter = (id) => {
    let data = voucherData;
    if (id === 1) {
      data = data;
    } else if (id === 2) {
      data = data.filter((item) => item.options === 1);
    } else if (id === 3) {
      data = data.filter((item) => item.options === 2);
    }
    setVoucherSearch(data);
    setActiveFilter(id);
  };

  const handleRedeemVoucher = (item) => {
    if (item?.applied_id) {
      exploreStore.deleteVoucher(item.applied_id);
    } else {
      exploreStore.createVoucher(item._id, item.merchant_id);
    }
  };

  const handleSearchInput = (event) => {
    let search = event?.toString();
    setSearchString(search);
    search = search?.trim()?.toLowerCase();
    let data = voucherData;
    if (data?.length > 0) {
      data = data.filter(
        (item) =>
          item?.title?.toString()?.trim()?.toLowerCase()?.match(search) ||
          item?.discount_amount
            ?.toString()
            ?.trim()
            ?.toLowerCase()
            ?.match(search),
      );
    } else {
      data = [];
    }
    setVoucherSearch(data);
  };

  const goToFoodDetail = (data) => {
    exploreStore.setProductDetail(data);
    navigation.navigate('FoodDetails');
  };

  const goBack = useCallback(() => {
    if (checkout) {
      exploreStore.postOrderCheckoutDetail({
        merchants_id: exploreStore?.merchantDetailData?.id,
      });
    }
    navigation.goBack();
  }, []);

  useEffect(() => {
    if (exploreStore.createVoucherData && exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, [exploreStore.createVoucherData]);

  useEffect(() => {
    if (exploreStore.deleteVoucherResponse && exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, [exploreStore.deleteVoucherResponse]);

  useEffect(() => {
    if (exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, [exploreStore.merchantDetailId]);

  useEffect(() => {
    if (exploreStore?.merchantDetailData?.marketing?.length > 0) {
      let data = [];
      exploreStore.merchantDetailData.marketing.map((item) => {
        let newItem = {
          ...item,
          title:
            (item?.options === 1
              ? item.discount_amount + '%'
              : item.discount_amount) +
            ' up food up to ' +
            Numbro.nFormatter(item.max_transaction, 0),
        };
        data.push(newItem);
      });
      setVoucherData(data);
      setVoucherSearch(data);
    }
  }, [exploreStore?.merchantDetailData?.marketing]);

  // useEffect(() => {
  //   if (searchString.length > 0 && exploreStore.merchantDetailData) {
  //     let data = [];
  //     exploreStore.merchantDetailData?.categorys.map((item) => {
  //       item.products.map((product) => {
  //         if (merchantscategorys_id) {
  //           if (
  //             product.name
  //               .toLowerCase()
  //               .includes(
  //                 searchString.toLowerCase() &&
  //                   product.merchantscategorys_id === merchantscategorys_id,
  //               )
  //           ) {
  //             data.push(product);
  //           }
  //         } else {
  //           if (
  //             product.name.toLowerCase().includes(searchString.toLowerCase())
  //           ) {
  //             data.push(product);
  //           }
  //         }
  //       });
  //     });
  //     setRestaurantFoodData(data);
  //   } else {
  //     let data = [];
  //     exploreStore.merchantDetailData?.categorys.map((item) => {
  //       item.products.map((product) => {
  //         if (
  //           merchantscategorys_id &&
  //           product.merchantscategorys_id === merchantscategorys_id
  //         ) {
  //           data.push(product);
  //         } else if (!merchantscategorys_id) {
  //           data.push(product);
  //         }
  //       });
  //     });
  //     setRestaurantFoodData(data);
  //   }
  // }, [searchString]);

  const RenderSection = ({item, index}) => {
    return (
      <FastImage
        source={VoucherCard}
        style={componentStyles.imgVoucherCard}
        resizeMode={'contain'}>
        <VStack>
          <HStack style={[componentStyles.renderVoucherContainer]}>
            <FastImage
              source={EatYuq}
              style={componentStyles.imgVoucherEatyuq}
              resizeMode={'contain'}
            />
            <Spacer width={CustomSpacing(12)} />
            <VStack
              style={{
                width: dimensions.screenWidth - CustomSpacing(130),
              }}>
              <Text style={[Fonts.bodySemiBold]}>{item?.title ?? ''}</Text>
              <Text style={[Fonts.captionS]}>
                &#8226; Min. order{' '}
                {Numbro.nFormatter(item?.min_transaction ?? 0, 0)}
              </Text>
            </VStack>
            <Spacer height={CustomSpacing(12)} />
          </HStack>
          <HStack style={[componentStyles.bottomVoucherContainer]}>
            <HStack>
              <FastImage
                source={TimerOrange}
                style={componentStyles.imgVoucherTimer}
                resizeMode={'contain'}
              />
              <Spacer width={CustomSpacing(6)} />
              <Text style={[Fonts.captionM, {color: Colors.supportMain}]}>
                Expiring in {moment(new Date(item.end_date)).toNow(true)}
              </Text>
            </HStack>
            <Text
              onPress={() => handleRedeemVoucher(item)}
              style={[
                componentStyles.containerCard,
                Fonts.captionMSemiBold,
                {
                  color: item?.applied_id
                    ? Colors.neutral10
                    : Colors.primaryPressed,
                  backgroundColor: item?.applied_id
                    ? Colors.primaryPressed
                    : Colors.neutral10,
                },
              ]}>
              {item?.applied_id ? 'Applied' : 'Apply voucher'}
            </Text>
          </HStack>
        </VStack>
      </FastImage>
    );
  };

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgCloseIcon}
          />
        </TouchableOpacity>

        <Text style={[Fonts.subhead]}>Available Vouchers</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  return (
    <VStack style={componentStyles.searchFoodContainer}>
      <Spacer topSafeAreaHeight />
      {/* Header */}
      <NavigatorBar />
      <VStack style={componentStyles.headerContainer}>
        <HStack style={componentStyles.searchContainer}>
          <Icon name="search" size={16} color={Colors.neutral70} />
          <Spacer width={CustomSpacing(16)} />
          <TextInput
            style={componentStyles.searchInput}
            underlineColorAndroid="transparent"
            placeholder="Search voucher"
            allowClear
            value={searchString}
            onChangeText={(value) => handleSearchInput(value)}
          />
        </HStack>
        <Spacer height={CustomSpacing(16)} />
        <HStack>
          {filterList.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`filter-${index}`}
              onPress={() => handleSetActiveFilter(item.id)}>
              <HStack
                style={[
                  componentStyles.containerFilter,
                  {
                    borderColor:
                      isActiveFilter === item.id
                        ? Colors.supportMain
                        : Colors.neutral50,
                    backgroundColor:
                      isActiveFilter === item.id
                        ? Colors.supportMain
                        : Colors.neutral10,
                  },
                ]}>
                <Text
                  style={[
                    Fonts.captionMSemiBold,
                    {
                      color:
                        isActiveFilter === item.id
                          ? Colors.neutral10
                          : Colors.neutral90,
                    },
                  ]}>
                  {item.title}
                </Text>
                {/* <Spacer width={CustomSpacing(4)} />
              <FastImage
                source={item.active ? ChevronDownWhiteIcon : ArrowDownIcon}
                style={componentStyles.imgChevronDown}
              /> */}
              </HStack>
            </TouchableOpacity>
          ))}
        </HStack>
      </VStack>
      {voucherSearch.length > 0 ? (
        <FlatList
          data={voucherSearch}
          renderItem={RenderSection}
          keyExtractor={(item, index) => `promo-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
          ListHeaderComponent={
            <FastImage
              source={VoucherInfo}
              style={componentStyles.imgVoucherInfo}
              resizeMode={'contain'}
            />
          }
          contentContainerStyle={{paddingBottom: CustomSpacing(200)}}
        />
      ) : (
        <VStack
          style={{
            backgroundColor: Colors.backgroundSurface,
            height: dimensions.screenHeight,
            paddingVertical: CustomSpacing(100),
          }}>
          <FastImage
            source={VoucherNotFound}
            style={componentStyles.imgVoucherCard}
            resizeMode={'contain'}
          />
        </VStack>
      )}
    </VStack>
  );
});

export default SearchVoucher;
