import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {LikeIcon, OrderMostLikedBg, TagIcon, ShopIcon} from '@assets';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from '../Explore.style';

const Popular = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const recomendData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const [popularData, setPopularata] = useState([]);

  useEffect(() => {
    if (exploreStore?.listExplorePopularsData !== null) {
      setPopularata(exploreStore?.listExplorePopularsData.slice(0, 10));
    }
  }, [exploreStore?.listExplorePopularsData]);

  const goToExploreMenuDetail = async () => {
    if (await CekUserToken()) {
      exploreStore.setRouterFilter('Popular in your area', 'popular');
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

  const renderPopularItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToRestaurantPage(item?.id)}
        style={[
          {
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === popularData?.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerOrderVoucherCard,
        ]}>
        <FastImage
          source={{
            uri: `${item?.pictures?.[0]?.path}`,
          }}
          style={componentStyles.imgFoodPopular}
          resizeMode="cover"
        />
        <Spacer height={CustomSpacing(8)} />
        <Text
          style={[Fonts.headlineM, {maxWidth: CustomSpacing(103)}]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {item?.name}
        </Text>

        {item?.total ? (
          <VStack>
            <Spacer height={CustomSpacing(25)} />
            <Text style={[Fonts.captionSSemiBold]}>
              {item?.total} {t('orders')}
            </Text>
          </VStack>
        ) : null}
      </TouchableOpacity>
    );
  };
  return (
    <VStack style={{marginVertical: CustomSpacing(23)}}>
      <VStack style={{backgroundColor: Colors.backgroundMain}}>
        <HStack style={componentStyles.titleRecomended}>
          <VStack>
            <Text style={[Fonts.headlineL]}>{t('popularInArea')}</Text>
            <Text
              numberOfLines={1}
              style={[
                Fonts.captionM,
                {maxWidth: dimensions.screenWidth * 0.7},
              ]}>
              {t('restaurantNearby')}
            </Text>
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
          data={popularData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderPopularItem}
          keyExtractor={(item, index) => `popular-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
        />
        <Spacer height={CustomSpacing(12)} />
      </VStack>
    </VStack>
  );
});

export default Popular;
