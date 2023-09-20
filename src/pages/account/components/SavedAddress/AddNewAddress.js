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
import {VStack, HStack, Spacer, SelectMaps} from '@components';
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

const AddNewAddress = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const [searchString, setSearchString] = useState('');
  const [searchResult, setSearchResult] = useState(
    exploreStore.freqUsedAddress,
  );

  const goToAddNewAddressForm = (data) => {
    navigation.navigate('AddNewAddressForm', {
      data,
    });
  };

  const componentStyles = styles();
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (searchString?.length > 0) {
      const result = exploreStore.freqUsedAddress.filter((item) =>
        item.address.toLowerCase().includes(searchString.toLowerCase()),
      );
      setSearchResult(result);
    } else {
      setSearchResult(exploreStore.freqUsedAddress);
    }
  }, [searchString]);

  const goToMaps = () => {
    navigation.navigate('SavedFromMaps');
  };

  return (
    <VStack style={componentStyles.containerAddNewAddress}>
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
            <Text style={[Fonts.subhead]}>{t('addNewAddress')}</Text>
            <View
              style={{
                width: CustomSpacing(24),
                height: CustomSpacing(24),
              }}
            />
          </HStack>
        </VStack>
        <Spacer height={CustomSpacing(20)} />
        {/* ------ Search Input ------ */}
        <VStack>
          <HStack style={componentStyles.containerSearchInput}>
            <FastImage
              source={SearchOutlineIcon}
              style={componentStyles.imgSearchIcon}
            />
            <Spacer width={CustomSpacing(8)} />
            <TextInput
              placeholder={t('enterAddress')}
              underlineColorAndroid="transparent"
              value={searchString}
              onChangeText={(text) => setSearchString(text)}
              style={componentStyles.searchInput}
            />
          </HStack>
        </VStack>
      </VStack>

      {/* ------ List Content ------ */}
      <ScrollView
        style={{
          flex: 1,
          padding: CustomSpacing(16),
          backgroundColor: Colors.neutral10,
        }}>
        {searchResult.map((item, index) => (
          <VStack
            key={`freq-userd-${index}`}
            paddingTop={index === 0 ? CustomSpacing(0) : CustomSpacing(16)}>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <HStack>
                <VStack
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  <FastImage
                    source={SelectLocationIcon}
                    style={{
                      width: CustomSpacing(26),
                      height: CustomSpacing(26),
                      resizeMode: 'contain',
                    }}
                  />
                </VStack>
                <Spacer width={CustomSpacing(16)} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    goToAddNewAddressForm(item);
                  }}>
                  <VStack>
                    <Text style={[Fonts.labelSemiBold]}>{item.header}</Text>
                    <Spacer height={CustomSpacing(2)} />
                    <Text
                      style={[
                        Fonts.captionM,
                        {
                          maxWidth: dimensions.screenWidth * 0.8,
                          borderBottomColor: Colors.neutral50,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          paddingBottom: CustomSpacing(8),
                        },
                      ]}>
                      {item.address}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </HStack>
            </HStack>
          </VStack>
        ))}
      </ScrollView>

      {/* ------ Select from map ------ */}
      <HStack style={componentStyles.containerSelectFromMap}>
        <TouchableOpacity activeOpacity={0.8} onPress={goToMaps}>
          <HStack>
            <FastImage
              source={SelectMapIcon}
              style={componentStyles.imgSelectMapIcon}
            />
            <Spacer width={CustomSpacing(16)} />
            <VStack>
              <Text style={[Fonts.label]}>{t('chooseFromMap')}</Text>
            </VStack>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={goToMaps}>
          <FastImage
            source={ChevronRightIcon}
            style={componentStyles.imgChevronRight}
          />
        </TouchableOpacity>
      </HStack>

      {/* <SelectMaps showing={isOpenMaps} close={handleOpenMaps} /> */}
    </VStack>
  );
});

export default AddNewAddress;
