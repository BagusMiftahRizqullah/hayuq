import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {HappyIllustration} from '@assets';
import {useTranslation} from 'react-i18next';

import * as Animatable from 'react-native-animatable';

import styles from './ManageAccount.style';
import FastImage from 'react-native-fast-image';

const DeleteAccountModal = ({showing, close}) => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);

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
        <VStack
          style={{
            alignItems: 'center',
          }}>
          <FastImage
            source={HappyIllustration}
            style={{
              width: dimensions.screenWidth * 0.25,
              height: dimensions.screenWidth * 0.29,
            }}
          />
          <Spacer height={CustomSpacing(8)} />
          <Text style={[Fonts.titleS]}>{t('stillWantLeave')}</Text>
          <Spacer height={CustomSpacing(8)} />
          <Text style={[Fonts.label, {textAlign: 'center'}]}>
            {t('weWillRetainUser')}
          </Text>
        </VStack>
        <Spacer height={CustomSpacing(20)} />
        <Button onPress={close} type="primary" label={t('okDeleteAccount')} />
        {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
      </Animatable.View>
    </Animatable.View>
  );
};

export default DeleteAccountModal;
