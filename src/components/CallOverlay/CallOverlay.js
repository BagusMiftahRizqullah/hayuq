import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import FastImage from 'react-native-fast-image';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';

import {ChatBg, AcceptIcon, DeclineIcon, MuteIcon, SpeakerIcon} from '@assets';
import {useStores} from '@store/root.store';
import * as Animatable from 'react-native-animatable';

import styles from './CallOverlay.style';

const CallOverlay = observer(({showing, close}) => {
  const {routerStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);

  const parseCallStatus = (status) => {
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'progress':
        return '00:32';
      default:
        return 'Ringing...';
    }
  };

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
        source={ChatBg}
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
        <FastImage
          source={{uri: 'https://picsum.photos/200/300'}}
          style={componentStyles.imgAvatar}
          resizeMode="cover"
        />
        <Spacer height={CustomSpacing(32)} />
        <Text style={[Fonts.titleMBold]}>James Warden</Text>
        <Spacer height={CustomSpacing(12)} />
        <Text style={[Fonts.titleS]}>
          {parseCallStatus(routerStore.callStatus)}
        </Text>
        <Spacer height={CustomSpacing(180)} />
        <HStack style={componentStyles.actionContainer}>
          {routerStore.callStatus === 'ringing' ? (
            <>
              <TouchableOpacity onPress={close}>
                <FastImage
                  source={DeclineIcon}
                  style={componentStyles.imgActionIcon}
                  resizeMode="contain"
                />
                <Spacer height={CustomSpacing(8)} />
                <Text style={[Fonts.captionM, {textAlign: 'center'}]}>
                  Decline
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={close}>
                <FastImage
                  source={AcceptIcon}
                  style={componentStyles.imgActionIcon}
                  resizeMode="contain"
                />
                <Spacer height={CustomSpacing(8)} />
                <Text style={[Fonts.captionM, {textAlign: 'center'}]}>
                  Accept
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={close}>
                <FastImage
                  source={MuteIcon}
                  style={componentStyles.imgActionIcon}
                  resizeMode="contain"
                />
                <Spacer height={CustomSpacing(8)} />
                <Text style={[Fonts.captionM, {textAlign: 'center'}]}>
                  Mute
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={close}>
                <FastImage
                  source={SpeakerIcon}
                  style={componentStyles.imgActionIcon}
                  resizeMode="contain"
                />
                <Spacer height={CustomSpacing(8)} />
                <Text style={[Fonts.captionM, {textAlign: 'center'}]}>
                  Speaker
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={close}>
                <FastImage
                  source={DeclineIcon}
                  style={componentStyles.imgActionIcon}
                  resizeMode="contain"
                />
                <Spacer height={CustomSpacing(8)} />
                <Text style={[Fonts.captionM, {textAlign: 'center'}]}>End</Text>
              </TouchableOpacity>
            </>
          )}
        </HStack>
      </Animatable.View>
    </Animatable.View>
  );
});

export default CallOverlay;
