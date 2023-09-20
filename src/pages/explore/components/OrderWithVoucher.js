import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {LikeIcon, OrderVoucherBg, StarIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from '../Explore.style';

const OrderWithVoucher = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const recomendData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const [voucherData, setVoucherData] = useState([]);

  useEffect(() => {
    if (exploreStore?.listExplorePromoData !== null) {
      setVoucherData(exploreStore?.listExplorePromoData.slice(0, 10));
    }
  }, [exploreStore?.listExplorePromoData]);

  const goToExploreMenuDetail = async () => {
    if (await CekUserToken()) {
      exploreStore.setRouterFilter('Order with voucher', 'normal');
      navigation.navigate('ExploreMenuDetail');
    } else {
      null;
    }
  };

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

  const goToRestaurantPage = async (id) => {
    if (await CekUserToken()) {
      exploreStore.setMerchantDetailId(id);
      navigation.navigate('RestaurantPage');
    } else {
      null;
    }
  };

  const renderVoucherItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToRestaurantPage(item.id)}
        style={[
          {
            marginLeft: index === 0 ? CustomSpacing(150) : CustomSpacing(8),
            marginRight:
              index === recomendData.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerOrderVoucherCard,
        ]}>
        <FastImage
          source={{
            uri: `${item?.pictures?.[0]?.path}`,
          }}
          style={componentStyles.imgFoodVoucher}
          resizeMode="cover">
          <HStack style={componentStyles.containerTagPromotion}>
            <Text style={[Fonts.captionS, {color: Colors.neutral10}]}>
              {t('promotion')}
            </Text>
          </HStack>
        </FastImage>
        <Spacer height={CustomSpacing(8)} />
        <Text
          style={[Fonts.headlineM, {maxWidth: CustomSpacing(136)}]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item?.name}
        </Text>
        <Spacer height={CustomSpacing(8)} />
        <HStack
          style={{
            justifyContent: 'space-between',
          }}>
          <Text
            style={[
              Fonts.captionSSemiBold,
            ]}>{`${item?.ratings}+ ratings`}</Text>
          <HStack style={componentStyles.containerRatingVoucher}>
            <Text style={[Fonts.captionSSemiBold]}>{item?.ratings}</Text>
            <Spacer width={CustomSpacing(4)} />
            <FastImage source={StarIcon} style={componentStyles.imgStarIcon} />
          </HStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  return (
    <VStack>
      <HStack style={componentStyles.titleRecomended}>
        <VStack>
          <Text style={[Fonts.headlineL]}>{t('orderWithVoucher')}</Text>
          <Text style={[Fonts.captionM]}>{t('voucherFromRestaurant')}</Text>
        </VStack>
        <Button
          label={t('seeAll')}
          type="supportOpacity"
          size="xsmall"
          onPress={goToExploreMenuDetail}
          disabled={exploreStore.listExploreLoading}
        />
      </HStack>
      <FastImage
        source={OrderVoucherBg}
        style={componentStyles.imgVoucherBg}
        resizeMode={'contain'}>
        <FlatList
          data={voucherData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderVoucherItem}
          keyExtractor={(item, index) => `voucher-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
        />
      </FastImage>
    </VStack>
  );
});

export default OrderWithVoucher;
