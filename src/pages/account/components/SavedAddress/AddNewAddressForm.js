import React, {useState, useMemo, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {dimensions} from '@config/Platform.config';

import {CustomSpacing, Fonts, Colors} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  ChevronRightIcon,
  ArrowBackOutline,
  SelectMapIcon,
  SearchOutlineIcon,
  SelectLocationIcon,
} from '@assets';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';

import styles from './SavedAddress.style';
import {observer} from 'mobx-react-lite';

const AddNewAddressForm = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const addressData = useMemo(() => route.params.data, [route.params]);
  const componentStyles = styles();
  const navigation = useNavigation();

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
    setTimeout(() => {
      navigation.navigate('SavedAddress');
    }, 500);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (addressData) {
      setFormAddress({
        type: 3,
        title: addressData.header,
        address: addressData.address,
        notes: '',
        contactName: '',
        contactPhone: '',
        lat: String(addressData.lat),
        lng: String(addressData.lng),
      });
    }
  }, []);

  return (
    <VStack
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundMain,
      }}>
      {/* ------ Navigator ------ */}
      <VStack style={componentStyles.containerNavigatorAddNewAddress}>
        <Spacer topSafeAreaHeight />
        <VStack>
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity act1iveOpacity={0.8} onPress={goBack}>
              <FastImage
                source={ArrowBackOutline}
                style={componentStyles.imgArrowBack}
              />
            </TouchableOpacity>
            <Text style={[Fonts.subhead]}>{t('savedAddress')}</Text>
            <View
              style={{
                width: CustomSpacing(24),
                height: CustomSpacing(24),
              }}
            />
          </HStack>
        </VStack>
      </VStack>
      {/* ------ Form ------ */}
      <VStack
        style={{
          padding: CustomSpacing(16),
          backgroundColor: Colors.neutral10,
        }}>
        <Spacer height={CustomSpacing(8)} />
        <VStack>
          <VStack
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral40,
              paddingBottom: CustomSpacing(5),
            }}>
            <HStack>
              <Text style={[Fonts.label]}>{t('name')} </Text>
              <Text style={[Fonts.label, {color: Colors.dangerMain}]}>*</Text>
              <Text style={[Fonts.captionS]}> {t('recommendToReplace')}</Text>
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
          <VStack
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral40,
              paddingBottom: CustomSpacing(5),
            }}>
            <HStack>
              <Text style={[Fonts.label]}>{t('address')} </Text>
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
          <VStack
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral40,
              paddingBottom: CustomSpacing(5),
            }}>
            <HStack>
              <Text style={[Fonts.label]}>{t('note')} </Text>
            </HStack>
            <HStack>
              <TextInput
                multiline
                placeholder={t('meetMeAtTheLobby')}
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
          <VStack
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral40,
              paddingBottom: CustomSpacing(5),
            }}>
            <HStack>
              <Text style={[Fonts.label]}>{t('contactName')} </Text>
            </HStack>
            <HStack>
              <TextInput
                placeholder={t('personTakingCenter')}
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
          <VStack
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral40,
              paddingBottom: CustomSpacing(5),
            }}>
            <HStack>
              <Text style={[Fonts.label]}>{t('contactNumber')} </Text>
            </HStack>
            <HStack>
              <TextInput
                style={[Fonts.label]}
                placeholder={t('personPhoneNumber')}
                value={formAddress.contactPhone}
                maxLength={13}
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  setFormAddress({...formAddress, contactPhone: text})
                }
              />
            </HStack>
          </VStack>
          <Spacer height={CustomSpacing(16)} />
        </VStack>
      </VStack>
      {/* ------ Navigator ------ */}
      <VStack
        style={{
          position: 'absolute',
          bottom: CustomSpacing(0),
          width: '100%',
          backgroundColor: Colors.neutral10,
          paddingHorizontal: CustomSpacing(16),
          paddingVertical: CustomSpacing(16),
        }}>
        <Button
          isSubmitting={exploreStore.createAddressLoading}
          onPress={handleSubmitAddress}
          type="primary"
          label={t('savedAddress')}
        />
        <Spacer height={CustomSpacing(16)} />
      </VStack>
    </VStack>
  );
});

export default AddNewAddressForm;
