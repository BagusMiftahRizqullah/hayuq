import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import {useStores} from '@store/root.store';

import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';

import * as Animatable from 'react-native-animatable';

import styles from './DeliveryAddress.style';

const SaveAddressModal = ({showing, close, selectedAddress}) => {
  const componentStyles = styles();
  const {exploreStore} = useStores();
  const [shouldRender, setShouldRender] = useState(false);
  const [formAddress, setFormAddress] = useState({
    type: 3,
    title: '',
    address: '',
    notes: '',
    lat: '',
    lng: '',
    contactName: '',
    contactPhone: '',
  });

  const handleSubmitAddress = () => {
    exploreStore.createAddress(formAddress);
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
      if (selectedAddress) {
        setFormAddress({
          type: 3,
          title: '',
          notes: '',
          contactName: '',
          contactPhone: '',
          address: selectedAddress.address,
          lat: String(selectedAddress.lat),
          lng: String(selectedAddress.lng),
        });
      }
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
      <TouchableOpacity onPress={close} style={{flex: 1}} />

      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.bottomSheetContainer}>
        <VStack>
          <Text style={[Fonts.headlineL]}>Save address</Text>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>Name </Text>
                <Text style={[Fonts.label, {color: Colors.dangerMain}]}>*</Text>
              </HStack>
              <HStack>
                <TextInput
                  placeholder="e.g School, Gym, Apartment"
                  style={[Fonts.label]}
                  value={formAddress.title}
                  onChangeText={(text) =>
                    setFormAddress({...formAddress, title: text})
                  }
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>Address </Text>
                <Text style={[Fonts.label, {color: Colors.dangerMain}]}>*</Text>
              </HStack>
              <HStack>
                <TextInput
                  multiline
                  placeholder="PT. Hayuq System Indonesia"
                  style={[Fonts.label]}
                  value={formAddress.address}
                  onChangeText={(text) =>
                    setFormAddress({...formAddress, address: text})
                  }
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>Note </Text>
              </HStack>
              <HStack>
                <TextInput
                  multiline
                  placeholder="e.g Meet me at the lobby"
                  style={[Fonts.label]}
                  value={formAddress.notes}
                  onChangeText={(text) =>
                    setFormAddress({...formAddress, notes: text})
                  }
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>Contact Name </Text>
              </HStack>
              <HStack>
                <TextInput
                  placeholder="Person taking order"
                  style={[Fonts.label]}
                  value={formAddress.contactName}
                  onChangeText={(text) =>
                    setFormAddress({...formAddress, contactName: text})
                  }
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              <HStack>
                <Text style={[Fonts.label]}>Contact Number </Text>
              </HStack>
              <HStack>
                <TextInput
                  style={[Fonts.label]}
                  value={formAddress.contactPhone}
                  placeholder="Person phone number"
                  onChangeText={(text) =>
                    setFormAddress({...formAddress, contactPhone: text})
                  }
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
          <Spacer height={CustomSpacing(8)} />
          <Button
            isSubmitting={exploreStore.createAddressLoading}
            onPress={handleSubmitAddress}
            type="primary"
            label="Save Location"
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default SaveAddressModal;
