import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, NativeModules} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import {ArrowBackOutline, SadIllustration} from '@assets';
import DeleteAccountModal from './DeleteAccountModal';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import styles from './ManageAccount.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const DeleteAccount = observer(() => {
  const componentStyles = styles();
  const {accountStore, exploreStore, authStore, orderStore, historyStore} =
    useStores();
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOpenDeleteModal = async () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const fixDeleteModal = async () => {
    await accountStore.deleteAccount();
    authStore.clearAuthStore();
    authStore.verifyOtpSuccess(null);
    await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.removeItem('USER_ID');
    // await AsyncStorage.setItem(
    //   'USER_ID',
    //   '0643afac-0702-4681-a481-46fc72925f0e',
    // );
    exploreStore.clearExploreStore();
    accountStore.clearAccountStore();
    orderStore.clearOrderStore();
    historyStore.clearHistoryStore();

    setShowDeleteModal(!showDeleteModal);
    RNRestart.restart();
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <VStack style={componentStyles.containerAddNewAddress}>
      {/* ------ Navigator ------ */}
      <VStack style={componentStyles.containerNavigatorAddNewAddress}>
        <Spacer topSafeAreaHeight />
        <VStack>
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity act1iveOpacity={0.8} onPress={goBack}>
              <FastImage
                source={ArrowBackOutline}
                style={componentStyles.imgArrowBack}
              />
            </TouchableOpacity>
            <Text style={[Fonts.subhead]}>{t('deleteAccount')}</Text>
            <View
              style={{
                width: CustomSpacing(24),
                height: CustomSpacing(24),
              }}
            />
          </HStack>
        </VStack>
      </VStack>
      <VStack
        style={{
          padding: CustomSpacing(16),
        }}>
        <Text style={[Fonts.titleM, {width: dimensions.screenWidth * 0.6}]}>
          {t('weThoughtOurRelation')} ... 🙁
        </Text>
        <Spacer height={CustomSpacing(20)} />
        <Text style={[Fonts.label, {color: Colors.neutral70}]}>
          {t('weSorryToSeeYouGo')}
        </Text>
        <Spacer height={CustomSpacing(20)} />
        <Text style={[Fonts.subhead]}>{t('leaveWithoutReasson')}</Text>
        <Spacer height={CustomSpacing(20)} />
        <Button onPress={goBack} type="primary" label={t('bringMeBack')} />
        <Spacer height={CustomSpacing(8)} />
        <Button
          onPress={handleOpenDeleteModal}
          type="dangerOutline"
          label={t('continueToDelete')}
        />
      </VStack>
      <Animatable.View
        animation="bounceIn"
        delay={200}
        style={componentStyles.containerImgSad}>
        <FastImage
          source={SadIllustration}
          style={componentStyles.imgSadIllustration}
          resizeMode="contain"
        />
      </Animatable.View>
      <DeleteAccountModal showing={showDeleteModal} close={fixDeleteModal} />
    </VStack>
  );
});

export default DeleteAccount;
