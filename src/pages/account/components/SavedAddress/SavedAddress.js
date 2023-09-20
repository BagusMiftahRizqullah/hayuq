import React, {useMemo, useEffect} from 'react';
import {Text, TouchableOpacity, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {dimensions} from '@config/Platform.config';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  HomeIconSaved,
  OfficeIcon,
  ChevronRightIcon,
  SaveAddressBg,
  BackGreyIcon,
  LocationAddIcon,
  BookmarkIcon,
} from '@assets';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from './SavedAddress.style';

const SavedAddress = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const othersData = useMemo(
    () => exploreStore.addressListData?.usersaddress?.other,
    [exploreStore.addressListData],
  );

  const goToEditAddressForm = (data) => {
    navigation.navigate('EditAddressForm', {
      data,
    });
  };

  useEffect(() => {
    exploreStore.getAddressList();
  }, []);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToAddNewAddress = () => {
    navigation.navigate('AddNewAddress');
  };

  const listSavedAddress = [
    {
      id: 1,
      title: 'Home',
      icon: HomeIconSaved,
    },
    {
      id: 2,
      title: 'Office',
      icon: OfficeIcon,
    },
  ];

  return (
    <VStack
      style={{
        backgroundColor: Colors.neutral10,
      }}>
      {/* ------ Header------ */}
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={SaveAddressBg}
            style={componentStyles.imgProfileBg}
            resizeMode="contain"
          />
        </Animatable.View>
        <HStack style={componentStyles.containerNavigator}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgGoback}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
          <Text style={[Fonts.headlineL]}>{t('savedAddress')}</Text>
        </HStack>
      </VStack>
      <VStack style={{padding: CustomSpacing(16), height: '100%'}}>
        {/* ------ Favourite Data ------ */}
        <Text style={[Fonts.labelSemiBold]}>{t('favourite')}</Text>
        <Spacer height={CustomSpacing(12)} />
        <VStack style={componentStyles.containerMyAccount}>
          {listSavedAddress.map((item, index) => (
            <TouchableOpacity
              key={`favoriteList-${index}`}
              activeOpacity={0.8}
              onPress={goToAddNewAddress}>
              <HStack style={componentStyles.containerAccountList}>
                <HStack>
                  <FastImage
                    source={item.icon}
                    style={componentStyles.imgAccountList}
                  />
                  <Spacer width={CustomSpacing(14)} />
                  <Text style={[Fonts.label, {color: Colors.neutral80}]}>
                    {item.title}
                  </Text>
                </HStack>
                <FastImage
                  source={ChevronRightIcon}
                  style={componentStyles.imgChevrontList}
                />
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
        <Spacer height={CustomSpacing(20)} />
        {/* ------ Others------ */}
        <Text style={[Fonts.labelSemiBold]}>{t('others')}</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
          }}>
          {othersData?.map((item, index) => (
            <VStack key={`othersData-${index}`}>
              <VStack style={componentStyles.containerMyAccount}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    goToEditAddressForm(item);
                  }}>
                  <HStack style={componentStyles.containerAccountList}>
                    <HStack>
                      <FastImage
                        source={BookmarkIcon}
                        style={componentStyles.imgAccountList}
                      />
                      <Spacer width={CustomSpacing(14)} />
                      <VStack>
                        <Text style={[Fonts.label, {color: Colors.neutral80}]}>
                          {item.title}
                        </Text>
                      </VStack>
                    </HStack>
                    <FastImage
                      source={ChevronRightIcon}
                      style={componentStyles.imgChevrontList}
                    />
                  </HStack>
                </TouchableOpacity>
              </VStack>
              <Spacer height={CustomSpacing(12)} />
            </VStack>
          ))}
          <Spacer height={CustomSpacing(12)} />
          <VStack style={componentStyles.containerMyAccount}>
            <TouchableOpacity activeOpacity={0.8} onPress={goToAddNewAddress}>
              <HStack style={componentStyles.containerAccountList}>
                <HStack>
                  <FastImage
                    source={LocationAddIcon}
                    style={componentStyles.imgAccountList}
                  />
                  <Spacer width={CustomSpacing(14)} />
                  <VStack>
                    <Text style={[Fonts.label, {color: Colors.neutral80}]}>
                      {t('addNew')}
                    </Text>
                    <Text style={[Fonts.captionS, {color: Colors.neutral80}]}>
                      {t('setFavouritePlace')}
                    </Text>
                  </VStack>
                </HStack>
                <FastImage
                  source={ChevronRightIcon}
                  style={componentStyles.imgChevrontList}
                />
              </HStack>
            </TouchableOpacity>
          </VStack>
          <Spacer height={dimensions.screenWidth} />
        </ScrollView>
      </VStack>
    </VStack>
  );
});

export default SavedAddress;
