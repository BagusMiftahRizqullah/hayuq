import React, {useRef, useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {
  PayyuqBg,
  DanaBg,
  EyeDisabled,
  ShowEye,
  WhiteTopUpIcon,
  WhiteReceiptIcon,
} from '@assets';
import styles from './Payyuq.style';
import {useStores} from '@store/root.store';
import Numbro from '@utils/numbro';

const Payyuq = observer(() => {
  const {exploreStore, accountStore, authStore} = useStores();
  const {t, i18n} = useTranslation();
  const [disabled, setDisabled] = useState(false);
  const [balanceDana, setBalanceDana] = useState(false);
  const componentStyles = styles();
  const navigation = useNavigation();
  const [myWallet, setMyWallet] = useState(0);

  console.log('myWallet1234', myWallet, accountStore?.accountData);
  useEffect(() => {
    if (accountStore?.accountData?.userswallet?.amount !== null) {
      setMyWallet(accountStore?.accountData?.userswallet?.amount);
    }
  }, [accountStore?.accountData?.userswallet?.amount]);

  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  const handleHideBalanceDana = () => {
    setBalanceDana(!balanceDana);
  };

  const goToTopUp = async () => {
    (await CekUserToken())
      ? navigation.navigate('HistoryPayyuq', {modalPayment: true})
      : null;
  };

  const goToHistoryPayyuq = async () => {
    (await CekUserToken())
      ? navigation.navigate('HistoryPayyuq', {modalPayment: false})
      : null;
  };

  const goToHistoryDana = () => {
    navigation.navigate('HistoryDana');
  };

  const CekUserToken = async () => {
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    if (TOKEN !== null) {
      console.log('MEMILIKI TOKENN');
      authStore.setIsToken('IS_TOKEN');
      return true;
    } else {
      console.log('TIDAK ada TOKENN');
      authStore.setIsToken('NO_TOKEN');
      return false;
    }
  };

  return (
    <VStack style={componentStyles.containerContent}>
      <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>Payyuq</Text>
      <Spacer height={CustomSpacing(4)} />
      <HStack style={componentStyles.balanceContainer}>
        <VStack>
          <Text style={[Fonts.label, {color: Colors.neutral10}]}>
            {t('myBalance')}
          </Text>
          <HStack>
            <VStack
              style={{
                alignSelf: 'flex-start',
              }}>
              <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
                Rp
              </Text>
            </VStack>
            <Spacer width={CustomSpacing(4)} />
            {disabled ? (
              <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
                **********
              </Text>
            ) : (
              <Text style={[Fonts.titleMBold, {color: Colors.neutral10}]}>
                {`${Numbro.formatCurrency(myWallet ? myWallet : 0)}`}
              </Text>
            )}
            <Spacer width={CustomSpacing(4)} />
            <VStack
              style={{
                alignSelf: 'flex-start',
              }}>
              <TouchableOpacity activeOpacity={0.8} onPress={handleDisabled}>
                <FastImage
                  source={EyeDisabled}
                  style={componentStyles.imgEyeDisabled}
                />
              </TouchableOpacity>
            </VStack>
          </HStack>
        </VStack>
        <Spacer width={CustomSpacing(4)} />
        <HStack>
          <TouchableOpacity activeOpacity={0.8} onPress={goToTopUp}>
            <VStack
              style={{
                alignItems: 'center',
              }}>
              <FastImage
                source={WhiteTopUpIcon}
                style={componentStyles.imgIconTopUp}
              />
              <Spacer height={CustomSpacing(4)} />
              <Text
                style={[
                  Fonts.captionMSemiBold,
                  {fontSize: 13, color: Colors.neutral10},
                ]}>
                {t('topUp')}
              </Text>
            </VStack>
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
          <TouchableOpacity activeOpacity={0.8} onPress={goToHistoryPayyuq}>
            <VStack
              style={{
                alignItems: 'center',
              }}>
              <FastImage
                source={WhiteReceiptIcon}
                style={componentStyles.imgIconTopUp}
              />
              <Spacer height={CustomSpacing(4)} />
              <Text
                style={[
                  Fonts.captionMSemiBold,
                  {fontSize: 13, color: Colors.neutral10},
                ]}>
                {t('history')}
              </Text>
            </VStack>
          </TouchableOpacity>
        </HStack>
      </HStack>
    </VStack>

    // <VStack>
    //   <HStack style={componentStyles.containerCardPayment}>
    //     <TouchableOpacity
    //       activeOpacity={0.8}
    //       style={componentStyles.cardPayment}
    //       onPress={goToHistoryPayyuq}>
    //       <FastImage
    //         source={PayyuqBg}
    //         style={componentStyles.cardPaymentImage}
    //         resizeMode={'cover'}>
    //         <VStack>
    //           <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //             Payyuq
    //           </Text>
    //           <Text style={[Fonts.captionM, {color: Colors.neutral10}]}>
    //             {t('myBalance')}
    //           </Text>
    //           <HStack style={{marginTop: CustomSpacing(5)}}>
    //             {disabled ? (
    //               <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //                 ******
    //               </Text>
    //             ) : (
    //               <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //                 Rp 400.000
    //               </Text>
    //             )}
    //             <TouchableOpacity activeOpacity={0.8} onPress={handleDisabled}>
    //               <FastImage
    //                 source={disabled ? ShowEye : EyeDisabled}
    //                 style={componentStyles.imgEyeDisabled}
    //               />
    //             </TouchableOpacity>
    //           </HStack>
    //         </VStack>
    //       </FastImage>
    //     </TouchableOpacity>
    //     <TouchableOpacity
    //       onPress={goToHistoryDana}
    //       activeOpacity={0.8}
    //       style={componentStyles.cardPayment}>
    //       <FastImage
    //         source={DanaBg}
    //         style={componentStyles.cardPaymentImage}
    //         resizeMode={'cover'}>
    //         <VStack>
    //           <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //             Dana
    //           </Text>
    //           <Text style={[Fonts.captionM, {color: Colors.neutral10}]}>
    //             {t('myBalanceDana')}
    //           </Text>
    //           <HStack style={{marginTop: CustomSpacing(5)}}>
    //             {!balanceDana ? (
    //               <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //                 ******
    //               </Text>
    //             ) : (
    //               <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
    //                 Rp 400.000
    //               </Text>
    //             )}
    //             <TouchableOpacity
    //               activeOpacity={0.8}
    //               onPress={handleHideBalanceDana}>
    //               <FastImage
    //                 source={!balanceDana ? ShowEye : EyeDisabled}
    //                 style={componentStyles.imgEyeDisabled}
    //               />
    //             </TouchableOpacity>
    //           </HStack>
    //         </VStack>
    //       </FastImage>
    //     </TouchableOpacity>
    //   </HStack>
    // </VStack>
  );
});

export default Payyuq;
