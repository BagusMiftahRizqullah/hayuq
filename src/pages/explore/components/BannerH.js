import React from 'react';
import {Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {StarIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Explore.style';

const BannerH = observer(() => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const recomendData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const navigation = useNavigation();
  const {exploreStore, authStore} = useStores();

  // const goToExploreMenuDetail = () => {
  //   navigation.navigate('ExploreMenuDetail');
  //   exploreStore.setRouterFilter('Order Again', 'reorder');
  // };

  const goToDetail = async (data) => {
    if (data.type_banner == 'TOPUP') {
      (await CekUserToken()) ? navigation.navigate('HistoryPayyuq') : null;
    } else if (data.type_banner == 'DANA') {
      (await CekUserToken()) ? navigation.navigate('HistoryDana') : null;
    } else if (data.type_banner == 'REFERAL') {
      (await CekUserToken()) ? navigation.navigate('Affiliate') : null;
    } else {
      return;
    }
  };
  const CekUserToken = async () => {
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    if (TOKEN !== null) {
      console.log('MEMILIKI TOKENN');
      authStore.setIsToken('IS_TOKEN');
      return true;
    } else {
      console.log('TIDAK ada TOKENN');
      authStore.setIsToken('NO_TOKEN');
      return false;
    }
  };
  const renderReorderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => goToDetail(item)}
        style={[
          {
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === exploreStore?.bannerDataLandscape.length - 1
                ? CustomSpacing(16)
                : 0,
          },
          componentStyles.containerimgBanner,
        ]}>
        <FastImage
          source={{uri: item.path}}
          style={componentStyles.imgBanner}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <VStack>
      <FlatList
        style={{
          paddingVertical: CustomSpacing(8),
        }}
        data={exploreStore?.bannerDataLandscape}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderReorderItem}
        keyExtractor={(item, index) => `banner-${index.toString()}`}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
      />
    </VStack>
  );
});

export default BannerH;
