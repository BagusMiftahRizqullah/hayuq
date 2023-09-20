import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import {useStores} from '@store/root.store';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {EatyuqIcon, TopUpPayyuqIcon, TickCircleIcon} from '@assets';

import * as Animatable from 'react-native-animatable';

import styles from './HistoryPayyuq.style';
import FastImage from 'react-native-fast-image';

const ServiceFilterModal = ({showing, close}) => {
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleSelectedService = (id) => {
    if (selectedService === id) {
      setSelectedService(null);
    } else {
      setSelectedService(id);
      exploreStore.setPayuqHistoryFilterService(id);
    }
  };

  const handleSubmitFilterService = () => {
    if (selectedService !== null) {
      exploreStore.setPayuqHistoryFilterService({
        id: selectedService,
        name: serviceData[selectedService - 1].name,
      });
    } else {
      exploreStore.setPayuqHistoryFilterService(null);
    }
    close();
  };

  const serviceData = [
    {
      id: 1,
      name: 'Top Up',
      icon: TopUpPayyuqIcon,
    },
    {
      id: 2,
      name: 'EatYuq',
      icon: EatyuqIcon,
    },
  ];

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
          <Text style={[Fonts.headlineL]}>Choose transaction service</Text>
          <Spacer height={CustomSpacing(41)} />
          <HStack
            style={{
              justifyContent: 'space-evenly',
            }}>
            {serviceData.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectedService(item.id)}
                key={`service-${index}`}>
                <VStack
                  style={{
                    backgroundColor:
                      item.id === 1
                        ? Colors.supportSurface
                        : Colors.dangerSurface,
                    padding: CustomSpacing(10),
                    borderRadius: CustomSpacing(40),
                  }}>
                  <FastImage
                    source={item.icon}
                    style={{
                      width: CustomSpacing(42),
                      height: CustomSpacing(42),
                    }}
                  />
                  {selectedService === item.id && (
                    <FastImage
                      source={TickCircleIcon}
                      style={componentStyles.imgTickCircle}
                    />
                  )}
                </VStack>
                <Spacer height={CustomSpacing(10)} />
                <Text style={[Fonts.label, {textAlign: 'center'}]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
          <Spacer height={CustomSpacing(50)} />
          <Button
            type="primary"
            label="Set filter"
            onPress={handleSubmitFilterService}
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default ServiceFilterModal;
