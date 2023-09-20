import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {LikeIcon, OrderMostLikedBg, TagIcon, StarIcon} from '@assets';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from '../Explore.style';

const TopRated = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const recomendData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const [TopRateData, setTopRate] = useState([]);

  useEffect(() => {
    if (exploreStore?.listExploreHayuqersData !== null) {
      setTopRate(exploreStore?.listExploreHayuqersData.slice(0, 10));
    }
  }, [exploreStore?.listExploreHayuqersData]);

  const goToExploreMenuDetail = async (id) => {
    if (await CekUserToken()) {
      exploreStore.setRouterFilter('Top rated', 'normal');
      navigation.navigate('ExploreMenuDetail');
    } else {
      null;
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

  const renderReorderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToRestaurantPage(item.id)}
        style={[
          {
            marginVertical: CustomSpacing(8),
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === TopRateData.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerOrderVoucherCard,
        ]}>
        <FastImage
          source={{
            uri: `${item?.pictures?.[0]?.path}`,
          }}
          style={componentStyles.imgFoodVoucher}
          resizeMode="cover"
        />
        <Spacer height={CustomSpacing(8)} />
        <Text
          style={[Fonts.headlineM, {maxWidth: CustomSpacing(136)}]}
          numberOfLines={1}>
          {item?.name}
        </Text>
        <Spacer height={CustomSpacing(8)} />
        {item?.ratings && (
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <Text style={[Fonts.captionSSemiBold]}>{`${
              item?.ratings ?? '-'
            }+ ratings`}</Text>

            <HStack style={componentStyles.containerRatingVoucher}>
              <Text style={[Fonts.captionSSemiBold]}>
                {item?.ratings ?? '-'}
              </Text>
              <Spacer width={CustomSpacing(4)} />
              <FastImage
                source={StarIcon}
                style={componentStyles.imgStarIcon}
              />
            </HStack>
          </HStack>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <VStack>
      <HStack style={componentStyles.titleRecomended}>
        <VStack>
          <Text style={[Fonts.headlineL]}>{t('topRatedHayuqer')}</Text>
        </VStack>
        <Button
          label={t('seeAll')}
          type="supportOpacity"
          size="xsmall"
          onPress={goToExploreMenuDetail}
          disabled={exploreStore.listExploreLoading}
        />
      </HStack>
      <FlatList
        style={{
          paddingVertical: CustomSpacing(8),
        }}
        data={TopRateData}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderReorderItem}
        keyExtractor={(item, index) => `reorder-${index.toString()}`}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
      />
    </VStack>
  );
});

export default TopRated;
