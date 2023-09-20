import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  BackGreyIcon,
  ReceiptIcon,
  LogoPayyuq,
  PayyuqBg,
  PaymentMethodBg,
  ChevronRightIcon,
  TopUpIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';
import {useStores} from '@store/root.store';
import styles from './PaymentMethod.style';
import Numbro from '@utils/numbro';

const PaymentMethod = observer(() => {
  const {accountStore, exploreStore} = useStores();
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [myWallet, setMyWallet] = useState(0);
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (accountStore?.accountData?.userswallet?.amount !== null) {
      setMyWallet(accountStore?.accountData?.userswallet?.amount);
    }
  }, [accountStore?.accountData]);

  const goToTopUp = () => {
    navigation.navigate('HistoryPayyuq', {modalPayment: true});
  };

  const goToHistoryPayyuq = () => {
    navigation.navigate('HistoryPayyuq');
  };

  const paymentMethodList = [
    {
      id: 1,
      title: t('topUp'),
      icon: TopUpIcon,
      onPress: goToTopUp,
    },
    {
      id: 2,
      title: t('viewTransactionHistory'),
      icon: ReceiptIcon,
      onPress: goToHistoryPayyuq,
    },
  ];

  return (
    <VStack
      style={{
        height: '100%',
        backgroundColor: Colors.neutral10,
      }}>
      {/* ------ Header------ */}
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={PaymentMethodBg}
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
          <Text style={[Fonts.headlineL]}>{t('paymentMethod')}</Text>
        </HStack>
      </VStack>
      <Animatable.View
        animation="bounceIn"
        delay={100}
        style={componentStyles.containerContent}>
        {/* ------ Card------ */}
        <VStack style={componentStyles.containerCard}>
          <FastImage source={PayyuqBg} style={componentStyles.imgCardBg} />
          <VStack style={componentStyles.cardContentBalance}>
            <HStack>
              <VStack style={componentStyles.containerLogoPayyuq}>
                <FastImage
                  source={LogoPayyuq}
                  style={componentStyles.imgLogoPayyuq}
                  resizeMode="cover"
                />
              </VStack>
              <Spacer width={CustomSpacing(8)} />
              <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
                Payyuq
              </Text>
            </HStack>
            <Spacer height={CustomSpacing(16)} />
            <Text style={[Fonts.bodySemiBold, {color: Colors.neutral10}]}>
              {`Balance: Rp ${Numbro.formatCurrency(myWallet ? myWallet : 0)}`}
            </Text>
          </VStack>
          <VStack
            style={{
              padding: CustomSpacing(12),
            }}>
            <Text style={[Fonts.subhead, {color: Colors.neutral70}]}>
              {t('name')}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                Fonts.titleMBold,
                {
                  color: Colors.neutral80,
                },
              ]}>
              {exploreStore?.accountDetailData?.users
                ? exploreStore?.accountDetailData?.users?.name
                : ''}
            </Text>
          </VStack>
        </VStack>
        <Spacer height={CustomSpacing(16)} />
        {/* ------ Payment Method List------ */}
        <VStack style={componentStyles.containerMyAccount}>
          {paymentMethodList.map((item, index) => (
            <TouchableOpacity
              key={`myAccountList-${index}`}
              activeOpacity={0.8}
              onPress={item.onPress}>
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
      </Animatable.View>
    </VStack>
  );
});

export default PaymentMethod;
