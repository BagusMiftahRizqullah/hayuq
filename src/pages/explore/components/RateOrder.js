import React, {useEffect, useState} from 'react';
import {Text, FlatList, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {StarIcon, ArrowRateOrder} from '@assets';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rating, AirbnbRating} from 'react-native-ratings';
import styles from '../Explore.style';

const RateOrder = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {exploreStore, historyStore, authStore} = useStores();
  const componentStyles = styles();
  const [HistoryData, setHistoryData] = useState([]);

  const starList = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (exploreStore.listHistoryData !== null && exploreStore.listHistoryData) {
      const data = exploreStore.listHistoryData.filter((item) => {
        return item.transactions?.status === 6;
      });
      setHistoryData(data);
    }
  }, [exploreStore.listHistoryData]);

  const goToDetail = async (id_trx) => {
    if (await CekUserToken()) {
      historyStore.setHistoryDetailTransactionId(id_trx);
      navigation.navigate('HistoryDetail');
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

  const renderRateOrder = ({item, index}) => {
    return (
      <VStack
        style={[
          {
            marginVertical: CustomSpacing(8),
            marginLeft: index === 0 ? CustomSpacing(16) : CustomSpacing(8),
            marginRight:
              index === HistoryData.length - 1 ? CustomSpacing(16) : 0,
          },
          componentStyles.containerRateOrder,
        ]}>
        <Text style={[Fonts.labelSemiBold]}>{t('rateYourOrder')}</Text>
        <Spacer height={CustomSpacing(12)} />
        <HStack>
          <FastImage
            source={{
              uri: item?.transactionsaddress?.merchants?.pictures?.[0]['path'],
            }}
            style={componentStyles.imgIconOrder}
          />
          <Spacer width={CustomSpacing(8)} />
          <VStack>
            <Text style={[Fonts.subhead]}>
              {item?.transactionsaddress?.merchants?.name}
            </Text>
            <HStack>
              <Text
                style={[
                  Fonts.labelSemiBold,
                  {
                    color: Colors.secondaryMain,
                  },
                ]}>
                {t('giveRating')}
              </Text>
              <Spacer width={CustomSpacing(8)} />
              <TouchableOpacity
                onPress={() => goToDetail(item.transactions?.id)}>
                <FastImage
                  source={ArrowRateOrder}
                  style={componentStyles.imgArrowOrder}
                />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </HStack>
        <View
          style={{
            borderBottomColor: Colors.neutral30,
            borderBottomWidth: 1,
            marginTop: CustomSpacing(16),
            marginBottom: CustomSpacing(16),
          }}
        />
        <HStack>
          <Text style={[Fonts.labelSemiBold]}>{t('rateTheDriver')}</Text>
          <Spacer width={CustomSpacing(8)} />
          <HStack>
            <Rating
              readonly={true}
              isDisabled={true}
              defaultRating={0}
              startingValue={0}
              ratingColor="#FFD202"
              ratingBackgroundColor="#EDEDED"
              ratingCount={5}
              imageSize={36}
              style={{paddingVertical: 10}}
            />
          </HStack>
          <Spacer width={CustomSpacing(4)} />
        </HStack>
      </VStack>
    );
  };

  return (
    <VStack>
      <Spacer height={CustomSpacing(23)} />
      <FlatList
        data={HistoryData}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderRateOrder}
        keyExtractor={(item, index) => `myorder-${index.toString()}`}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={5}
        windowSize={10}
      />
    </VStack>
  );
});

export default RateOrder;
