import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import FastImage from 'react-native-fast-image';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';

import {
  WeatherRainBG,
  AcceptIcon,
  DeclineIcon,
  MuteIcon,
  SpeakerIcon,
} from '@assets';
import {useStores} from '@store/root.store';
import * as Animatable from 'react-native-animatable';

import styles from './WeatherRain.style';

const WeatherRain = observer(({showing, close}) => {
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
        },
      ]}>
      <FastImage
        source={WeatherRainBG}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />

      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.callContainer}>
        <VStack>
          <Text style={[Fonts.bodySemiBold, {color: Colors.neutral10}]}>
            It’s raining outside, please be patient as our driver may be
            delivering your order slower than usual.
          </Text>
        </VStack>
        <Spacer height={CustomSpacing(16)} />
        <Button type="primary" label={'Ok, I understand'} onPress={close} />
        <Spacer bottomSafeAreaHeight />
      </Animatable.View>
    </Animatable.View>
  );
});

export default WeatherRain;
