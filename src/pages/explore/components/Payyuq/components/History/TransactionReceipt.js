import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  EatyuqIcon,
  CloseOutlineIcon,
  ReceiptBg,
  TopUpPayyuqIcon,
} from '@assets';
import Numbro from '@utils/numbro';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import styles from './HistoryPayyuq.style';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import RNFetchBlob from 'rn-fetch-blob';

const TransactionReceipt = observer(({datas, showing, close}) => {
  const {exploreStore, accountStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.containerNavigator}>
        <TouchableOpacity activeOpacity={0.8} onPress={close}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgCloseIcon}
          />
        </TouchableOpacity>

        <Text style={[Fonts.subhead]}>Transaction Receipt</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  useEffect(() => {
    if (exploreStore.downloadReceiptData !== null) {
      downloadFile();
    }
  }, [exploreStore.downloadReceiptData]);

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

  const downloadFile = async () => {
    await RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png', {
      // more headers  ..
    })
      .then((res) => {
        let status = res.info().status;
        if (status == 200) {
          // the conversion is done in native code
          let base64Str = res.base64();
          // the following conversions are done in js, it's SYNC
          let text = res.text();
          let json = res.json();
        } else {
          // handle other status codes
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  };

  const DownloadReceipt = async () => {
    await exploreStore.downloadReceipt(datas?.id);
  };
  return (
    <Animatable.View
      duration={200}
      easing="ease-out"
      animation={showing ? 'bounceInUp' : 'bounceOutDown'}
      useNativeDriver
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: Colors.primaryMain,
        },
      ]}>
      <Spacer topSafeAreaHeight />
      <NavigatorBar />
      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceIn' : 'bounceOut'}
        useNativeDriver
        style={{
          position: 'absolute',
          zIndex: 2,
          top:
            Platform.OS === 'ios'
              ? dimensions.screenWidth * 0.3
              : dimensions.screenWidth * 0.2,
          left: dimensions.screenWidth * 0.09,
        }}>
        <VStack style={componentStyles.containerReceipt}>
          <VStack style={componentStyles.containerIconReceipt}>
            <FastImage
              source={TopUpPayyuqIcon}
              style={componentStyles.imgIconReceipt}
            />
          </VStack>
          <Spacer height={CustomSpacing(12)} />
          <Text style={[Fonts.titleM]}>
            {datas?.status_name?.includes('Payyuq')
              ? `${datas?.status_name} top up`
              : `${datas?.status_name}`}
          </Text>
          <Text style={[Fonts.label]}>{`Transaction ID ${datas?.code}`}</Text>
          <Spacer height={CustomSpacing(12)} />
          <VStack
            style={[
              {
                backgroundColor:
                  datas.status == 2 || datas.status == 0
                    ? Colors.neutral10
                    : datas.status == 3
                    ? Colors.dangerBorder
                    : Colors.successBorder,
              },
              componentStyles.containerSecondLayerReceipt,
            ]}>
            <VStack
              style={[
                {
                  backgroundColor:
                    datas.status == 2 || datas.status == 0
                      ? Colors.neutral30
                      : datas.status == 3
                      ? Colors.dangerFocus
                      : Colors.successFocus,
                },
                componentStyles.containerFirstLayerReceipt,
              ]}>
              <Text
                style={[
                  Fonts.titleL,
                  {
                    color:
                      datas.status == 2 || datas.status == 0
                        ? Colors.neutral80
                        : datas.status == 3
                        ? Colors.dangerMain
                        : Colors.successMain,
                    fontWeight: 'bold',
                  },
                ]}>
                {`Rp ${Numbro.formatCurrency(datas?.amount)}`}
              </Text>
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(12)} />
          <VStack style={componentStyles.containerMenu}>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionM]}>Added to</Text>
              <Text style={[Fonts.captionMSemiBold]}>Payyuq</Text>
            </HStack>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionM]}>Status</Text>
              <Text
                style={[
                  Fonts.captionMSemiBold,
                  {
                    color:
                      datas.status == 3
                        ? Colors.dangerMain
                        : datas.status == 0
                        ? Colors.warningHover
                        : Colors.neutral100,
                  },
                ]}>
                {datas?.type_name}
              </Text>
            </HStack>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionM]}>Time</Text>
              <Text style={[Fonts.captionMSemiBold]}>
                {moment(datas?.created_at).format('HH:MM')}
              </Text>
            </HStack>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionM]}>date</Text>
              <Text style={[Fonts.captionMSemiBold]}>
                {moment(datas?.created_at).format('DD MMM YYYY')}
              </Text>
            </HStack>
          </VStack>
          <HStack
            style={{
              width: dimensions.screenWidth * 0.82,
              justifyContent: 'space-between',
            }}>
            <View
              style={[
                componentStyles.triangleCorner,
                {
                  transform: [{rotate: '90deg'}],
                },
              ]}
            />
            {Platform.OS === 'android' && (
              <View
                style={{
                  width: dimensions.screenWidth * 0.72,
                  borderTopWidth: Platform.OS === 'ios' ? 0.5 : 1,
                  borderTopColor: Colors.neutral70,
                  borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
                }}
              />
            )}
            <View
              style={[
                componentStyles.triangleCorner,
                {
                  transform: [{rotate: '-90deg'}],
                },
              ]}
            />
          </HStack>
          <VStack style={componentStyles.containerMenu}>
            {/* <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionM]}>Amount</Text>
              <Text style={[Fonts.captionMSemiBold]}>Rp 40.000</Text>
            </HStack> */}
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text style={[Fonts.captionMSemiBold]}>Total</Text>
              <Text style={[Fonts.captionMSemiBold]}>
                {`Rp ${Numbro.formatCurrency(datas?.amount)}`}
              </Text>
            </HStack>
          </VStack>
          <Button
            onPress={() => DownloadReceipt()}
            label="Download"
            type="secondary"
            size="large"
            icon
          />
        </VStack>
      </Animatable.View>
      <Animatable.View
        duration={1000}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.receiptBg}>
        <FastImage source={ReceiptBg} style={componentStyles.imgReceiptBg} />
      </Animatable.View>
    </Animatable.View>
  );
});

export default TransactionReceipt;
