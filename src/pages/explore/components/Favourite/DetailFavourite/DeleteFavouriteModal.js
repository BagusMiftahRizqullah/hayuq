import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';

import {CustomSpacing, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {ApologizeIcon} from '@assets';

import * as Animatable from 'react-native-animatable';
import {useTranslation} from 'react-i18next';

import styles from './DetailFavourite.style';
import FastImage from 'react-native-fast-image';
import {useStores} from '@store/root.store';

const DeleteFavoriteModal = ({showing, close, favId}) => {
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const {t, i18n} = useTranslation();

  const handleDeleteFavorite = () => {
    exploreStore.deleteFavorite(favId);
    close();
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
          <VStack
            style={{
              alignSelf: 'center',
            }}>
            <FastImage
              source={ApologizeIcon}
              style={{
                width: CustomSpacing(113),
                height: CustomSpacing(113),
              }}
              resizeMode="contain"
            />
          </VStack>
          <Spacer height={CustomSpacing(30)} />
          <VStack
            style={{
              alignItems: 'center',
            }}>
            <Text style={[Fonts.titleS]}>{t('hDeletethisList')}</Text>
            <Text style={[Fonts.label]}>{t('dDelletethisList')}</Text>
          </VStack>
          <Spacer height={CustomSpacing(40)} />
          <HStack
            style={{
              justifyContent: 'space-evenly',
            }}>
            <Button
              onPress={close}
              type="secondary"
              label={t('lCancel')}
              size="regular"
            />
            <Button
              onPress={handleDeleteFavorite}
              type="primary"
              label={t('lYesDelete')}
              size="regular"
            />
          </HStack>
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default DeleteFavoriteModal;
