import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {dimensions} from '@config/Platform.config';
import moment from 'moment';
import {useStores} from '@store/root.store';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';

import * as Animatable from 'react-native-animatable';

import styles from './HistoryPayyuq.style';

const DateFilterModal = ({showing, close}) => {
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerId, setDatePickerId] = useState(null);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());

  const handleShowDatePicker = (id?: any) => {
    setDatePickerVisibility(!isDatePickerVisible);
    if (!isDatePickerVisible) {
      setDatePickerId(id);
    } else {
      setDatePickerId(null);
    }
  };

  const submitDateFilter = () => {
    exploreStore.setPayuqHistoryFilterDate({
      dateFrom,
      dateTo,
    });
    close();
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
          close();
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
          <Text style={[Fonts.headlineL]}>Choose transaction date</Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <VStack>
              <Text style={[Fonts.label]}>From</Text>
              <Spacer height={CustomSpacing(4)} />
              <TouchableOpacity
                onPress={() => {
                  handleShowDatePicker('from');
                }}>
                <VStack style={componentStyles.dateContainer}>
                  <Text
                    style={[
                      Fonts.label,
                      {
                        textAlign: 'center',
                      },
                    ]}>
                    {moment(dateFrom).format('DD MMM YYYY')}
                  </Text>
                </VStack>
              </TouchableOpacity>
            </VStack>
            <VStack>
              <Text style={[Fonts.label]}>To</Text>
              <Spacer height={CustomSpacing(4)} />
              <TouchableOpacity
                onPress={() => {
                  handleShowDatePicker('to');
                }}>
                <VStack style={componentStyles.dateContainer}>
                  <Text
                    style={[
                      Fonts.label,
                      {
                        textAlign: 'center',
                      },
                    ]}>
                    {moment(dateTo).format('DD MMM YYYY')}
                  </Text>
                </VStack>
              </TouchableOpacity>
            </VStack>
          </HStack>
          <Spacer height={CustomSpacing(50)} />
          <Button
            onPress={submitDateFilter}
            type="primary"
            label="Set filter"
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
          <DatePicker
            modal
            mode="date"
            maximumDate={new Date()}
            minimumDate={datePickerId === 'from' ? null : dateFrom}
            open={isDatePickerVisible}
            date={dateFrom}
            androidVariant="iosClone"
            onConfirm={(date) => {
              handleShowDatePicker();
              if (datePickerId === 'from') {
                setDateFrom(date);
              } else {
                setDateTo(date);
              }
            }}
            onCancel={() => {
              handleShowDatePicker();
            }}
          />
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default DateFilterModal;
