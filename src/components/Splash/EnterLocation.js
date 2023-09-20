import React, {useRef, useMemo} from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Numbro from '@utils/numbro';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {useStores} from '@store/root.store';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {dimensions} from '@config/Platform.config';
import {
  SearchOutlineIcon,
  FilterIcon,
  WhiteBackIcon,
  StarIcon,
  TagIcon,
  WhiteSuperIcon,
  ShopOrangeIcon,
  PizzahutIcon,
  LikeOrangeIcon,
  VoucherOrangeIcon,
  LikeIcon,
  ChevronRightIcon,
  HugMap,
  CloseOutlineIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './Splash.style';
import * as Animatable from 'react-native-animatable';

const EnterLocation = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore, routerStore} = useStores();
  const googlePlaceAutoCompleteRef = useRef(null);
  const filterType = useMemo(
    () => exploreStore?.routerFilterType,
    [exploreStore.routerFilterType],
  );

  const componentStyles = styles();
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <VStack
      style={{
        flex: 1,
      }}>
      {/* ------ Navigator & Search Bar ------ */}
      <VStack style={componentStyles.navigatorContainer}>
        <VStack
          style={{
            padding: CustomSpacing(16),
            backgroundColor: Colors.neutral10,
            borderRadius: Rounded.xl,
          }}>
          <Spacer topSafeAreaHeight />
          <HStack>
            <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
              <FastImage
                source={WhiteBackIcon}
                style={componentStyles.imgBackIcon}
              />
            </TouchableOpacity>
            <Spacer width={CustomSpacing(53)} />
            <Text style={[Fonts.headlineL]}>Enter My Location</Text>
          </HStack>
        </VStack>
        <HStack style={componentStyles.searchBarContainer}>
          <GooglePlacesAutocomplete
            ref={googlePlaceAutoCompleteRef}
            style={{color: Colors.neutral70}}
            placeholder="Enter the address"
            query={{key: 'AIzaSyAM123dP-ZnklHIa_oqV93aJF3_5zrXl_U'}}
            fetchDetails={true}
            onPress={(data, details = null) => {
              exploreStore.setCurrentDeliveryAddress(
                details?.geometry?.location.lng,
                details?.geometry?.location.lat,
                data.description,
              );
              exploreStore.setFreqUsedAddress({
                address: data.description,
                lat: details?.geometry?.location.lat,
                lng: details?.geometry?.location.lng,
                header: data.description.substring(
                  0,
                  data.description.indexOf(','),
                ),
              });
            }}
            onFail={(error) => console.log(error)}
            onNotFound={() => console.log('no results')}
            styles={componentStyles.googlePlacesAutocompleteContainer}
            enablePoweredByContainer={false}
            renderLeftButton={() => (
              <FastImage
                source={SearchOutlineIcon}
                style={componentStyles.imgSearchIcon}
              />
            )}
            renderRightButton={() => (
              <HStack>
                {Platform.OS === 'ios' ? null : (
                  <TouchableOpacity
                    onPress={() =>
                      googlePlaceAutoCompleteRef.current?.setAddressText('')
                    }>
                    <FastImage
                      source={CloseOutlineIcon}
                      style={componentStyles.imgSearchIcon}
                    />
                  </TouchableOpacity>
                )}
              </HStack>
            )}
          />
        </HStack>
      </VStack>
      <VStack
        style={{
          backgroundColor: Colors.mainBackground,
          // flex: 1,
        }}>
        {/* <Spacer height={CustomSpacing(dimensions.screenWidth * 9)} /> */}

        {exploreStore?.currentDeliveryAddress?.lng ? (
          <Animatable.View animation="bounceInRight" delay={200}>
            <TouchableOpacity
              onPress={() => {
                exploreStore.setTempAddress(
                  exploreStore.currentDeliveryAddress.lng,
                  exploreStore.currentDeliveryAddress.lat,
                  exploreStore.currentDeliveryAddress.address,
                  exploreStore.currentDeliveryAddress.header,
                );
                navigation.navigate('SelectMapsSplash');
              }}
              style={{marginBottom: CustomSpacing(23)}}>
              <HStack
                style={{
                  marginHorizontal: 23,
                  backgroundColor: Colors.neutral10,
                  padding: CustomSpacing(12),
                  borderRadius: Rounded.l,
                  justifyContent: 'space-between',
                }}>
                <HStack>
                  <FastImage
                    source={HugMap}
                    style={componentStyles.imgBackIcon}
                  />
                  <Spacer width={CustomSpacing(12)} />
                  <Text style={[Fonts.label]}>Choose from Map</Text>
                </HStack>
                <FastImage
                  source={ChevronRightIcon}
                  style={componentStyles.imgIconLike}
                />
              </HStack>
            </TouchableOpacity>
          </Animatable.View>
        ) : null}

        <VStack
          style={{
            backgroundColor: Colors.neutral10,
            paddingHorizontal: CustomSpacing(16),
          }}>
          <Spacer height={CustomSpacing(16)} />
          <HStack>
            <Button
              label="Confirm"
              type="primary"
              onPress={async () => {
                await exploreStore.setCurrentDeliveryAddress(
                  exploreStore.currentDeliveryAddress.lng,
                  exploreStore.currentDeliveryAddress.lat,
                  exploreStore.currentDeliveryAddress.address,
                );
                await exploreStore.setFreqUsedAddress({
                  address: exploreStore.currentDeliveryAddress.address,
                  lat: exploreStore.currentDeliveryAddress.lat,
                  lng: exploreStore.currentDeliveryAddress.lng,
                  header: exploreStore.currentDeliveryAddress.address.substring(
                    0,
                    exploreStore.currentDeliveryAddress.address.indexOf(','),
                  ),
                });
                await routerStore.setSplashShow(false);
              }}
            />
          </HStack>
          <Spacer height={CustomSpacing(32)} />
        </VStack>
      </VStack>
    </VStack>
  );
});

export default EnterLocation;
