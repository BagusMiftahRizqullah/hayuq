import React, {useRef, useCallback, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
  SectionList,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {PayyuqBgNoRounded, BackGreyIcon} from '@assets';
import {
  BillIcon,
  CloseOutlineIcon,
  ArrowDownIcon,
  CloseRedIcon,
  ChevronDownWhiteIcon,
  EatyuqIcon,
  TopUpPayyuqIcon,
  EyeDisabled,
  TopUp,
  ShowEye,
  wallet,
} from '@assets';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';

import DateFilterModal from './DateFilterModal';
import ServiceFilterModal from './ServiceFilterModal';
import TransactionReceipt from './TransactionReceipt';
import TopUpFormModal from './TopUpFormModal';
import Numbro from '@utils/numbro';

import styles from './HistoryPayyuq.style';

const HistoryPayyuq = observer((props) => {
  const {exploreStore, accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [amountTopUp, setAmountTopUp] = useState('');
  const [selectedMethod, setSelectedMethod] = useState({});
  const [isShowBalance, setIsShowBalance] = useState(true);
  const [isOpenTopUpForm, setIsOpenTopUpForm] = useState(false);
  const [isOpenDateFilter, setIsOpenDateFilter] = useState(false);
  const [isOpenServiceFilter, setIsOpenServiceFilter] = useState(false);
  const [HistoryDataTopup, setHistoryDataTopup] = useState(null);
  const [dataReceipt, setDataReceipt] = useState(null);
  const [myWallet, setMyWallet] = useState(0);
  const [isOpenTransactionReceipt, setIsOpenTransactionReceipt] =
    useState(false);

  const handleShowHideBalance = () => {
    setIsShowBalance(!isShowBalance);
  };

  const handleModalTopUpForm = () => {
    setIsOpenTopUpForm(!isOpenTopUpForm);
  };

  const handleOpenTransactionReceipt = (dataReceip) => {
    setDataReceipt(dataReceip);
    setIsOpenTransactionReceipt(!isOpenTransactionReceipt);
  };

  const handleOpenServiceFilter = () => {
    setIsOpenServiceFilter(!isOpenServiceFilter);
  };

  const handleClearFilter = () => {
    exploreStore.setPayuqHistoryFilterDate(null);
    exploreStore.setPayuqHistoryFilterService(null);
  };

  const handleOpenDateFilter = () => {
    setIsOpenDateFilter(!isOpenDateFilter);
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (props.route?.params?.modalPayment) {
      setIsOpenTopUpForm(!isOpenTopUpForm);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      accountStore.getDetailsAccount();
      exploreStore.getHistoryTopUpData();
      exploreStore.clearDownloadReceiptdata();

      // setTimeout(() => {
      // }, 2000);
    }, []),
  );

  useEffect(() => {
    if (accountStore?.accountData?.userswallet?.amount) {
      // console.log('Wll;et=>>>', accountStore?.accountData?.userswallet?.amount);
      setMyWallet(accountStore?.accountData?.userswallet?.amount);
    }
  }, [accountStore?.accountData]);

  const goTopUp = () => {
    if (amountTopUp.includes(',') || amountTopUp.includes('.')) {
    } else {
      exploreStore.postTopUpDana(parseInt(amountTopUp));
    }
  };

  useEffect(() => {
    if (exploreStore.listHistoryTopUpData !== null) {
      setHistoryDataTopup(exploreStore.listHistoryTopUpData);
    }
  }, [exploreStore.listHistoryTopUpData]);

  useEffect(() => {
    if (exploreStore.topUpDanaData !== null) {
      handleModalTopUpForm();
      navigation.navigate('DanaWebView');
    }
  }, [exploreStore.topUpDanaData]);

  const filterList = [
    {
      id: 1,
      title: 'Date',
      onPress: handleOpenDateFilter,
      active: exploreStore.payuqHistoryFilterDate !== null ? true : false,
    },
    {
      id: 2,
      title: 'Service',
      onPress: handleOpenServiceFilter,
      active: exploreStore.payuqHistoryFilterService !== null ? true : false,
    },
  ];

  const PayyuqTopUpHeader = () => (
    <FastImage
      source={PayyuqBgNoRounded}
      style={componentStyles.backgroundHeader}
      resizeMode={'cover'}>
      <VStack style={{flex: 1, justifyContent: 'space-between'}}>
        <HStack style={componentStyles.navigationBack}>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgCloseIcon}
            />
          </TouchableOpacity>

          <Text style={componentStyles.navigationBackText}>Payyuq</Text>
        </HStack>
        <HStack
          style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <Text style={[Fonts.titleMBold, {color: Colors.neutral10}]}>
            Payyuq
          </Text>
          <VStack>
            <Text style={[Fonts.label, {color: Colors.neutral10}]}>
              Balance
            </Text>
            <HStack style={{marginTop: CustomSpacing(5)}}>
              {!isShowBalance ? (
                <Text style={[Fonts.headlineM, {color: Colors.neutral10}]}>
                  ******
                </Text>
              ) : (
                <Text style={[Fonts.titleSBold, {color: Colors.neutral10}]}>
                  {`Rp ${Numbro.formatCurrency(myWallet)}`}
                </Text>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShowHideBalance}>
                <FastImage
                  source={!isShowBalance ? ShowEye : EyeDisabled}
                  style={componentStyles.imgEyeBalance}
                />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </FastImage>
  );

  const renderSectionListItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleOpenTransactionReceipt(item)}>
        <HStack style={componentStyles.renderSectionListItemContainer}>
          <VStack
            style={[
              componentStyles.containerImg,
              {
                backgroundColor:
                  item.status == 3
                    ? Colors.neutral50
                    : item.status == 0 ||
                      (item.status == 1) | (item.status == 5)
                    ? Colors.supportSurface
                    : Colors.dangerSurface,
              },
            ]}>
            <FastImage
              source={
                item.status == 0 || (item.status == 1) | (item.status == 5)
                  ? TopUpPayyuqIcon
                  : EatyuqIcon
              }
              style={componentStyles.imgIconBill}
              tintColor={item.status == 3 ? Colors.neutral100 : null}
            />
          </VStack>
          <Spacer width={CustomSpacing(12)} />
          <HStack style={componentStyles.containerDetail}>
            <VStack>
              <Text
                numberOfLines={1}
                style={[
                  Fonts.subhead,
                  {
                    maxWidth: dimensions.screenWidth - CustomSpacing(155),
                  },
                ]}>
                {item.status_name}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  Fonts.captionM,
                  {
                    maxWidth: dimensions.screenWidth - CustomSpacing(155),
                    color:
                      item.status == 3
                        ? Colors.dangerMain
                        : item.status == 0
                        ? Colors.warningHover
                        : Colors.neutral100,
                  },
                ]}>
                {item?.type_name}
              </Text>
            </VStack>
            <VStack
              style={{
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <Text
                style={[
                  Fonts.subhead,

                  {
                    flex: 1,
                    color:
                      item.status == 2 || item.status == 0
                        ? Colors.neutral70
                        : item.status == 3
                        ? Colors.dangerMain
                        : Colors.successMain,
                  },
                ]}>
                {item.status == 0 || (item.status == 1) | (item.status == 5)
                  ? `Rp ${Numbro.formatCurrency(item.amount)}`
                  : `Rp ${Numbro.formatCurrency(item.amount)}`}
              </Text>
              <VStack
                style={{
                  flex: 1,
                }}>
                <HStack>
                  <FastImage
                    source={wallet}
                    style={componentStyles.imgRatingIcon}
                  />
                  <Spacer width={CustomSpacing(4)} />
                  <Text
                    style={[
                      Fonts.captionM,
                      {
                        color: Colors.primaryPressed,
                      },
                    ]}>
                    {item.status_name}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </HStack>
        </HStack>
      </TouchableOpacity>
    );
  };

  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ----- Header */}
      <PayyuqTopUpHeader />
      {/* ------ Filter------ */}
      <Spacer height={CustomSpacing(20)} />
      <HStack
        style={{
          paddingHorizontal: CustomSpacing(16),
        }}>
        {exploreStore.payuqHistoryFilterDate !== null ||
        exploreStore.payuqHistoryFilterService !== null ? (
          <TouchableOpacity activeOpacity={0.8} onPress={handleClearFilter}>
            <HStack style={componentStyles.containerClearFilter}>
              <FastImage
                source={CloseRedIcon}
                style={componentStyles.imgChevronDown}
              />
              <Spacer width={CustomSpacing(4)} />
              <Text
                style={[Fonts.captionMSemiBold, {color: Colors.dangerMain}]}>
                Clear Filter
              </Text>
            </HStack>
          </TouchableOpacity>
        ) : null}
        {filterList.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={`filter-${index}`}
            onPress={item.onPress}>
            <HStack
              style={[
                componentStyles.containerFilter,
                {
                  borderColor: item.active
                    ? Colors.supportMain
                    : Colors.neutral50,
                  backgroundColor: item.active
                    ? Colors.supportMain
                    : Colors.neutral10,
                },
              ]}>
              <Text
                style={[
                  Fonts.captionMSemiBold,
                  {
                    color: item.active ? Colors.neutral10 : Colors.neutral90,
                  },
                ]}>
                {item.title}
              </Text>
              <Spacer width={CustomSpacing(4)} />
              <FastImage
                source={item.active ? ChevronDownWhiteIcon : ArrowDownIcon}
                style={componentStyles.imgChevronDown}
              />
            </HStack>
          </TouchableOpacity>
        ))}
      </HStack>

      {/* ------ History Data List ----- */}
      <VStack>
        <ScrollView style={{height: Platform.OS == 'ios' ? '60%' : '75%'}}>
          {/* ------ History Data Not Found------ */}
          {HistoryDataTopup == null ? (
            <>
              <Spacer height={dimensions.screenWidth * 0.38} />
              <VStack
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  source={BillIcon}
                  style={componentStyles.imgBillIcon}
                />
                <Spacer height={CustomSpacing(16)} />
                <Text style={[Fonts.label, {textAlign: 'center'}]}>
                  You have never made a transaction
                </Text>
              </VStack>
            </>
          ) : (
            <FlatList
              style={componentStyles.containerSectionList}
              data={HistoryDataTopup}
              showsVerticalScrollIndicator={false}
              renderItem={renderSectionListItem}
              keyExtractor={(item, index) => index.toString()}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={100}
              initialNumToRender={5}
              windowSize={10}
            />
          )}

          <Spacer height={CustomSpacing(64)} />
        </ScrollView>

        <HStack
          style={{width: dimensions.screenWidth, justifyContent: 'center'}}>
          <Button
            style={componentStyles.buttonTopUp}
            type="primary"
            onPress={handleModalTopUpForm}>
            <FastImage
              source={TopUp}
              tintColor={Colors.neutral10}
              style={componentStyles.btnTopUpIcon}
            />
            <Text style={[Fonts.subhead, {color: Colors.neutral10}]}>
              Top Up Payyuq
            </Text>
          </Button>
        </HStack>
        <Spacer height={CustomSpacing(Platform.OS == 'ios' ? 30 : 0)} />
      </VStack>
      <DateFilterModal
        showing={isOpenDateFilter}
        close={handleOpenDateFilter}
      />
      <ServiceFilterModal
        showing={isOpenServiceFilter}
        close={handleOpenServiceFilter}
      />
      <TransactionReceipt
        datas={dataReceipt}
        showing={isOpenTransactionReceipt}
        close={handleOpenTransactionReceipt}
      />
      <TopUpFormModal
        showing={isOpenTopUpForm}
        close={handleModalTopUpForm}
        amountTopUp={amountTopUp}
        setAmountTopUp={setAmountTopUp}
        goTopUp={goTopUp}
      />
    </VStack>
  );
});

export default HistoryPayyuq;
