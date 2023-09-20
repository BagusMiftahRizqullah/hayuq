import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import {useStores} from '@store/root.store';
import {useNavigation} from '@react-navigation/native';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import * as Animatable from 'react-native-animatable';
import {RegisterOverlay} from '../../pages/auth/Components';
import LoginOverLay from '../../pages/auth/Components/Login/Login';
import styles from './LoginValid.style';
import FastImage from 'react-native-fast-image';

const LoginValidModal = ({showing, close}) => {
  const navigation = useNavigation();
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [isCurrentProgress, setIsCurrentProgress] = useState('');
  const [index, setIndex] = useState(0);

  const goToLogin = async () => {
    // setIsCurrentProgress('login');
    navigation.navigate('AuthStack');
  };

  const goToSignUp = async () => {
    // setIsCurrentProgress('register');
    navigation.navigate('AuthStack');
  };

  const handleResteCurrentProgress = () => {
    setIsCurrentProgress('');
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
      <TouchableOpacity
        onPress={() => {
          exploreStore.setPayuqHistoryFilterDate(null);
          close();
        }}
        style={{flex: 1}}
      />

      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.bottomSheetContainer}>
        <VStack>
          <Text style={[Fonts.headlineL]}>Let's get you in!</Text>

          <VStack>
            <Text style={[Fonts.captionM]}>
              In just a minute, you can access all our offers, service and more
            </Text>
          </VStack>
          <Spacer height={CustomSpacing(18)} />
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <Button
              size="regular"
              type="secondary"
              label="Sign Up"
              onPress={goToSignUp}
            />
            <Spacer width={CustomSpacing(12)} />
            <Button
              size="regular"
              type="primary"
              label="Log In"
              onPress={goToLogin}
            />
          </HStack>
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
      <LoginOverLay
        showing={isCurrentProgress === 'login'}
        close={handleResteCurrentProgress}
      />
      <RegisterOverlay
        showing={isCurrentProgress === 'register'}
        close={handleResteCurrentProgress}
      />
    </Animatable.View>
  );
};

export default LoginValidModal;
