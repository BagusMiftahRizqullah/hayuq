import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {LikeIcon, OrderMostLikedBg, TagIcon, ShopIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import Numbro from '@utils/numbro';
import {dimensions} from '@config/Platform.config';
import styles from '../Explore.style';

const MostLiked = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const [likeData, setLikeData] = useState([]);

  useEffect(() => {
    if (exploreStore.listExploreLikeData !== null) {
      setLikeData(exploreStore.listExploreLikeData.slice(0, 10));
    }
  }, [exploreStore.listExploreLikeData]);

  const goToExploreMenuDetail = async () => {
    if (await CekUserToken()) {
      exploreStore.setRouterFilter('Most liked food', 'mostLiked');
      navigation.navigate('ExploreMenuDetail');
    } else {
      null;
    }
  };

  const goToFoodDetail = async (data) => {
    await exploreStore.setMerchantDetailId(data?.merchants_id);
    await exploreStore.setProductDetail(data);
    if (await CekUserToken()) {
      await navigation.navigate('RestaurantPage');
      await navigation.navigate('FoodDetails');
    } else {
      return null;
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
  const renderMostLikedItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToFoodDetail(item)}
        style={[
          {
            marginLeft: index === 0 ? CustomSpacing(150) : CustomSpacing(8),
            marginRight: index === likeData?.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerMostLikedCard,
        ]}>
        <FastImage
          source={{
            uri: `${item?.productspictures?.path}`,
          }}
          style={componentStyles.imgMostLikedFood}
          resizeMode="cover">
          <HStack style={componentStyles.containerLikeMostLiked}>
            {item?.rating?.likes > 0 ? (
              <Text style={[Fonts.captionSSemiBold, {color: Colors.neutral10}]}>
                {item?.rating?.likes}
              </Text>
            ) : null}
            <Spacer width={CustomSpacing(4)} />
            <FastImage source={LikeIcon} style={componentStyles.imgLikeIcon} />
          </HStack>
        </FastImage>
        <Spacer height={CustomSpacing(8)} />
        <Text
          style={[
            Fonts.headlineM,
            {
              maxWidth: dimensions.screenWidth * 0.3,
            },
          ]}
          numberOfLines={1}>
          {item?.name}
        </Text>
        <HStack>
          <Text style={[Fonts.labelSemiBold]}>
            {`${Numbro.formatCurrency(item?.productsprices?.price)}`}
          </Text>
          <Spacer width={CustomSpacing(4)} />
          <HStack style={{maxWidth: CustomSpacing(18)}}>
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
                {item?.productsprices?.discount_price}
              </Text>
            )}
            <Spacer width={CustomSpacing(4)} />
            <FastImage source={TagIcon} style={componentStyles.imgTagIcon} />
          </HStack>
        </HStack>
        <Spacer height={CustomSpacing(4)} />
        {item?.merchantsdetails && (
          <>
            <HStack style={{maxWidth: CustomSpacing(103)}}>
              <FastImage
                source={ShopIcon}
                style={componentStyles.imgShopicon}
              />
              <Spacer width={CustomSpacing(4)} />
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[Fonts.captionS]}>
                {item?.merchantsdetails?.name}
              </Text>
            </HStack>
            <Spacer height={CustomSpacing(4)} />
          </>
        )}
        <VStack style={{maxWidth: CustomSpacing(108)}}>
          <Text
            style={[
              Fonts.captionS,
              {
                maxWidth: dimensions.screenWidth * 0.3,
              },
            ]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {item?.productstags?.map((v, i) => `${v.name},`)}
          </Text>
        </VStack>
        <Spacer height={CustomSpacing(4)} />
      </TouchableOpacity>
    );
  };

  return (
    <VStack>
      <HStack style={componentStyles.titleRecomended}>
        <VStack>
          <Text style={[Fonts.headlineL]}>{t('mostLikedFood')}</Text>
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
        source={OrderMostLikedBg}
        style={componentStyles.imgMostLikedBg}
        resizeMode={'cover'}>
        <FlatList
          data={likeData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderMostLikedItem}
          keyExtractor={(item, index) => `liked-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
        />
      </FastImage>
    </VStack>
  );
});

export default MostLiked;
