import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  NativeModules,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import OTPTextInput from 'react-native-otp-textinput';
import Lottie from 'lottie-react-native';

import {useTranslation} from 'react-i18next';

import {CustomSpacing, Fonts, Colors} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {BackIcon, Flagicon, LoadingLottie} from '@assets';
import {useStores} from '@store/root.store';
import {observer} from 'mobx-react-lite';
import styles from './Login.style';
import RNRestart from 'react-native-restart';

const LoginOverLay = observer(({showing, close}) => {
  const {t, i18n} = useTranslation();
  const {authStore} = useStores();
  const componentStyles = styles();
  const [isCurrentProgressLogin, setIsCurrentProgressLogin] = useState(1);
  const [shouldRender, setShouldRender] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleOtpCode = (value) => {
    setOtpCode(value);
  };

  const handleSubmitOtp = () => {
    setTimeout(() => {
      authStore.verifyOtpLogin(otpCode);
    }, 1000);
  };

  const handlePhoneNumber = (value) => {
    setPhoneNumber(value);
  };

  const checkingPhoneNumber = (myPhone) => {
    if (myPhone.includes(0)) {
      return myPhone;
    } else {
      return '0' + myPhone;
    }
  };

  const handleSubmitLogin = () => {
    authStore.login(checkingPhoneNumber(phoneNumber));
  };

  const handleNextProgress = () => {
    setIsCurrentProgressLogin(isCurrentProgressLogin + 1);
  };

  const handleGobackProgress = () => {
    setIsCurrentProgressLogin(isCurrentProgressLogin - 1);
    authStore.clearAuthStore();
  };

  useEffect(() => {
    if (
      authStore.loginData &&
      !authStore.loginLoading &&
      isCurrentProgressLogin === 1
    ) {
      handleNextProgress();
    }
  }, [authStore.loginData, authStore.loginLoading]);

  useEffect(() => {
    if (
      authStore.verifyOtpData &&
      !authStore.verifyOtpLoading &&
      isCurrentProgressLogin === 2
    ) {
      setIsCurrentProgressLogin(3);
    }
  }, [authStore.verifyOtpData, authStore.verifyOtpLoading]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

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

  const RenderProgress = () => {
    let renderItem;
    switch (isCurrentProgressLogin) {
      case 1:
        renderItem = (
          <StartedComponent
            show={isCurrentProgressLogin === 1}
            action={handleSubmitLogin}
            handlePhoneNumber={handlePhoneNumber}
            phoneNumber={phoneNumber}
          />
        );
        break;
      case 2:
        renderItem = (
          <OTPComponent
            show={isCurrentProgressLogin === 2}
            goBack={handleGobackProgress}
            action={handleSubmitOtp}
            handleOtpCode={handleOtpCode}
            otpCode={otpCode}
            phoneNumber={phoneNumber}
          />
        );
        break;
      case 3:
        renderItem = (
          <LoadingComponent
            show={isCurrentProgressLogin === 3}
            goBack={handleGobackProgress}
          />
        );
        break;
      default:
        renderItem = (
          <StartedComponent
            show={isCurrentProgressLogin === 1}
            action={handleNextProgress}
            handlePhoneNumber={handlePhoneNumber}
            phoneNumber={phoneNumber}
          />
        );
        break;
    }
    return renderItem;
  };
  return (
    <Animatable.View
      duration={1000}
      easing="ease-out"
      animation={showing ? 'bounceInUp' : 'bounceOutDown'}
      useNativeDriver
      style={[componentStyles.overlayContainer]}>
      {isCurrentProgressLogin !== 3 && (
        <HStack style={componentStyles.navigator}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (isCurrentProgressLogin === 1) {
                setPhoneNumber('');
                authStore.clearAuthStore();
                close();
              } else {
                handleGobackProgress();
              }
            }}>
            <Image source={BackIcon} style={componentStyles.backIcon} />
          </TouchableOpacity>
          {isCurrentProgressLogin === 1 && (
            <Text style={[Fonts.headlineL]}>{t('titleOverlay1')}</Text>
          )}
          <Spacer width={CustomSpacing(32)} />
        </HStack>
      )}
      <Spacer height={CustomSpacing(12)} />
      {RenderProgress()}
    </Animatable.View>
  );
});

export default LoginOverLay;

