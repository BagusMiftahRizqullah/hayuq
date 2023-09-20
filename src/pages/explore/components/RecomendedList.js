import React, {useState, useEffect} from 'react';
import {Text, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {LikeIcon, TagIcon, ShopIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Numbro from '@utils/numbro';

import styles from '../Explore.style';

const RecomendedList = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const [recomendedData, setRecomendedData] = useState([]);

  useEffect(() => {
    if (exploreStore.mainRecomendedData !== null) {
      setRecomendedData(exploreStore.mainRecomendedData.slice(0, 10));
    }
  }, [exploreStore.mainRecomendedData]);

  const goToExploreMenuDetail = async () => {
    if (await CekUserToken()) {
      navigation.navigate('ExploreMenuDetail');
      exploreStore.setRouterFilter('Recommended for you', 'mostLiked');
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

  const renderRecomendedItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => goToRestaurantPage(item.merchants_id)}
        style={[
          {
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === recomendedData?.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerRecomended,
        ]}>
        <FastImage
          source={{
            uri: item.productspictures.path,
          }}
          style={componentStyles.imgFoodRecomended}
          resizeMode="cover">
          <HStack>
            <HStack style={componentStyles.likeContainer}>
              {item.rating.likes > 0 ? (
                <Text
                  style={[Fonts.captionSSemiBold, {color: Colors.neutral10}]}>
                  {item.rating.likes}
                </Text>
              ) : null}

              <Spacer width={CustomSpacing(4)} />
              <FastImage
                source={LikeIcon}
                style={componentStyles.imgLikeIcon}
              />
            </HStack>
          </HStack>
        </FastImage>
        <Spacer height={CustomSpacing(8)} />
        <VStack>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[Fonts.headlineM, {width: CustomSpacing(132)}]}
            maxNumberOfLines={1}>
            {item.name}
          </Text>
          <HStack>
            <Text style={[Fonts.labelSemiBold]}>
              {item.productsprices.discount > 0 && item.productsprices.total
                ? Numbro.formatCurrency(item.productsprices.total)
                : Numbro.formatCurrency(item.productsprices.price)}
            </Text>
            <Spacer width={CustomSpacing(4)} />
            {item.productsprices.discount > 0 && (
              <HStack>
                <Text
                  style={[
                    Fonts.captionS,
                    {
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    },
                  ]}>
                  {Numbro.formatCurrency(item.productsprices.price)}
                </Text>
                <Spacer width={CustomSpacing(4)} />
                <FastImage
                  source={TagIcon}
                  style={componentStyles.imgTagIcon}
                />
              </HStack>
            )}
          </HStack>
        </VStack>
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
          <Text ellipsizeMode="tail" numberOfLines={1} style={[Fonts.captionS]}>
            {item.productstags.map((tag, index) => {
              return (
                <Text ellipsizeMode="tail" numberOfLines={1} key={index}>
                  {tag.name}
                  {index !== item.productstags?.length - 1 ? ', ' : ''}
                </Text>
              );
            })}
          </Text>
        </VStack>
      </TouchableOpacity>
    );
  };

  return (
    <VStack style={{flex: 1}}>
      <HStack style={componentStyles.titleRecomended}>
        <Text style={[Fonts.headlineL]}>{t('recomendedForYou')}</Text>
        <Button
          label={t('seeAll')}
          type="supportOpacity"
          size="xsmall"
          onPress={goToExploreMenuDetail}
        />
      </HStack>
      <HStack>
        <ScrollView></ScrollView>
      </HStack>
      <FlatList
        data={recomendedData}
        horizontal
        showsHorizontalScrollIndicator={true}
        renderItem={renderRecomendedItem}
        keyExtractor={(item, index) => `recomended-${index.toString()}`}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        initialNumToRender={10}
        windowSize={10}
      />
    </VStack>
  );
});

export default RecomendedList;
