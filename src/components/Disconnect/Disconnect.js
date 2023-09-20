import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import FastImage from 'react-native-fast-image';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';

import {Disconnect} from '@assets';
import {useStores} from '@store/root.store';
import * as Animatable from 'react-native-animatable';

import styles from './Disconnect.style';

const DisconnectOverlay = observer(({showing, close}) => {
  const {routerStore} = useStores();
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
      Keyboard.dismiss();
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
          position: 'absolute',
          backgroundColor: Colors.backgroundMain,
        },
      ]}>
      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.callContainer}>
        <FastImage
          source={Disconnect}
          style={{
            width: dimensions.screenWidth,
            height: dimensions.screenWidth,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Spacer height={CustomSpacing(10)} />
        <Text style={[Fonts.titleS]}>Uh-oh, we lost you ...</Text>
        <Spacer height={CustomSpacing(10)} />
        <Text
          style={[
            Fonts.label,
            {
              textAlign: 'center',
            },
          ]}>
          Please check your internet connection and try again.
        </Text>
        <Spacer height={CustomSpacing(80)} />
        <Button type="primary" label={'Try again'} onPress={close} />
      </Animatable.View>
    </Animatable.View>
  );
});

export default DisconnectOverlay;