const StartedComponent = ({show, action, handlePhoneNumber, phoneNumber}) => {
  const {authStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!show) {
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    } else {
      setShouldRender(true);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animatable.View
        duration={400}
        easing="ease-out"
        animation={show ? 'fadeInRight' : 'fadeOutLeft'}
        useNativeDriver
        style={componentStyles.contentOverlay}>
        <Text style={[Fonts.titleMBold]}>{t('welcome')}</Text>
        <Spacer height={CustomSpacing(8)} />
        <Text style={[Fonts.body]}>{t('welcomeDesc')}</Text>
        <Text style={[Fonts.body]}>{t('welcomeDesc1')}</Text>
        <Spacer height={CustomSpacing(16)} />
        <VStack style={componentStyles.inputContainer}>
          <HStack>
            <Text style={[Fonts.label]}>{t('phoneNumber')} </Text>
            <Text style={[Fonts.label, {color: Colors.dangerMain}]}>*</Text>
          </HStack>
          <HStack>
            <Image source={Flagicon} style={componentStyles.flagIcon} />
            <Spacer width={CustomSpacing(8)} />
            <Text style={[Fonts.label]}>+62 |</Text>
            <Spacer width={CustomSpacing(8)} />
            <TextInput
              onChangeText={handlePhoneNumber}
              value={phoneNumber}
              placeholder={t('phoneNumber')}
              style={[Fonts.label]}
              keyboardType={'numeric'}
              maxLength={15}
            />
          </HStack>
        </VStack>
        <Spacer height={CustomSpacing(8)} />
        {authStore.loginError && (
          <Text
            style={[
              Fonts.captionM,
              {color: Colors.dangerMain, textAlign: 'right'},
            ]}>
            {t('registeredPhoneNumber')}
          </Text>
        )}
        <VStack style={componentStyles.continueBtn}>
          <Button
            disabled={phoneNumber?.length < 10}
            onPress={action}
            type="primary"
            label={t('continue')}
            isSubmitting={authStore.loginLoading}
          />
        </VStack>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

const OTPComponent = ({
  show,
  goBack,
  action,
  handleOtpCode,
  otpCode,
  phoneNumber,
}) => {
  const {authStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [counter, setCounter] = useState(60);
  const {t, i18n} = useTranslation();

  const otpInput = useRef(null);
  useEffect(() => {
    if (otpCode?.length === 4) {
      action();
    }
  }, [otpCode]);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const handleResend = () => {
    setCounter(60);
    authStore.login(phoneNumber);
    authStore.clearAuthStore();
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!show) {
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    } else {
      setShouldRender(true);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animatable.View
        duration={400}
        easing="ease-out"
        animation={show ? 'bounceInRight' : 'bounceOutLeft'}
        useNativeDriver
        style={componentStyles.contentOverlay}>
        <Text style={[Fonts.titleMBold]}>Enter 4 digits OTP</Text>
        <Spacer height={CustomSpacing(8)} />
        <Text style={[Fonts.body]}>
          Enter the 4 digit OTP number received by WhatsApp
        </Text>
        <Spacer height={CustomSpacing(16)} />
        <VStack style={{alignItems: 'center'}}>
          <OTPTextInput
            offTintColor={
              authStore.verifyOtpError ? Colors.dangerMain : Colors.primaryMain
            }
            ref={otpInput}
            containerStyle={componentStyles.otpContainer}
            textInputStyle={componentStyles.otpTextInput}
            tintColor={
              authStore.verifyOtpError ? Colors.dangerMain : Colors.primaryMain
            }
            handleTextChange={(text) => handleOtpCode(text)}
            inputCount={4}
          />
          <Spacer height={CustomSpacing(10)} />
          {authStore.verifyOtpError && (
            <Text
              style={[
                Fonts.captionM,
                {color: Colors.dangerMain, textAlign: 'center'},
              ]}>
              Seems like this code isn’t valid
            </Text>
          )}
          <Spacer height={CustomSpacing(10)} />
          {counter === 0 ? (
            <TouchableOpacity activeOpacity={0.8} onPress={handleResend}>
              <Text style={[Fonts.labelSemiBold, {textAlign: 'center'}]}>
                Resend OTP Code
              </Text>
            </TouchableOpacity>
          ) : (
            <HStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={[Fonts.labelSemiBold, {color: Colors.neutral50}]}>
                Send again in
              </Text>
              <Spacer width={CustomSpacing(8)} />
              <Text style={[Fonts.labelSemiBold]}>
                00:{counter > 10 ? counter : `0${counter}`}
              </Text>
            </HStack>
          )}
        </VStack>
        <VStack style={componentStyles.continueBtn}>
          <Button
            isSubmitting={authStore.verifyOtpLoading}
            onPress={goBack}
            type="secondary"
            label="Change phone number"
          />
        </VStack>
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

const LoadingComponent = ({show, goBack}) => {
  const {authStore, exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!show) {
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    } else {
      setShouldRender(true);
      exploreStore.getAccountDetail();
      setTimeout(() => {
        authStore.setAuthenticated(true);
      }, 2000);
    }
    setTimeout(() => {
      RNRestart.restart();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  if (!shouldRender) return null;

  return (
    <TouchableWithoutFeedback>
      <Animatable.View
        duration={400}
        easing="ease-out"
        animation={show ? 'bounceInRight' : 'bounceOutLeft'}
        useNativeDriver
        style={componentStyles.contentOverlay}>
        <Spacer height={CustomSpacing(50)} />
        <VStack
          style={{
            alignItems: 'center',
          }}>
          <Text style={[Fonts.titleMBold]}>Logging you in</Text>
          <Text style={[Fonts.body]}>Hang on a second...</Text>
          <Spacer height={CustomSpacing(50)} />
          <Lottie source={LoadingLottie} autoPlay loop style={{height: 200}} />
        </VStack>
        <Spacer height={CustomSpacing(16)} />
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};
