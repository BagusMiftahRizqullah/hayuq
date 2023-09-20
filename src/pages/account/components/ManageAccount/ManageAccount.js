import React, {useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  ChevronRightIcon,
  BackGreyIcon,
  ManageAccountBg,
  DeleteAccountIcon,
  LogoutIcon,
} from '@assets';
import LogoutModal from './LogoutModal';
import {useTranslation} from 'react-i18next';

import styles from './ManageAccount.style';

const ManageAccount = () => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  const manageAccountList = [
    {
      id: 1,
      title: t('deleteAccount'),
      icon: DeleteAccountIcon,
      onPress: goToDeleteAccount,
    },
    {
      id: 2,
      title: t('logout'),
      icon: LogoutIcon,
      onPress: handleOpenLogoutModal,
    },
  ];

  return (
    <VStack
      style={{
        backgroundColor: Colors.neutral10,
        height: '100%',
      }}>
      {/* ------ Header------ */}
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={ManageAccountBg}
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
          <Text style={[Fonts.headlineL]}>{t('manageAccount')}</Text>
        </HStack>
      </VStack>
      {/* ------ Manage Account list ------ */}
      <VStack style={{padding: CustomSpacing(16)}}>
        <VStack>
          {manageAccountList.map((item, index) => (
            <VStack>
              <VStack
                style={
                  componentStyles.containerMyAccount
                  // item.id == 1
                  //   ? componentStyles.containerNonActive
                  //   : componentStyles.containerMyAccount
                }>
                <TouchableOpacity
                  // disabled={item.id == 1 ? true : false}
                  key={`favoriteList-${index}`}
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
              </VStack>
              <Spacer height={CustomSpacing(8)} />
            </VStack>
          ))}
        </VStack>
      </VStack>
      <LogoutModal showing={showLogoutModal} close={handleOpenLogoutModal} />
    </VStack>
  );
};

export default ManageAccount;
