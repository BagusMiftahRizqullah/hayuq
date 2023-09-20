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
  WhiteBackIcon,
  LocationCoordinate,
  ChevronRightIcon,
  HugMap,
  CloseOutlineIcon,
} from '@assets';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './MapsPickyuq.style';
import * as Animatable from 'react-native-animatable';

const EnterLocationPickyuq = observer((props) => {
  const {t, i18n} = useTranslation();
  const {exploreStore, pickyuqStore} = useStores();
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
          <HStack style={{justifyContent: 'space-between'}}>
            <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
              <FastImage
                source={WhiteBackIcon}
                style={componentStyles.imgBackIcon}
              />
            </TouchableOpacity>
            {/* <Spacer width={CustomSpacing(43)} /> */}
            <Text style={[Fonts.headlineL]}>{t('HpickupWhere')}</Text>
            <Spacer width={CustomSpacing(12)} />
          </HStack>
        </VStack>
        <HStack style={componentStyles.searchBarContainer}>
          <GooglePlacesAutocomplete
            ref={googlePlaceAutoCompleteRef}
            style={{color: Colors.neutral70}}
            placeholder="Enter the address"
            query={{key: 'AIzaSyAM123dP-ZnklHIa_oqV93aJF3_5zrXl_U'}}
            fetchDetails={true}
            onPress={async (data, details = null) => {
              await pickyuqStore.setPickUpLocationAddress(
                details?.geometry?.location.lng,
                details?.geometry?.location.lat,
                data.description,
                data.description.substring(0, data.description.indexOf(',')),
              );
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
        <Spacer height={CustomSpacing(8)} />

        {pickyuqStore?.pickupLocation ? (
          <HStack
            style={{
              marginHorizontal: 23,
              backgroundColor: Colors.primarySurface,
              padding: CustomSpacing(12),
              borderRadius: Rounded.l,
              // width:
              //   Platform.OS == 'ios' ? CustomSpacing(280) : CustomSpacing(312),
            }}>
            <FastImage
              source={LocationCoordinate}
              style={componentStyles.imgBackIcon}
            />
            <Spacer width={CustomSpacing(12)} />
            <VStack
              style={{
                width: CustomSpacing(243),
              }}>
              <Text style={[Fonts.labelSemiBold]}>{t('wlLocationNow')}</Text>
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={[Fonts.captionM, {maxWidth: CustomSpacing(212)}]}>
                {pickyuqStore?.pickupLocation?.address}
              </Text>
            </VStack>
          </HStack>
        ) : null}
      </VStack>
      <VStack
        style={{
          backgroundColor: Colors.mainBackground,
          // flex: 1,
        }}>
        {/* <Spacer height={CustomSpacing(dimensions.screenWidth * 9)} /> */}

        {pickyuqStore?.pickupLocation?.address ? (
          <Animatable.View animation="bounceInRight" delay={200}>
            <TouchableOpacity
              onPress={() => {
                // pickyuqStore.setPickUpLocationAddress(
                //   pickyuqStore.pickupLocation.lng,
                //   pickyuqStore.pickupLocation.lat,
                //   pickyuqStore.pickupLocation.address,
                //   pickyuqStore.pickupLocation.header,
                // );
                navigation.navigate('SelectMapsPickyuq', {
                  from: props?.route?.params?.from,
                });
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
                  <Text style={[Fonts.label]}>{t('wlSelectOnMap')}</Text>
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
              disabled={pickyuqStore?.pickupLocation?.lat ? false : true}
              label={t('wlConfirmPickUser')}
              type="primary"
              onPress={() => {
                pickyuqStore.setPickUpLocationAddress(
                  pickyuqStore.pickupLocation.lng,
                  pickyuqStore.pickupLocation.lat,
                  pickyuqStore.pickupLocation.address,
                  pickyuqStore.pickupLocation.header,
                );
                if (props?.route?.params?.from == 'PickyuqCheckout') {
                  navigation.navigate('CheckoutPickyuq');
                } else {
                  navigation.navigate('EnterLocationDestination');
                }
              }}
            />
          </HStack>
          <Spacer height={CustomSpacing(32)} />
        </VStack>
      </VStack>
    </VStack>
  );
});

export default EnterLocationPickyuq;
