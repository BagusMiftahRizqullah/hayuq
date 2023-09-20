import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import OTPTextInput from 'react-native-otp-textinput';
import Lottie from 'lottie-react-native';
import {useStores} from '@store/root.store';

import {useTranslation} from 'react-i18next';

import {CustomSpacing, Fonts, Colors} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {BackIcon, Flagicon, LoadingLottie} from '@assets';
import {observer} from 'mobx-react-lite';
import RNRestart from 'react-native-restart';
import styles from './Register.style';

const RegisterOverlay = observer(({showing, close}) => {
  const {t, i18n} = useTranslation();
  const {authStore} = useStores();
  const componentStyles = styles();
  const [isCurrentProgressLogin, setIsCurrentProgressLogin] = useState(1);
  const [shouldRender, setShouldRender] = useState(false);
  const [formRegister, setFormRegister] = useState({
    phone: '',
    email: '',
    name: '',
    referalCode: '',
  });
  const [otpCode, setOtpCode] = useState('');

  const handleFormData = (value, type) => {
    setFormRegister({
      ...formRegister,
      [type]: type === 'email' ? value.toLowerCase() : value,
    });
    if (type === 'phone') {
      checkingPhoneNumber(value);
    }
  };

  const checkingPhoneNumber = (myPhone) => {
    if (myPhone.includes(0)) {
      setFormRegister({
        ...formRegister,
        ['phone']: myPhone,
      });
      return myPhone;
    } else {
      setFormRegister({
        ...formRegister,
        ['phone']: '0' + myPhone,
      });
    }
  };

  const handleSubmitRegister = () => {
    const data = {
      phone: formRegister.phone,
      email: formRegister.email,
      name: formRegister.name,
    };
    authStore.register(
      formRegister.referalCode !== ''
        ? {...data, code: formRegister.referalCode}
        : data,
    );
  };

  const handleOtpCode = (value) => {
    setOtpCode(value);
  };

  const handleSubmitOtp = () => {
    authStore.verifyOtpRegister(otpCode);
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
      authStore.registerData &&
      !authStore.registerLoading &&
      isCurrentProgressLogin === 1
    ) {
      handleNextProgress();
    }
  }, [authStore.registerData, authStore.registerLoading]);

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
            action={handleSubmitRegister}
            formRegister={formRegister}
            handleFormData={handleFormData}
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
            formRegister={formRegister}
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
            formRegister={formRegister}
            handleFormData={handleFormData}
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
              isCurrentProgressLogin === 1 ? close() : handleGobackProgress();
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
      <ScrollView>{RenderProgress()}</ScrollView>
    </Animatable.View>
  );
});

export default RegisterOverlay;

const StartedComponent = ({show, action, formRegister, handleFormData}) => {
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

  const listRegister = [
    {
      id: 1,
      title: t('name'),
      placeholder: t('enterName'),
      value: formRegister.name,
      form: 'name',
    },
    {
      id: 2,
      title: t('phoneNumber'),
      placeholder: t('phoneNumber'),
      type: 'phone',
      value: formRegister.phone,
      form: 'phone',
    },
    {
      id: 3,
      title: t('email'),
      placeholder: 'e.g. hayuq@mail.com',
      value: formRegister.email,
      form: 'email',
    },
    {
      id: 4,
      title: t('referralCode'),
      placeholder: t('optional'),
      value: formRegister.referalCode,
      form: 'referalCode',
    },
  ];

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animatable.View
          duration={400}
          easing="ease-out"
          animation={show ? 'fadeInRight' : 'fadeOutLeft'}
          useNativeDriver
          style={componentStyles.contentOverlay}>
          <Text style={[Fonts.titleMBold]}>{t('createAccount')}</Text>
          <Spacer height={CustomSpacing(8)} />
          <Text style={[Fonts.body]}>{t('createAccountDesc')}</Text>
          <Spacer height={CustomSpacing(16)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {listRegister.map((item) => (
              <VStack key={item.id}>
                <VStack style={componentStyles.inputContainer}>
                  <HStack>
                    <Text style={[Fonts.label]}>{item.title} </Text>
                    {item.form !== 'form' && (
                      <Text style={[Fonts.label, {color: Colors.dangerMain}]}>
                        *
                      </Text>
                    )}
                  </HStack>
                  <HStack>
                    {item.type && (
                      <>
                        <Image
                          source={Flagicon}
                          style={componentStyles.flagIcon}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text style={[Fonts.label]}>+62 |</Text>
                        <Spacer width={CustomSpacing(8)} />
                      </>
                    )}
                    <TextInput
                      autoCorrect={false}
                      value={item.value}
                      placeholder={item.placeholder}
                      style={[Fonts.label]}
                      keyboardType={item.type ? 'numeric' : 'default'}
                      onChangeText={(text) => {
                        handleFormData(text, item.form);
                      }}
                    />
                  </HStack>
                </VStack>
                {authStore.registerError === 'email' && item.form === 'email' && (
                  <>
                    <Spacer height={CustomSpacing(16)} />
                    <Text
                      style={[
                        Fonts.captionM,
                        {color: Colors.dangerMain, textAlign: 'right'},
                      ]}>
                      {t('emailNotValid')}
                    </Text>
                  </>
                )}
                <Spacer height={CustomSpacing(16)} />
              </VStack>
            ))}
          </KeyboardAvoidingView>
          <Spacer height={CustomSpacing(64)} />
          <VStack style={componentStyles.continueBtn}>
            <Button
              disabled={
                formRegister.name === '' ||
                formRegister.phone === '' ||
                formRegister.phone?.length < 10 ||
                formRegister.email === ''
              }
              onPress={action}
              type="primary"
              label={t('signup')}
            />
          </VStack>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const OTPComponent = ({
  show,
  goBack,
  action,
  handleOtpCode,
  otpCode,
  formRegister,
}) => {
  const {authStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [counter, setCounter] = useState(60);

  const otpInput = useRef(null);
  useEffect(() => {
    if (otpCode?.length === 4) {
      action();
    }
  }, [otpCode]);

  const handleResend = () => {
    setCounter(60);

    authStore.register(formRegister);
    authStore.clearAuthStore();
  };

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

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
        <VStack>
          <OTPTextInput
            ref={otpInput}
            containerStyle={componentStyles.otpContainer}
            textInputStyle={componentStyles.otpTextInput}
            tintColor={Colors.primaryMain}
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
                {' '}
                00:{counter > 10 ? counter : `0${counter}`}
              </Text>
            </HStack>
          )}
        </VStack>
        <Spacer height={CustomSpacing(64)} />
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
