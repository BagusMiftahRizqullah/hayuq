import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Platform,
  FlatList,
  SectionList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';

import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import {
  SearchOutlineIcon,
  CloseOutlineIcon,
  FilterIcon,
  ArrowDownIcon,
  TagIcon,
  StarIcon,
  LikeIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';

import styles from './RestaurantPage.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {Rating, AirbnbRating} from 'react-native-ratings';

const RestaurantPageDetail = observer(() => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();
  const {exploreStore} = useStores();
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantOpeningHours, setRestaurantOpeningHours] = useState(null);

  const ratingList = ['1', '2', '3', '4', '5'];

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Here is my favourite restaurant, you can check it out on Hayuq App',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of ' + result.activityType);
        } else {
          console.log('shared', result);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed', result);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    if (exploreStore.merchantDetailData) {
      setRestaurantData(exploreStore.merchantDetailData);
      setRestaurantOpeningHours(exploreStore.merchantDetailData.days.data);
    }
  }, [exploreStore.merchantDetailData]);

  const Navigator = () => {
    return (
      <HStack style={componentStyles.actionPosition}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={componentStyles.actionContainer}
          onPress={goBack}>
          <Icon name="close" size={18} color={Colors.neutral80} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onShare}
          style={componentStyles.actionContainer}>
          <Icon name="share" size={18} color={Colors.neutral80} />
        </TouchableOpacity>
      </HStack>
    );
  };

  const HeaderContainer = (data) => {
    const headerData = data.data;

    return (
      <VStack style={componentStyles.headerContainerRestaurant}>
        <FastImage
          source={{uri: headerData?.pictures[0].path}}
          style={componentStyles.imgAvatarDetail}
          resizeMode={FastImage.resizeMode.cover}
        />
        <VStack>
          <Spacer height={CustomSpacing(80)} />
          <TouchableOpacity activeOpacity={0.8}>
            <HStack
              paddingHorizontal={CustomSpacing(16)}
              justifyContent="space-between">
              <Text numberOfLines={1} style={[Fonts.titleMBold]}>
                {headerData.name}
              </Text>
            </HStack>
          </TouchableOpacity>
          <VStack paddingHorizontal={CustomSpacing(16)}>
            <Text numberOfLines={1} style={[Fonts.label]}>
              {headerData.description}
            </Text>
          </VStack>
          <VStack padding={CustomSpacing(16)}>
            <HStack justifyContent="space-between">
              <VStack alignItems="center">
                <Text
                  style={[
                    Fonts.h3,
                    {
                      fontWeight: 'bold',
                    },
                  ]}>
                  {headerData?.ratings?.avg ? headerData?.ratings?.avg : 0}
                </Text>
                <HStack>
                  <Rating
                    readonly={true}
                    isDisabled={true}
                    defaultRating={
                      headerData?.ratings?.avg ? headerData?.ratings?.avg : 0
                    }
                    startingValue={
                      headerData?.ratings?.avg ? headerData?.ratings?.avg : 0
                    }
                    ratingColor="#FFD202"
                    ratingBackgroundColor="#EDEDED"
                    ratingCount={5}
                    imageSize={18}
                    style={{paddingVertical: 10}}
                  />
                </HStack>
                <Spacer height={CustomSpacing(4)} />
                <Text style={[Fonts.label]}>{`${
                  headerData?.ratings?.avg ? headerData?.ratings?.avg : 0
                } ${t('hRatings')}`}</Text>
              </VStack>
              <View style={componentStyles.ratingSeparator} />
              <VStack>
                {headerData?.ratings?.total?.reverse().map((item, index) => {
                  return (
                    <HStack key={`${t('lhRatings')}-${item?.ratings}`}>
                      <Text style={[Fonts.captionM]}>{item?.ratings}</Text>
                      <Spacer width={CustomSpacing(8)} />
                      <Progress.Bar
                        color={Colors.primaryMain}
                        progress={item?.count}
                        width={dimensions.screenWidth * 0.4}
                      />
                    </HStack>
                  );
                })}
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  };

  return (
    <VStack style={componentStyles.restaurantContainer}>
      {restaurantData !== null ? (
        <VStack>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack>
              {/* Profile Picture */}
              <FastImage
                source={{uri: restaurantData?.pictures[1].path}}
                style={componentStyles.imgProfileBg}
              />
              {/* Navigator */}
              <Navigator />
            </VStack>
            <VStack>
              {/* Header */}
              <HeaderContainer data={restaurantData} />
              <Spacer height={dimensions.screenWidth * 0.6} />
              <Spacer height={CustomSpacing(16)} />
              <VStack style={componentStyles.contentContainer}>
                {/* Voucher */}
                <Spacer height={CustomSpacing(16)} />
                {/* Promo Item */}
                <VStack>
                  <Text style={[Fonts.headlineL]}>{t('wlAbout')}</Text>
                  <HStack>
                    <IconFontAwesome
                      name="clock"
                      size={15}
                      color={Colors.neutral90}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text style={[Fonts.bodySemiBold]}>
                      {t('wlOpeningHours')}
                    </Text>
                    <Spacer width={CustomSpacing(8)} />
                  </HStack>
                  {restaurantOpeningHours !== null &&
                    restaurantOpeningHours.map((item, index) => {
                      return (
                        <VStack
                          key={`opening-hours-${index}`}
                          marginLeft={CustomSpacing(24)}
                          marginBottom={CustomSpacing(8)}>
                          <Text style={[Fonts.labelSemiBold]}>{item.name}</Text>
                          <HStack>
                            <Text style={[Fonts.labelSemiBold]}>
                              {item.start} -
                            </Text>
                            <Text style={[Fonts.labelSemiBold]}>
                              {' '}
                              {item.end}
                            </Text>
                          </HStack>
                        </VStack>
                      );
                    })}
                </VStack>
                <View style={componentStyles.dashedSeparator} />
                <VStack>
                  <HStack>
                    <Icon
                      name="location-on"
                      size={15}
                      color={Colors.neutral90}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text style={[Fonts.bodySemiBold]}>{t('wlAddress')}</Text>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                  <VStack marginLeft={CustomSpacing(24)}>
                    <Text style={[Fonts.captionM]}>
                      {restaurantData?.address.address}
                    </Text>
                  </VStack>
                </VStack>
              </VStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </ScrollView>
        </VStack>
      ) : null}
    </VStack>
  );
});

export default RestaurantPageDetail;
