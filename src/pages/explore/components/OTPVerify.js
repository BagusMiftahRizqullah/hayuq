import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import OTPTextInput from 'react-native-otp-textinput';

import {useStores} from '@store/root.store';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  NoOrderIcon,
  StarIcon,
  CloseOutlineIcon,
  wallet,
  HideEye,
} from '@assets';
import {dimensions} from '@config/Platform.config';
import Numbro from '@utils/numbro';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';

const OtpVerify = observer(() => {
  const navigation = useNavigation();
  const {historyStore, routerStore, exploreStore} = useStores();
  const [otpCode, setOtpCode] = useState('');
  const otpInput = useRef(null);
  const handleOtpCode = (value) => {
    setOtpCode(value);
  };

  const requestVerifyEmail = () => {
    exploreStore.requestVerifyEmail(exploreStore.accountDetailData.users.email);
  };

  const handleSubmitOtp = () => {
    exploreStore.verifyOtpEmail(otpCode);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (exploreStore.verifyEmailOtpResponse) {
      goBack();
      exploreStore.clearVerifyOtpEmail();
    }
  }, [exploreStore.verifyEmailOtpResponse]);

  const NavigatorBar = () => {
    return (
      <HStack
        style={{
          justifyContent: 'space-between',
          padding: CustomSpacing(16),
          backgroundColor: Colors.neutral10,
        }}>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
        <Text style={[Fonts.subhead]}>Verify Account</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  return (
    <VStack
      style={{
        backgroundColor: Colors.neutral10,
        height: '100%',
      }}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      <VStack
        style={{
          alignSelf: 'center',
          flex: 1,
          width: dimensions.screenWidth - CustomSpacing(32),
        }}>
        <Spacer height={CustomSpacing(50)} />
        <Text style={[Fonts.titleMBold]}>Enter 4 digits</Text>
        <Spacer height={CustomSpacing(8)} />
        <Text style={[Fonts.body]}>Enter 4 digits OTP on your email</Text>
        <Spacer height={CustomSpacing(16)} />
        <OTPTextInput
          ref={otpInput}
          containerStyle={{
            width: '70%',
          }}
          textInputStyle={{
            borderWidth: 3,
            ...Fonts.h3,
            width: Platform.OS == 'ios' ? CustomSpacing(62) : CustomSpacing(63),
            height: CustomSpacing(70),
            padding: 0,
          }}
          tintColor={Colors.primaryMain}
          handleTextChange={(text) => handleOtpCode(text)}
          inputCount={4}
        />
        <Spacer height={CustomSpacing(16)} />
        <TouchableOpacity activeOpacity={0.8} onPress={requestVerifyEmail}>
          <Text style={[Fonts.labelSemiBold, {textAlign: 'center'}]}>
            Resend OTP Code
          </Text>
        </TouchableOpacity>
        <Spacer height={CustomSpacing(16)} />
        <Button
          disabled={exploreStore.verifyEmailOtpLoading || otpCode.length < 4}
          type="primary"
          label={'Verify'}
          isSubmitting={exploreStore.verifyEmailOtpLoading}
          onPress={handleSubmitOtp}
        />
      </VStack>
    </VStack>
  );
});

export default OtpVerify;
