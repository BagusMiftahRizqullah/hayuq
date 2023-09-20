import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {useTranslation} from 'react-i18next';

import * as Animatable from 'react-native-animatable';

import styles from './DetailFavourite.style';

const EditFavouriteModal = ({showing, close}) => {
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
        <VStack>
          <Text style={[Fonts.headlineL]}>{t('hEditListDetail')}</Text>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>{t('wlFavoritesName')} </Text>
                <Text style={[Fonts.label, {color: Colors.dangerMain}]}>*</Text>
              </HStack>
              <HStack>
                <TextInput
                  placeholder="e.g. awesome dishes"
                  style={[Fonts.label]}
                  maxLength={40}
                />
              </HStack>
            </VStack>
            <Text style={[Fonts.captionS]}>{`${t(
              'wlMakscharacter',
            )} 0/40`}</Text>
          </VStack>

          <Spacer height={CustomSpacing(8)} />
          <Button onPress={close} type="primary" label={t('lSaveChange')} />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default EditFavouriteModal;
