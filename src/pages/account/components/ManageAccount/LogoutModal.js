import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Fonts} from '@styles';
import {VStack, Spacer, Button} from '@components';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import styles from './ManageAccount.style';
import RNRestart from 'react-native-restart';

const LogoutModal = ({showing, close}) => {
  const {t, i18n} = useTranslation();
  const {accountStore, exploreStore, authStore, orderStore, historyStore} =
    useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);

  const handleLogout = async () => {
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
    close();
    RNRestart.restart();
  };

  useEffect(() => {
    let timeout;

    if (!showing) {
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    } else {
      setShouldRender(true);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showing]);

  if (!shouldRender) return null;

  return (
    <Animatable.View
      duration={200}
      easing="ease-out"
      animation={showing ? 'fadeIn' : 'fadeOut'}
      useNativeDriver
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
        },
      ]}>
      <TouchableOpacity onPress={close} style={{flex: 1}} />

      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.bottomSheetContainer}>
        <VStack>
          <Text style={[Fonts.headlineL]}>Log out</Text>
          <Spacer height={CustomSpacing(8)} />
          <Text style={[Fonts.label]}>{t('areYouSureLogout')}</Text>
          <Spacer height={CustomSpacing(20)} />
          <Button onPress={handleLogout} type="danger" label="Log out" />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default LogoutModal;
