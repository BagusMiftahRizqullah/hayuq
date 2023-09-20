import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {StarIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from '../Explore.style';

const Reorder = observer(() => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const recomendData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const navigation = useNavigation();
  const {exploreStore} = useStores();
  const [reorderData, setReorderData] = useState([]);

  useEffect(() => {
    if (exploreStore?.listExploreReorderData !== null) {
      setReorderData(exploreStore?.listExploreReorderData.slice(0, 10));
    }
  }, [exploreStore?.listExploreReorderData]);

  const goToExploreMenuDetail = async () => {
    if (await CekUserToken()) {
      exploreStore.setRouterFilter('Order Again', 'reorder');
      navigation.navigate('ExploreMenuDetail');
    } else {
      null;
    }
  };

  const goToFoodDetail = async (id) => {
    if (await CekUserToken()) {
      exploreStore.setMerchantDetailId(data.merchants_id);
      exploreStore.setProductDetail(data);
      navigation.navigate('RestaurantPage');
      navigation.navigate('FoodDetails');
    } else {
      null;
    }
  };

  const renderReorderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToFoodDetail(item)}
        style={[
          {
            marginVertical: CustomSpacing(8),
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === reorderData.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerOrderVoucherCard,
        ]}>
        <FastImage
          source={{
            uri: item?.productspictures?.path,
          }}
          style={componentStyles.imgFoodVoucher}
          resizeMode="cover"
        />
        <Spacer height={CustomSpacing(8)} />
        <Text style={[Fonts.headlineM]} maxNumberOfLines={1}>
          {item?.name}
        </Text>
        <Spacer height={CustomSpacing(8)} />
        <HStack
          style={{
            justifyContent: 'space-between',
          }}>
          <Text style={[Fonts.captionSSemiBold]}>{`${
            item?.ratings ? item?.ratings : ''
          } ratings`}</Text>
          <HStack style={componentStyles.containerRatingVoucher}>
            <Text style={[Fonts.captionSSemiBold]}>{`${
              item?.ratings ? item?.ratings : ''
            }`}</Text>
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
          <Text style={[Fonts.headlineL]}>{t('yuqReorder')}</Text>
          <Text style={[Fonts.captionM]}>{t('chooseFoodReorder')}</Text>
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
        data={reorderData}
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

export default Reorder;
