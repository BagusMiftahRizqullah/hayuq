import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Image,
} from 'react-native';
import numbro from 'numbro';
import {useStores} from '@store/root.store';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Button, Spacer} from '@components';
import {CloseOutlineIcon} from '@assets';

import * as Animatable from 'react-native-animatable';

import styles from './HistoryPayyuq.style';
import FastImage from 'react-native-fast-image';

const TopUpFormModal = ({
  showing,
  close,
  amountTopUp,
  setAmountTopUp,
  goTopUp,
}) => {
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templateTopUp = [
    {id: 1, amount: 50000},
    {id: 2, amount: 100000},
    {id: 3, amount: 150000},
    {id: 4, amount: 250000},
    {id: 5, amount: 300000},
    {id: 6, amount: 350000},
  ];

  const isDisabledBtn = amountTopUp !== '' ? false : true;

  const handleCloseModal = () => {
    close();
    setAmountTopUp('');
  };

  const handleInputAmount = (value) => {
    setAmountTopUp(value?.toString());
  };

  const handleClickCardAmount = (id, amount) => {
    if (selectedTemplate === id) {
      handleInputAmount('');
      setSelectedTemplate('');
    } else {
      handleInputAmount(amount);
      setSelectedTemplate(id);
    }
  };

  useEffect(() => {
    const data =
      selectedTemplate &&
      templateTopUp.filter((e) => e.id === selectedTemplate)[0];
    if (parseInt(amountTopUp) !== data.amount) {
      setSelectedTemplate('');
    }
  }, [amountTopUp]);

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.containerNavigatorForm}>
        <Text style={[Fonts.subhead]}>Transaction Receipt</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={handleCloseModal}>
          <FastImage
            source={CloseOutlineIcon}
            style={componentStyles.imgCloseTopUpForm}
          />
        </TouchableOpacity>
      </HStack>
    );
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
          handleCloseModal();
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
          <NavigatorBar />
          <Text style={[Fonts.label, {color: Colors.neutral80}]}>
            Enter Amount
          </Text>
          <TextInput
            value={amountTopUp}
            style={componentStyles.inputAmountTopUp}
            inputMode="numeric"
            keyboardType="numeric"
            onChangeText={handleInputAmount}
          />
          <Text
            style={[
              Fonts.captionS,
              {color: Colors.neutral60, marginTop: CustomSpacing(8)},
            ]}>
            *minimum top up Rp 10.000
          </Text>
          <HStack style={componentStyles.containerCardAmountTopUp}>
            {templateTopUp.map((value, index) => (
              <TouchableOpacity
                key={`amount-topup-${index}`}
                activeOpacity={0.8}
                style={[
                  componentStyles.cardAmountTopUp,
                  {
                    backgroundColor:
                      selectedTemplate === value.id
                        ? Colors.supportMain
                        : Colors.neutral10,
                  },
                ]}
                onPress={() => handleClickCardAmount(value.id, value.amount)}>
                <Text
                  style={[
                    Fonts.subhead,
                    {
                      marginRight: CustomSpacing(5),
                      color:
                        selectedTemplate === value.id
                          ? Colors.neutral10
                          : Colors.neutral100,
                    },
                  ]}>
                  Rp
                </Text>
                <Text
                  style={[
                    Fonts.bodySemiBold,
                    {
                      color:
                        selectedTemplate === value.id
                          ? Colors.neutral10
                          : Colors.neutral100,
                    },
                  ]}>
                  {numbro(value.amount).format({thousandSeparated: true})}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
          <Spacer height={CustomSpacing(20)} />
          <Button
            onPress={goTopUp}
            label="Confirm & Top up"
            disabled={isDisabledBtn}
          />
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default TopUpFormModal;
