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
import moment from 'moment';

const AffiliateMember = observer(() => {
  const {t, i18n} = useTranslation();
  const {accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [affiliateData, setAffiliateData] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [statusAffiliate, setStatusAffiliate] = useState(true);
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
  const goToAffiliateUser = () => {
    navigation.navigate('AffiliateUser', {
      dataDetail: affiliateData?.all,
      from: 'Users',
    });
  };

  const goToAffiliateDriver = () => {
    navigation.navigate('AffiliateDriver', {
      dataDetail: affiliateData?.all,
      from: 'Drivers',
    });
  };
  const goToAffiliateMerchants = () => {
    navigation.navigate('AffiliateDriver', {
      dataDetail: affiliateData?.all,
      from: 'Merchants',
    });
  };
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
            <VStack style={componentStyles.containerCard}>
              <Text style={[Fonts.label]}>{t('copyCodeAffiliateCaption')}</Text>
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
            <Text style={[Fonts.label]}>{t('desReward')}</Text>
            <Spacer height={CustomSpacing(12)} />
            <HStack style={{justifyContent: 'space-between'}}>
              <Text style={[Fonts.label]}>{t('totalIncome')}</Text>
              {/* <FastImage
                source={InfoCircle}
                tintColor={Colors.neutral70}
                style={componentStyles.imgInfo}
              /> */}
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

          <VStack style={componentStyles.containerCard}>
            {/* Way Get The Reward */}
            <VStack>
              <Text
                style={[
                  Fonts.bodySemiBold,
                  {alignSelf: 'center', color: Colors.supportMain},
                ]}>{`⎯  Ways to get the rewards  ⎯`}</Text>
              <Spacer height={CustomSpacing(8)} />
              {dataWayGetReward?.map((item, index) => {
                return (
                  <VStack>
                    <HStack
                      key={index}
                      style={{
                        maxWidth: CustomSpacing(256),
                      }}>
                      <VStack
                        style={[
                          Fonts.label,
                          {
                            marginHorizontal: CustomSpacing(5),
                            backgroundColor: Colors.supportMain,
                            borderRadius: Rounded.l,
                            padding: CustomSpacing(5),
                          },
                        ]}>
                        <Text
                          style={[
                            Fonts.label,
                            {
                              color: Colors.neutral10,
                            },
                          ]}>
                          {item?.no}
                        </Text>
                      </VStack>

                      <Text
                        style={{
                          color: Colors.neutral70,
                        }}>
                        {item?.text}
                      </Text>
                    </HStack>
                    <Spacer height={CustomSpacing(18)} />
                  </VStack>
                );
              })}
            </VStack>

            {/* Reward Scheme */}
            <VStack>
              <Text
                style={[
                  Fonts.bodySemiBold,
                  {alignSelf: 'center', color: Colors.supportMain},
                ]}>{`⎯  Reward scheme  ⎯`}</Text>
              <Spacer height={CustomSpacing(8)} />
              {dataRewardScheme?.map((item, index) => {
                return (
                  <VStack>
                    <HStack
                      key={index}
                      style={{
                        maxWidth: CustomSpacing(256),
                      }}>
                      <VStack
                        style={[
                          Fonts.label,
                          {
                            marginHorizontal: CustomSpacing(5),
                            backgroundColor: Colors.supportMain,
                            borderRadius: Rounded.l,
                            padding: CustomSpacing(5),
                          },
                        ]}>
                        <Text
                          style={[
                            Fonts.label,
                            {
                              color: Colors.neutral10,
                            },
                          ]}>
                          {item?.no}
                        </Text>
                      </VStack>

                      <Text
                        style={{
                          color: Colors.neutral70,
                        }}>
                        {item?.text}
                      </Text>
                    </HStack>
                    <Spacer height={CustomSpacing(18)} />
                  </VStack>
                );
              })}
            </VStack>
          </VStack>
        </VStack>

        <Spacer height={CustomSpacing(18)} />
        {/* Your Target */}

        <VStack style={componentStyles.containerCard}>
          <HStack style={{justifyContent: 'flex-start'}}>
            <FastImage
              source={User}
              tintColor={Colors.neutral70}
              style={componentStyles.imgUser}
            />
            <Spacer width={CustomSpacing(4)} />
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <VStack>
                <Text style={[Fonts.label]}>Reward</Text>
                <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {`Rp.${Numbro.formatCurrency(
                    affiliateData?.all?.total_amount?.total_amount_users
                      ? affiliateData?.all?.total_amount?.total_amount_users
                      : 0,
                  )}`}
                </Text>
              </VStack>
              <Spacer
                width={CustomSpacing(
                  affiliateData?.all?.total_amount?.total_amount_users > 2
                    ? 28
                    : 44,
                )}
              />
              <VStack>
                <Text style={[Fonts.captionM]}>User reached</Text>
                <Text
                  styl
                  style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {affiliateData?.all?.count_all?.count_all_users
                    ? affiliateData?.all?.count_all?.count_all_users
                    : 0}
                </Text>
              </VStack>
              <Spacer width={CustomSpacing(18)} />
              <TouchableOpacity onPress={goToAffiliateUser}>
                <VStack style={componentStyles.btnReorder}>
                  <Text
                    style={[
                      Fonts.captionMSemiBold,
                      {color: Colors.secondaryMain},
                    ]}>
                    Details
                  </Text>
                </VStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
          <Spacer height={CustomSpacing(12)} />
          {/* Items 2 */}
          <HStack style={{justifyContent: 'flex-start'}}>
            <FastImage
              source={Driver}
              tintColor={Colors.neutral70}
              style={componentStyles.imgUser}
            />
            <Spacer width={CustomSpacing(4)} />
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <VStack>
                <Text style={[Fonts.label]}>Reward</Text>
                <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {`Rp.${Numbro.formatCurrency(
                    affiliateData?.all?.total_amount?.total_amount_drivers
                      ? affiliateData?.all?.total_amount?.total_amount_drivers
                      : 0,
                  )}`}
                </Text>
              </VStack>
              <Spacer
                width={CustomSpacing(
                  affiliateData?.all?.total_amount?.total_amount_drivers > 5
                    ? 18
                    : 44,
                )}
              />
              <VStack>
                <Text style={[Fonts.captionM]}>User reached</Text>
                <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {affiliateData?.all?.count_all?.count_all_drivers
                    ? affiliateData?.all?.count_all?.count_all_drivers
                    : 0}
                </Text>
              </VStack>
              <Spacer width={CustomSpacing(18)} />
              <TouchableOpacity onPress={goToAffiliateDriver}>
                <VStack style={componentStyles.btnReorder}>
                  <Text
                    style={[
                      Fonts.captionMSemiBold,
                      {color: Colors.secondaryMain},
                    ]}>
                    Details
                  </Text>
                </VStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
          <Spacer height={CustomSpacing(12)} />
          {/* Items 3 */}
          <HStack style={{justifyContent: 'flex-start'}}>
            <FastImage
              source={Restaurant}
              tintColor={Colors.neutral70}
              style={componentStyles.imgUser}
            />
            <Spacer width={CustomSpacing(4)} />
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <VStack>
                <Text style={[Fonts.label]}>Reward</Text>
                <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {`Rp.${Numbro.formatCurrency(
                    affiliateData?.all?.total_amount?.total_amount_merchants
                      ? affiliateData?.all?.total_amount?.total_amount_merchants
                      : 0,
                  )}`}
                </Text>
              </VStack>
              <Spacer
                width={CustomSpacing(
                  affiliateData?.all?.total_amount?.total_amount_merchants > 5
                    ? 18
                    : 44,
                )}
              />
              <VStack>
                <Text style={[Fonts.captionM]}>User reached</Text>
                <Text style={[Fonts.bodySemiBold, {color: Colors.supportMain}]}>
                  {affiliateData?.all?.count_all?.count_all_merchants
                    ? affiliateData?.all?.count_all?.count_all_merchants
                    : 0}
                </Text>
              </VStack>
              <Spacer width={CustomSpacing(18)} />
              <TouchableOpacity onPress={goToAffiliateMerchants}>
                <VStack style={componentStyles.btnReorder}>
                  <Text
                    style={[
                      Fonts.captionMSemiBold,
                      {color: Colors.secondaryMain},
                    ]}>
                    Details
                  </Text>
                </VStack>
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </VStack>
      <Spacer height={CustomSpacing(42)} />
    </ScrollView>
  );
});

export default AffiliateMember;
