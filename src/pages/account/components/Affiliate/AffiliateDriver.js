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
  CloseOutlineIcon,
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
import moment from 'moment';

const AffiliateDriver = observer((props) => {
  const {t, i18n} = useTranslation();
  const {accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [affiliateData, setAffiliateData] = useState(false);
  const [refferalCommision, setRefferalCommision] = useState([]);
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

  const copyToClipboard = async (a) => {
    Clipboard.setString(a);
    ToastAndroid.showWithGravity(
      'Copy',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();

    setCopiedCode(text);
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
    const dataDetail = props?.route?.params?.dataDetail;
    const from = props?.route?.params?.from;

    setAffiliateData(dataDetail);
    if (from == 'user' && dataDetail?.referral?.type == '1') {
      setRefferalCommision(dataDetail?.detail);
    } else if (from == 'leader' && dataDetail?.referral?.type == '2') {
      setRefferalCommision(dataDetail?.detail);
    } else if (from == 'member' && dataDetail?.referral?.type == '3') {
      setRefferalCommision(dataDetail?.detail);
    } else if (from == 'influencer' && dataDetail?.referral?.type == '4') {
      setRefferalCommision(dataDetail?.detail);
    } else {
      setRefferalCommision([]);
    }
  }, []);

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
        <HStack style={componentStyles.navigatorBarContainer}>
          <HStack>
            <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
              <FastImage
                source={CloseOutlineIcon}
                style={componentStyles.imgCloseIcon}
              />
            </TouchableOpacity>
            <Spacer width={CustomSpacing(83)} />

            {/* <Spacer width={CustomSpacing(15)} /> */}
            <VStack style={{alignSelf: 'center'}}>
              <Text style={[Fonts.subhead]}>Driver Referral</Text>
            </VStack>
          </HStack>
          {/* <TouchableOpacity activeOpacity={0.8} onPress={goToCall}>
          <FastImage source={CallIcon} style={componentStyles.imgCallIcon} />
        </TouchableOpacity> */}
        </HStack>

        <Spacer height={CustomSpacing(12)} />
        {/* Affiliate Program Status */}
        {statusAffiliate && (
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
          </>
        )}

        <VStack style={componentStyles.containerCard}>
          <Text style={[Fonts.label]}>
            Copy and share your referral code to get 2% commission from every
            transaction made by people who sign up using your code
          </Text>
          <Spacer height={CustomSpacing(12)} />
          <HStack style={componentStyles.containerCode}>
            <Text style={[Fonts.label]}>{affiliateData?.referral?.code}</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(affiliateData?.referral?.code)}>
              <FastImage source={Copy} style={componentStyles.imgCopy} />
            </TouchableOpacity>
          </HStack>
        </VStack>

        <Spacer height={CustomSpacing(18)} />
        {/* Total Income */}

        <VStack>
          <VStack style={componentStyles.containerCard}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.label]}>Rewards</Text>
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <Text style={[Fonts.titleMBold, {color: Colors.supportMain}]}>
              {` Rp.${Numbro.formatCurrency(
                affiliateData?.total_amount?.total_amount
                  ? affiliateData?.total_amount?.total_amount
                  : 0,
              )}`}
            </Text>
            <Spacer height={CustomSpacing(4)} />
          </VStack>
        </VStack>
        <Spacer height={CustomSpacing(12)} />
        <VStack>
          <VStack style={componentStyles.containerCard}>
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.label]}>Referral Commision</Text>
            </HStack>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              {refferalCommision?.map((v, i) => {
                return (
                  <VStack>
                    <HStack style={{justifyContent: 'space-between'}}>
                      <VStack>
                        <Text style={[Fonts.captionM]}>{`User name`}</Text>
                        <Text style={[Fonts.labelSemiBold]}>{`Jhonys`}</Text>
                      </VStack>

                      <VStack>
                        <Text
                          style={[
                            Fonts.captionM,
                          ]}>{`Date of transaction`}</Text>
                        <Text style={[Fonts.labelSemiBold]}>
                          {moment(i?.created_at).format('DD MMM YYYY')}
                        </Text>
                      </VStack>
                      <VStack>
                        <Text
                          style={[
                            Fonts.labelSemiBold,
                            {color: Colors.supportMain},
                            ,
                          ]}>{`+Rp.${Numbro.formatCurrency(v?.amount)}`}</Text>
                      </VStack>
                    </HStack>
                    <Spacer height={CustomSpacing(12)} />
                  </VStack>
                );
              })}
            </VStack>
            <Spacer height={CustomSpacing(4)} />
          </VStack>
        </VStack>
      </VStack>
      <Spacer height={CustomSpacing(42)} />
    </ScrollView>
  );
});

export default AffiliateDriver;
