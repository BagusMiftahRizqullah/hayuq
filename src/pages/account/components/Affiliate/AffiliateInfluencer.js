import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Platform,
} from 'react-native';
import {dimensions} from '@config/Platform.config';

import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  BackGreyIcon,
  ReceiptIcon,
  LogoPayyuq,
  PayyuqBg,
  PaymentMethodBg,
  ChevronRightIcon,
  TopUpIcon,
  Coin,
  Money,
  Copy,
  InfoCircle,
  User,
  Driver,
  Restaurant,
  AffiliateBg,
} from '@assets';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import ModalDropdown from 'react-native-modal-dropdown';
import styles from './Affiliate.style';
import Icon from 'react-native-vector-icons/AntDesign';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import Numbro from '@utils/numbro';

const AffiliateInfluencer = observer(() => {
  const {t, i18n} = useTranslation();
  const {accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [affiliateData, setAffiliateData] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [statusAffiliate, setStatusAffiliate] = useState(false);
  const [show, setShow] = useState(false);

  const dataWayGetReward = [
    {
      no: '1',
      text: 'Copy your referral code above and share to your friends',
    },
    {
      no: '2',
      text: 'Make sure that your friends input your referral code when sign up to their account',
    },
    {
      no: '3',
      text: 'Your friends need to top up min. 50k to Payyuq wallet',
    },
    {
      no: '4',
      text: 'You will get the rewards for every top up that made by your friends. Your rewards will be auto withdraw to your Payyuq wallet each one month',
    },
  ];

  const dataRewardScheme = [
    {
      no: '1',
      text: '50k - 100K = 2% Affiliate and 2% consumer',
    },
    {
      no: '2',
      text: '101k - 300k = 3%  Affiliate and 2% consumer',
    },
    {
      no: '3',
      text: '301k - ∞ = 4% Affiliate and 2% consumer',
    },
    {
      no: '4',
      text: 'Get Rp5.000 for every Merchant and Driver signed up with your referral code',
    },
  ];

  const copyToClipboard = async (codex) => {
    Clipboard.setString(codex);
    ToastAndroid.showWithGravity(
      'Copy',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToTopUp = () => {
    navigation.navigate('TopUp');
  };

  const goToHistoryPayyuq = () => {
    navigation.navigate('HistoryPayyuq');
  };

  useEffect(() => {
    if (accountStore.affiliateData) {
      setAffiliateData(accountStore.affiliateData);
      setStatusAffiliate(accountStore.affiliateData?.all?.referral?.active);
    }
  }, [accountStore?.affiliateData]);

  const paymentMethodList = [
    {
      id: 1,
      title: 'Top up',
      icon: TopUpIcon,
      onPress: goToTopUp,
    },
    {
      id: 2,
      title: 'View transactions history',
      icon: ReceiptIcon,
      onPress: goToHistoryPayyuq,
    },
  ];

  return (
    <ScrollView
      style={{
        height: '100%',
      }}>
      <VStack
        style={{
          height: '100%',
          backgroundColor: Colors.backgroundMain,
        }}>
        {/* ------ Header------ */}
        <VStack style={componentStyles.containerHeadear}>
          <Animatable.View animation="bounceInRight" delay={200}>
            <FastImage
              source={AffiliateBg}
              style={componentStyles.imgProfileBg}
              resizeMode="contain"
            />
          </Animatable.View>
          <HStack
            style={{
              position: 'absolute',
              top:
                Platform.OS === 'ios' ? CustomSpacing(44) : CustomSpacing(40),
              left: CustomSpacing(16),
            }}>
            <TouchableOpacity onPress={goBack}>
              <FastImage
                source={BackGreyIcon}
                style={componentStyles.imgGoback}
              />
            </TouchableOpacity>
            <Spacer width={CustomSpacing(16)} />
            <Text style={[Fonts.headlineL]}>{t('affiliateProgram')}</Text>
          </HStack>
        </VStack>
        <Spacer height={CustomSpacing(12)} />
        {/* Affiliate Program Status */}
        {statusAffiliate ? (
          <>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#FFD202', '#FFD202', '#E2C22A']}
              style={componentStyles.containerAffiliateStatus}>
              <HStack style={{justifyContent: 'space-between'}}>
                <Text style={[Fonts.label]}>{t('affiliateStatusCaption')}</Text>
                <Text style={[Fonts.label]}>{t('affiliateStatus')}</Text>
              </HStack>
            </LinearGradient>

            <Spacer height={CustomSpacing(12)} />

            <VStack style={componentStyles.containerCard}>
              <Text style={[Fonts.label]}>Here is your code :</Text>
              <Spacer height={CustomSpacing(12)} />
              <HStack style={componentStyles.containerCode}>
                <Text style={[Fonts.label]}>
                  {affiliateData?.all?.referral?.code}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(affiliateData?.all?.referral?.code)
                  }>
                  <FastImage source={Copy} style={componentStyles.imgCopy} />
                </TouchableOpacity>
              </HStack>
            </VStack>
          </>
        ) : null}

        <Spacer height={CustomSpacing(18)} />
        {/* Total Income */}

        <VStack>
          <VStack style={componentStyles.containerCard}>
            <Spacer height={CustomSpacing(12)} />
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.label]}>Available Balance</Text>
              <FastImage
                source={InfoCircle}
                tintColor={Colors.neutral70}
                style={componentStyles.imgInfo}
              />
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <Text style={[Fonts.titleMBold, {color: Colors.supportMain}]}>
              {`Rp.${Numbro.formatCurrency(
                affiliateData?.all?.total_amount?.total_amount
                  ? affiliateData?.all?.total_amount?.total_amount
                  : 0,
              )}`}
            </Text>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              <HStack style={{justifyContent: 'space-between'}}>
                <Text style={[Fonts.label]}>Today</Text>
              </HStack>
              <Spacer height={CustomSpacing(4)} />
              <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                {`Rp.${Numbro.formatCurrency(
                  affiliateData?.today?.total_amount?.total_amount
                    ? affiliateData?.today?.total_amount?.total_amount
                    : 0,
                )}`}
              </Text>
              <Spacer height={CustomSpacing(12)} />
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(18)} />
        </VStack>

        <VStack>
          <VStack style={componentStyles.containerCard}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.label]}>Retained Funds</Text>
              {/* <FastImage
                source={InfoCircle}
                tintColor={Colors.neutral70}
                style={componentStyles.imgInfo}
              /> */}
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <Text style={[Fonts.titleMBold, {color: Colors.supportMain}]}>
              {`Rp.${Numbro.formatCurrency(
                affiliateData?.all?.total_amount?.total_amount_retained
                  ? affiliateData?.all?.total_amount?.total_amount_retained
                  : 0,
              )}`}
            </Text>
            <Spacer height={CustomSpacing(4)} />
          </VStack>
          <Spacer height={CustomSpacing(4)} />
        </VStack>

        <Spacer height={CustomSpacing(18)} />
        <VStack padding={CustomSpacing(16)}>
          <Button
            onPress={() => console.log('ggggg')}
            label={`Withdraw Balance`}
            type="primary"
          />
          {/* <Text>{JSON.stringify(exploreStore.cartListData?.price?)}</Text> */}
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(24)} />}
        </VStack>
      </VStack>
      <Spacer height={CustomSpacing(42)} />
    </ScrollView>
  );
});

export default AffiliateInfluencer;
