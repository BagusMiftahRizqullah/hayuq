import React, {useEffect, useCallback} from 'react';
import {Text, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {dimensions} from '@config/Platform.config';
import DeviceInfo from 'react-native-device-info';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  LinkIcon,
  PaymentIcon,
  ReceiptIcon,
  SaveIcon,
  ChevronRightIcon,
  PrivacyIcon,
  TermsIcon,
  TranslateIcon,
  HelpIcon,
  People,
} from '@assets';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from './Account.style';
import {observer} from 'mobx-react-lite';

const Account = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore, accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();

  const goToAffiliate = () => {
    if (accountStore.affiliateData?.all?.referral?.type == '3') {
      // Member
      navigation.navigate('AffiliateTeam');
    } else if (accountStore.affiliateData?.all?.referral?.type == '2') {
      // Leader
      navigation.navigate('AffiliateLeader');
    } else if (accountStore.affiliateData?.all?.referral?.type == '1') {
      // Users
      navigation.navigate('AffiliateMember');
    } else if (accountStore.affiliateData?.all?.referral?.type == '4') {
      // Influencer
      navigation.navigate('AffiliateInfluencer');
    } else {
      return;
    }
  };

  const goToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const goToSavedAddress = () => {
    navigation.navigate('SavedAddress');
  };

  const goToManageAccount = () => {
    navigation.navigate('ManageAccount');
  };

  const goToPaymentMethod = () => {
    navigation.navigate('PaymentMethod');
  };

  const goToHistoryOrders = () => {
    navigation.navigate('HistoryOrder');
  };

  const goToLanguage = () => {
    navigation.navigate('Language');
  };

  const goToWebViewComponent = () => {
    navigation.navigate('WebViewComponent');
  };

  const getInitialName = (name) => {
    const nameSplit = name?.split(' ');
    return (
      nameSplit?.[0]?.charAt(0)?.toUpperCase() +
      nameSplit?.[1]?.charAt(0)?.toUpperCase()
    );
  };

  const myAccountList = [
    {
      id: 1,
      title: t('savedAddress'),
      icon: SaveIcon,
      onPress: goToSavedAddress,
    },
    {
      id: 2,
      title: t('paymentMethod'),
      icon: PaymentIcon,
      onPress: goToPaymentMethod,
    },
    {
      id: 3,
      title: t('historyOrder'),
      icon: ReceiptIcon,
      onPress: goToHistoryOrders,
    },
    {
      id: 4,
      title: t('manageAccount'),
      icon: LinkIcon,
      onPress: goToManageAccount,
    },
  ];

  const generalList = [
    {
      id: 1,
      title: t('privacyPolicy'),
      icon: PrivacyIcon,
      onPress: () => {
        accountStore.setWebViewParam('privacy');
        goToWebViewComponent();
      },
    },
    {
      id: 2,
      title: t('termService'),
      icon: TermsIcon,
      onPress: () => {
        accountStore.setWebViewParam('tnc');
        goToWebViewComponent();
      },
    },
    {
      id: 3,
      title: t('helpCentre'),
      icon: HelpIcon,
      onPress: () => {
        accountStore.setWebViewParam('help');
        goToWebViewComponent();
      },
    },
    {
      id: 4,
      title: t('language'),
      icon: TranslateIcon,
      onPress: goToLanguage,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      accountStore.getAffiliateData();
      accountStore.getDetailAffiliateUser();
      accountStore.getDetailAffiliateDriver();
    }, []),
  );

  return (
    <VStack style={componentStyles.containerAccount}>
      <Spacer topSafeAreaHeight />
      {/* ------ Header------ */}
      <HStack>
        <VStack style={componentStyles.containerProfilePic}>
          <Text style={[Fonts.h2, {color: Colors.neutral10}]}>
            {getInitialName(exploreStore?.accountDetailData?.users?.name)}
          </Text>
        </VStack>
        <Spacer width={CustomSpacing(16)} />
        <VStack>
          <Text
            style={[
              Fonts.titleMBold,
              {
                width: dimensions.screenWidth * 0.6,
              },
            ]}>
            {exploreStore?.accountDetailData?.users?.name}
          </Text>
          <Spacer height={CustomSpacing(4)} />
          <TouchableOpacity activeOpacity={0.8} onPress={goToEditProfile}>
            <HStack>
              <Text style={[Fonts.label]}>{t('editProfile')}</Text>
              <Spacer width={CustomSpacing(8)} />
              <FastImage
                source={ChevronRightIcon}
                style={componentStyles.imgChevronRight}
              />
            </HStack>
          </TouchableOpacity>
        </VStack>
      </HStack>
      <Spacer height={CustomSpacing(32)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Affiliate Program */}

        <VStack style={componentStyles.containerMyAccount}>
          <TouchableOpacity onPress={goToAffiliate} activeOpacity={0.8}>
            <HStack style={componentStyles.containerAffiliate}>
              <HStack>
                <FastImage
                  source={People}
                  style={componentStyles.imgAccountList}
                />
                <Spacer width={CustomSpacing(14)} />
                <Text style={[Fonts.label, {color: Colors.neutral80}]}>
                  {t('affiliateProgram')}
                </Text>
              </HStack>
              <FastImage
                source={ChevronRightIcon}
                style={componentStyles.imgChevrontList}
              />
            </HStack>
          </TouchableOpacity>
        </VStack>

        <Spacer height={CustomSpacing(32)} />
        {/* ------ My Account------ */}
        <VStack>
          <Text style={[Fonts.labelSemiBold]}>{t('myAccount')}</Text>
          <Spacer height={CustomSpacing(12)} />
          <VStack style={componentStyles.containerMyAccount}>
            {myAccountList.map((item, index) => (
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
        </VStack>
        <Spacer height={CustomSpacing(32)} />
        {/* ------ General------ */}
        <VStack>
          <Text style={[Fonts.labelSemiBold]}>{t('general')}</Text>
          <Spacer height={CustomSpacing(12)} />
          <VStack style={componentStyles.containerMyAccount}>
            {generalList.map((item, index) => (
              <TouchableOpacity
                key={`general-${index}`}
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
        </VStack>
        <Spacer height={CustomSpacing(32)} />
        <VStack
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={[
              Fonts.subhead,
            ]}>{`Version ${DeviceInfo.getVersion()}`}</Text>
        </VStack>
      </ScrollView>
    </VStack>
  );
});

export default Account;
