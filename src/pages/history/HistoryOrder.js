import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {useStores} from '@store/root.store';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  NoOrderIcon,
  PizzahutIcon,
  StarIcon,
  BackGreyIcon,
  james,
  wallet,
} from '@assets';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './History.style';
import {useTranslation} from 'react-i18next';

const HistoryOrder = observer(() => {
  const {t, i18n} = useTranslation();
  const {historyStore, routerStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [HistoryData, setHistoryData] = useState([]);

  const goToExplore = () => {
    navigation.navigate('Explore');
  };

  const goToDetail = (id_trx) => {
    historyStore.setHistoryDetailTransactionId(id_trx);
    navigation.navigate('HistoryDetail');
  };

  // const goToCall = useCallback(() => {
  //   routerStore.setOnCall(true);
  // }, [routerStore]);

  useEffect(() => {
    historyStore.getHistoryList();
  }, []);

  useEffect(() => {
    if (historyStore.listHistoryData !== null && historyStore.listHistoryData) {
      setHistoryData(historyStore.listHistoryData);
    }
  }, [historyStore.listHistoryData]);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <TouchableOpacity onPress={goBack}>
          <FastImage source={BackGreyIcon} style={componentStyles.imgGoback} />
        </TouchableOpacity>
        <Text style={[Fonts.subhead]}>{t('hHistoryOrder')}</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  const renderItem = ({item, index}) => {
    let statusText;
    let rateRestauran = false;
    let reviewFood = false;
    let cancelOrder = false;
    let haveReviewFood = false;

    return (
      <TouchableOpacity
        onPress={() => goToDetail(item.transactions?.id)}
        key={index}
        style={componentStyles.orderCard}>
        <VStack
          borderBottomWidth={0}
          borderBottomColor={Colors.neutral70}
          bottom={0}>
          <HStack>
            <FastImage
              source={{
                uri: item?.transactionsaddress?.merchants?.pictures?.[0][
                  'path'
                ],
              }}
              style={componentStyles.imgIconOrder}
              tintColor={cancelOrder ? Colors.neutral90 : null}
            />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <HStack
                style={{
                  justifyContent: 'space-between',
                  width: dimensions.screenWidth - CustomSpacing(127),
                }}>
                <Text style={[Fonts.subhead, componentStyles.textContainer]}>
                  {item?.transactionsaddress?.merchants?.name}
                </Text>
                <Text style={Fonts.label}>{`Rp.${item?.price?.total}`}</Text>
              </HStack>
              <HStack
                style={{
                  justifyContent: 'space-between',
                  width: dimensions.screenWidth - CustomSpacing(127),
                }}>
                <VStack>
                  <Text style={Fonts.captionM}>{t('wlFoodDelivery')}</Text>
                  <Text>{item?.transactions?.updated_at}</Text>
                </VStack>
                <HStack>
                  <FastImage
                    source={wallet}
                    style={componentStyles.imgRatingIcon}
                  />
                  <Spacer width={CustomSpacing(4)} />
                  <Text style={Fonts.captionM}>
                    {item.payments?.userswallets_id}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
            <Spacer width={CustomSpacing(32)} />
            <VStack>
              <Spacer width={CustomSpacing(8)} />
            </VStack>
          </HStack>

          <VStack>
            <HStack style={{alignSelf: 'flex-end'}}>
              <Button label="Reorder" type="supportOpacity" size="xsmall-s" />
            </HStack>
          </VStack>
        </VStack>
        <Spacer height={CustomSpacing(8)} />

        {/* Rate Restauran */}
        {rateRestauran && (
          <TouchableOpacity onPress={() => goToDetail(item)}>
            <HStack style={componentStyles.containerRateRestauran}>
              <Text style={[Fonts.labelSemiBold, {color: '#404040'}]}>
                {t('wlRateRestaurant')}
              </Text>
              <HStack>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#FFD202'}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FastImage
                    source={StarIcon}
                    style={componentStyles.imgRatingIconTouch}
                    tintColor={'#EDEDED'}
                  />
                </TouchableOpacity>
              </HStack>
            </HStack>
          </TouchableOpacity>
        )}

        {/* Review Food */}
        {reviewFood && (
          <HStack style={componentStyles.constinerReviewRestauran}>
            <HStack>
              <Text
                style={[Fonts.labelSemiBold, componentStyles.textContainer]}>
                5.0
              </Text>
              <FastImage
                source={StarIcon}
                style={componentStyles.imgRatingIconReviewFood}
                tintColor={'#FFD202'}
              />
            </HStack>
            <VStack
              style={{
                alignSelf: 'center',
              }}>
              <Text style={[Fonts.bodySemiBold]}>
                {item.my_rating_food > 0 ? t('wlYourReview') : t('wlNoReview')}
              </Text>
              <Text style={[Fonts.captionM]}>
                {item.my_rating_food > 0
                  ? item.food_review
                  : t('wlHowWasYourFood')}
              </Text>
            </VStack>
            <TouchableOpacity>
              <Icon name="arrowright" size={23} color={Colors.neutral80} />
            </TouchableOpacity>
          </HStack>
        )}

        {/* Order Cacelled */}
        <Spacer height={CustomSpacing(8)} />
        {cancelOrder == false && (
          <HStack
            style={{
              alignItems: 'center',
            }}>
            <FastImage
              source={james}
              style={[componentStyles.imgRatingIconTouch]}
              tintColor={'#EDEDED'}
            />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <HStack
                style={{
                  justifyContent: 'space-between',
                  width: dimensions.screenWidth - CustomSpacing(109),
                }}>
                <VStack>
                  <Text style={[Fonts.subhead, componentStyles.textContainer]}>
                    {item.transactionsaddress?.drivers?.driverdetails[0]?.name}
                  </Text>
                  <HStack>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgRatingIcon}
                      tintColor={'#FFD202'}
                    />
                    <Text style={Fonts.captionM}>5.0</Text>
                    {/* <Text
                      style={Fonts.captionM}>{` • ${item.driver_code}`}</Text> */}
                  </HStack>
                </VStack>

                <VStack>
                  <Text
                    style={[
                      Fonts.labelSemiBold,
                      componentStyles.textContainer,
                    ]}>
                    {t('wlYourRating')}
                  </Text>
                  <HStack>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgRatingIcon}
                      tintColor={'#FFD202'}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text>5.0</Text>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      {/* ------ OrderData------ */}
      {HistoryData.length > 0 && (
        <VStack
          style={{
            padding: CustomSpacing(16),
          }}>
          <FlatList
            onEndReached={() => historyStore.getHistoryList()}
            data={HistoryData}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            initialNumToRender={5}
            windowSize={10}
          />

          <Spacer height={CustomSpacing(16)} />
        </VStack>
      )}

      {/* ------ Empty Order------ */}
      {HistoryData.length === 0 && (
        <>
          <Spacer height={dimensions.screenWidth * 0.28} />
          <Animatable.View animation="bounceIn" delay={200}>
            <VStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                source={NoOrderIcon}
                style={componentStyles.imgBillIcon}
              />
              <Spacer height={CustomSpacing(16)} />
              <Text style={[Fonts.label, {textAlign: 'center'}]}>
                {t('wlNoOrder')}
              </Text>
              <Spacer height={CustomSpacing(40)} />
              <Button
                label="Let’s make an order"
                type="primary"
                size="medium"
                onPress={goToExplore}
              />
            </VStack>
          </Animatable.View>
        </>
      )}
    </VStack>
  );
});

export default HistoryOrder;
