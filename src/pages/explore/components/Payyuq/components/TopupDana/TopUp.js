import React, {useRef, useEffect, useState} from 'react';
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

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  MachineATMIcon,
  MobileIcon,
  CloseOutlineIcon,
  ChevronRightIcon,
} from '@assets';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import styles from './TopUp.style';

const TopUp = observer(() => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };
  const goToScreen = (source) => {
    navigation.navigate(source);
  };

  const methodList = [
    {
      id: 1,
      title: 'ATM',
      icon: MachineATMIcon,
      navigate: 'Atm',
    },
    {
      id: 2,
      title: 'Internet / Mobile Banking',
      icon: MobileIcon,
      navigate: 'MobileBanking',
    },
  ];

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgCloseIcon}
          />
        </TouchableOpacity>

        <Text style={[Fonts.subhead]}>Top Up</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      {/* ------ Payyuq Balance ------ */}
      <HStack style={componentStyles.balanceContainer}>
        <Text style={[Fonts.subhead]}>
          {`${t('yourPayyuqBalance')}: Rp 400.000`}
        </Text>
      </HStack>
      {/* ------ Top Up Method ------ */}
      <VStack
        style={{
          padding: CustomSpacing(16),
        }}>
        <Text style={[Fonts.labelSemiBold]}>{t('chooseTopupMethod')}</Text>
        <Spacer height={CustomSpacing(12)} />
        <VStack style={componentStyles.containerMethodList}>
          {methodList.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => goToScreen(item?.navigate)}>
              <VStack
                style={{
                  marginBottom: index === 0 ? CustomSpacing(12) : 0,
                }}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                  }}>
                  <HStack>
                    <FastImage
                      source={item.icon}
                      style={componentStyles.imgIconMethod}
                    />
                    <Spacer width={CustomSpacing(8)} />
                    <Text style={[Fonts.label]}>{item.title}</Text>
                  </HStack>
                  <FastImage
                    source={ChevronRightIcon}
                    style={componentStyles.imgChevronRight}
                  />
                </HStack>
              </VStack>
            </TouchableOpacity>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default TopUp;
