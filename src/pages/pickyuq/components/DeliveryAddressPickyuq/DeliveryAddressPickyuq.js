import React, {useState, useMemo, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  ScrollView,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {CustomSpacing, Rounded, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button, SelectMaps} from '@components';
import {dimensions} from '@config/Platform.config';
import {useStores} from '@store/root.store';
import SaveAddressPickyuqModal from './SaveAddressPickyuqModal';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import {
  BackGreyIcon,
  LocationIcon,
  SearchOutlineIcon,
  HomeIcon,
  BuildingIcon,
  BookmarkIcon,
  CurrentLocationIcon,
  SelectMapIcon,
  AddBookmarkIcon,
  SelectLocationIcon,
  EmptyLocationIcon,
  ChevronRightIcon,
} from '@assets';

import styles from './DeliveryAddressPickyuq.style';

const DeliveryAddressPickyuq = () => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const navigation = useNavigation();
  const componentStyles = styles();
  const notFound = false;
  const [isOpenMaps, setIsOpenMaps] = useState(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);
  const handleSelectedSavedAddress = (address) => {
    exploreStore.setCurrentDeliveryAddress(
      address.long,
      address.lat,
      address.address,
      address.title,
    );
    goBack();
  };

  const handleSelectedAddress = (address) => {
    setSelectedAddress(address);
  };

  const currentLocation = useMemo(
    () => exploreStore.currentLocationAddress.address,
    [exploreStore.currentLocationAddress],
  );
  const [savedAddress, setSavedAddress] = useState({
    home: [],
    office: [],
    other: [],
  });

  const handleOpenSaveAddressModal = () => {
    setShowSaveAddressModal(!showSaveAddressModal);
    if (selectedAddress !== null && showSaveAddressModal) {
      exploreStore.getAddressList();
      setSelectedAddress(null);
    }
  };

  const goToMaps = async () => {
    const validMap = await requestLocationPermission();
    if (validMap) {
      exploreStore.setTempAddress(
        exploreStore.currentDeliveryAddress.lng,
        exploreStore.currentDeliveryAddress.lat,
        exploreStore.currentDeliveryAddress.address,
        exploreStore.currentDeliveryAddress.header,
      );
      navigation.navigate('SelectMaps');
    } else {
      Alert.alert(
        'Warning',
        'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you.',
        [
          {
            text: 'Ask me later',
            onPress: () => console.log('Ask me later pressed'),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => requestLocationPermission()},
        ],
      );
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          console.log('IOS GRANTED LOCATION');
          setPermissionLocationStatus(true);
          return true;
        } else {
          console.log('IOS NOT GRANTED LOCATION');
          setPermissionLocationStatus(false);
          return false;
        }
      } catch (err) {
        console.log('Permission error', err);
        return false;
      }
    } else {
      try {
        // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message:
              'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          console.log('ANDROID GRANTED LOCATION');
          setPermissionLocationStatus(true);
          return true;
        } else {
          console.log('ANDROID NOT GRANTED LOCATION');
          setPermissionLocationStatus(false);
          return false;
        }
      } catch (err) {
        console.log('Permission error', err);
        return false;
      }
    }
  };
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const parseIconSaveLocation = (type) => {
    if (type === 1) {
      return HomeIcon;
    } else if (type === 2) {
      return BuildingIcon;
    } else if (type === 3) {
      return BookmarkIcon;
    }
  };

  const goToSavedAddress = () => {
    navigation.navigate('SavedAddress');
  };

  useEffect(() => {
    if (
      exploreStore.addressListData !== null &&
      exploreStore.addressListData.usersaddress
    ) {
      const home = exploreStore.addressListData.usersaddress.home ?? [];
      const office = exploreStore.addressListData.usersaddress.office ?? [];
      const other = exploreStore.addressListData.usersaddress.other ?? [];
      setSavedAddress({
        home,
        office,
        other,
      });
    }
  }, [exploreStore.addressListData, showSaveAddressModal]);

  useEffect(() => {
    exploreStore.getAddressList();
  }, []);

  useEffect(() => {
    if (selectedAddress !== null) {
      handleOpenSaveAddressModal();
    }
  }, [selectedAddress]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <VStack style={componentStyles.deliveryAddressContainer}>
        <Spacer topSafeAreaHeight />
        {/* ------ Search Bar ------ */}
        {/* <HStack style={{paddingHorizontal: CustomSpacing(16)}}>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgBackIcon}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(12)} />
          <HStack style={componentStyles.searchBarContainer}>
            <HStack>
              <FastImage
                source={LocationIcon}
                style={componentStyles.imgLocationIcon}
              />
              <Spacer width={CustomSpacing(6)} />
              <TextInput
                placeholder="Find delivery address"
                style={componentStyles.searchInput}
                underlineColorAndroid="transparent"
              />
            </HStack>
            <FastImage
              source={SearchOutlineIcon}
              style={componentStyles.imgSearchOutlineIcon}
            />
          </HStack>
        </HStack> */}
        {/* ------ Google Search Bar ------ */}
        <HStack
          style={{
            paddingHorizontal: CustomSpacing(16),
          }}>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgBackIcon}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(12)} />
          <HStack>
            <GooglePlacesAutocomplete
              style={{color: Colors.neutral70}}
              placeholder="Type a place"
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
                goBack();
              }}
              onFail={(error) => console.log(error)}
              onNotFound={() => console.log('no results')}
              styles={componentStyles.googlePlacesAutocompleteContainer}
              enablePoweredByContainer={false}
            />
          </HStack>
        </HStack>
        <Spacer height={CustomSpacing(16)} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          fadingEdgeLength={CustomSpacing(500)}>
          {notFound ? (
            <VStack style={componentStyles.containerNotFound}>
              <Spacer height={CustomSpacing(45)} />
              <FastImage
                source={EmptyLocationIcon}
                style={componentStyles.imgEmptyLocation}
              />
              <Spacer height={CustomSpacing(16)} />
              <Text
                style={[
                  Fonts.label,
                  {color: Colors.neutral60, textAlign: 'center'},
                ]}>
                {t('wlFailedGetLocation')}
              </Text>
              <TouchableOpacity onPress={goToMaps} activeOpacity={0.8}>
                <HStack style={componentStyles.chooseFromMapContainer}>
                  <HStack>
                    <FastImage
                      source={SelectMapIcon}
                      style={componentStyles.imgSelectMap}
                    />

                    <Spacer width={CustomSpacing(16)} />
                    <VStack>
                      <Text style={[Fonts.label]}> {t('wlChaoiceMap')}</Text>
                    </VStack>
                  </HStack>
                  <FastImage
                    source={ChevronRightIcon}
                    style={componentStyles.imgChevronRight}
                  />
                </HStack>
              </TouchableOpacity>
            </VStack>
          ) : (
            <VStack>
              {/* ------ Current Location------ */}

              <VStack style={componentStyles.containerCurrentLocation}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                  }}>
                  <HStack>
                    <VStack
                      style={{
                        marginTop: CustomSpacing(5),
                        alignSelf: 'flex-start',
                      }}>
                      <FastImage
                        source={CurrentLocationIcon}
                        style={componentStyles.imgCurrentLocation}
                      />
                    </VStack>
                    <Spacer width={CustomSpacing(16)} />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        exploreStore.setCurrentDeliveryAddress(
                          exploreStore.currentLocationAddress.lng,
                          exploreStore.currentLocationAddress.lat,
                          exploreStore.currentLocationAddress.address,
                        );
                        goBack();
                      }}>
                      <VStack>
                        <Text style={[Fonts.labelSemiBold]}>
                          {t('wlMyLocation')}
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text
                          style={[
                            Fonts.captionM,
                            {maxWidth: dimensions.screenWidth * 0.7},
                          ]}>
                          {currentLocation}
                        </Text>
                      </VStack>
                    </TouchableOpacity>
                  </HStack>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelectedAddress(
                        exploreStore.currentLocationAddress,
                      );
                    }}
                    style={{
                      padding: CustomSpacing(7),
                    }}>
                    <FastImage
                      source={AddBookmarkIcon}
                      style={componentStyles.imgAddBookmark}
                    />
                  </TouchableOpacity>
                </HStack>
              </VStack>

              {/* ------ Select on Map ------ */}
              <TouchableOpacity onPress={goToMaps} activeOpacity={0.8}>
                <VStack style={componentStyles.containerSelectOnMap}>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <HStack>
                      <VStack>
                        <FastImage
                          source={SelectMapIcon}
                          style={componentStyles.imgSelectMap}
                        />
                      </VStack>
                      <Spacer width={CustomSpacing(16)} />
                      <VStack>
                        <Text style={[Fonts.labelSemiBold]}>
                          {t('wlSelectMap')}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                </VStack>
              </TouchableOpacity>
              {/* ------ Save Location------ */}
              {savedAddress.home.length > 0 ||
              savedAddress.office.length > 0 ||
              savedAddress.other.length > 0 ? (
                <VStack
                  style={{
                    paddingHorizontal: CustomSpacing(16),
                  }}>
                  <Spacer height={CustomSpacing(16)} />
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <Text style={[Fonts.subhead]}>{t('wlSavedAddress')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={goToSavedAddress}>
                      <Text
                        style={[
                          Fonts.captionM,
                          {
                            color: Colors.secondaryMain,
                          },
                        ]}>
                        {t('wlManage')}
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                </VStack>
              ) : null}
              <HStack style={componentStyles.containerSeparator}>
                {savedAddress.home.map((item, index) => (
                  <TouchableOpacity
                    key={`save-loc-${index}`}
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelectedSavedAddress(item);
                    }}>
                    <HStack style={componentStyles.containerSaveLocation}>
                      <FastImage
                        source={parseIconSaveLocation(item.type)}
                        style={componentStyles.imgSaveLocation}
                      />
                      <Spacer width={CustomSpacing(6)} />
                      <Text stlye={[Fonts.captionM]}>{item.title}</Text>
                    </HStack>
                  </TouchableOpacity>
                ))}
                {savedAddress.office.map((item, index) => (
                  <TouchableOpacity
                    key={`save-loc-${index}`}
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelectedSavedAddress(item);
                    }}>
                    <HStack style={componentStyles.containerSaveLocation}>
                      <FastImage
                        source={parseIconSaveLocation(item.type)}
                        style={componentStyles.imgSaveLocation}
                      />
                      <Spacer width={CustomSpacing(6)} />
                      <Text stlye={[Fonts.captionM]}>{item.title}</Text>
                    </HStack>
                  </TouchableOpacity>
                ))}
                {savedAddress.other.map((item, index) => (
                  <TouchableOpacity
                    key={`save-loc-${index}`}
                    activeOpacity={0.8}
                    onPress={() => {
                      handleSelectedSavedAddress(item);
                    }}>
                    <HStack style={componentStyles.containerSaveLocation}>
                      <FastImage
                        source={parseIconSaveLocation(item.type)}
                        style={componentStyles.imgSaveLocation}
                      />
                      <Spacer width={CustomSpacing(6)} />
                      <Text stlye={[Fonts.captionM]}>{item.title}</Text>
                    </HStack>
                  </TouchableOpacity>
                ))}
                <Spacer width={CustomSpacing(16)} />
              </HStack>
              {/* ------ Frequently used ------ */}

              <VStack
                style={{
                  padding: CustomSpacing(16),
                }}>
                <Text style={[Fonts.subhead]}>{t('wlFrequentlyUsed')}</Text>
                <Spacer height={CustomSpacing(16)} />
                {exploreStore.freqUsedAddress.length === 0 && (
                  <Text style={[Fonts.subhead, , {textAlign: 'center'}]}>
                    {t('wlNoData')}
                  </Text>
                )}
                {exploreStore.freqUsedAddress.map((item, index) => (
                  <VStack
                    key={`freq-userd-${index}`}
                    paddingTop={
                      index === 0 ? CustomSpacing(0) : CustomSpacing(16)
                    }>
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
                            style={componentStyles.imgSelectLocation}
                          />
                        </VStack>
                        <Spacer width={CustomSpacing(16)} />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            exploreStore.setCurrentDeliveryAddress(
                              item.lng,
                              item.lat,
                              item.address,
                            );
                            goBack();
                          }}>
                          <VStack>
                            <Text
                              numberOfLines={1}
                              style={[
                                Fonts.labelSemiBold,
                                {
                                  color: Colors.neutral70,
                                  maxWidth: dimensions.screenWidth * 0.65,
                                },
                              ]}>
                              {item.header}
                            </Text>
                            <Spacer height={CustomSpacing(2)} />
                            <Text
                              style={[
                                Fonts.captionM,

                                componentStyles.addressContainer,
                                {color: Colors.neutral70},
                              ]}>
                              {item.address}
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                      </HStack>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          handleSelectedAddress(item);
                        }}
                        style={{
                          padding: CustomSpacing(7),
                        }}>
                        <FastImage
                          source={AddBookmarkIcon}
                          style={componentStyles.imgAddBookmark}
                        />
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                ))}
              </VStack>
            </VStack>
          )}
        </ScrollView>
        <SaveAddressPickyuqModal
          showing={showSaveAddressModal}
          close={handleOpenSaveAddressModal}
          selectedAddress={selectedAddress}
        />
      </VStack>
    </TouchableWithoutFeedback>
  );
};

export default DeliveryAddressPickyuq;
