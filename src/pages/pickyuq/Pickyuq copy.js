import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  LogBox,
} from 'react-native';
import {dimensions} from '@config/Platform.config';

import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  BackGreyIcon,
  StarIcon,
  AffiliateBg,
  SearchOutlineIcon,
  LocationIcon,
  LocationAdd,
  james,
  Time,
  AddBookmarkIcon,
  PickyuqBG,
  PhoneBG,
  BikeBG,
} from '@assets';
import styles from './Pickyuq.style';
import MapboxGL, {Logger, PointAnnotation} from '@rnmapbox/maps';
import Geocoder from 'react-native-geocoding';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useTranslation} from 'react-i18next';
import Numbro from '@utils/numbro';
import moment from 'moment';
import CONFIG from '@config';
import {Rating, AirbnbRating} from 'react-native-ratings';
import MapView, {Marker} from 'react-native-maps';

Geocoder.init(CONFIG.GOOGLE_API_KEY);
// import Geolocation from '@react-native-community/geolocation';
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'Warning: Failed prop type:',
]);
const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.004;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Pickyuq = observer(() => {
  const {t, i18n} = useTranslation();
  const mapRef = useRef(null);
  const {exploreStore, pickyuqStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [affiliateData, setAffiliateData] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [statusAffiliate, setStatusAffiliate] = useState(true);
  const [recenter, setRecenter] = useState('compass');
  const [tempLocation, setTempLocation] = useState({
    latitude: exploreStore.tempDeliveryAddress.lat,
    longitude: exploreStore.tempDeliveryAddress.lng,
  });

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    pickyuqStore.clearPickyuqStore();
    pickyuqStore.getOrderPickyuq();
  }, []);

  return (
    <VStack
      style={{
        height: '100%',
        backgroundColor: Colors.neutral20,
      }}>
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={PickyuqBG}
            style={componentStyles.imgPickyuqBg}
            resizeMode="cover"
          />
        </Animatable.View>
        <Animatable.View animation="bounceInLeft" delay={200}>
          <FastImage
            source={BikeBG}
            style={{
              width: 105,
              height: CustomSpacing(110),
              position: 'absolute',
              left: 42,
              top: -124,
              zIndex: 1000,
            }}
          />
        </Animatable.View>
        <Animatable.View animation="bounceInUp" delay={200}>
          <FastImage
            source={PhoneBG}
            style={{
              width: 100,
              height: CustomSpacing(120),
              position: 'absolute',
              right: 34,
              top: -130,
              zIndex: 1000,
            }}
          />
        </Animatable.View>
        <HStack
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? CustomSpacing(44) : CustomSpacing(24),
            left: CustomSpacing(18),
          }}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgGoback}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
        </HStack>
      </VStack>
      <Spacer height={CustomSpacing(12)} />
      <VStack style={{backgroundColor: Colors.neutral10, zIndex: 1000}}>
        {/* Search lOCATION */}
        <VStack
          style={{
            paddingHorizontal: CustomSpacing(16),
            position: 'absolute',
            bottom: CustomSpacing(-53),
            // top: -CustomSpacing(1),
            width: '100%',
          }}>
          <TouchableWithoutFeedback accessible={false}>
            <HStack style={componentStyles.searchBarContainer}>
              <HStack>
                <FastImage
                  source={LocationIcon}
                  style={componentStyles.imgSearchLocationIcon}
                />

                <Spacer width={CustomSpacing(12)} />
                <Text
                  style={[
                    Fonts.labelSemiBold,
                    {
                      color: Colors.neutral90,
                    },
                  ]}>
                  Ingin pergi kemana ?
                </Text>
              </HStack>
              <FastImage
                source={SearchOutlineIcon}
                style={componentStyles.imgSearchOutlineIcon}
              />
            </HStack>
          </TouchableWithoutFeedback>
        </VStack>
      </VStack>
      <ScrollView
        style={{
          height: '100%',
          backgroundColor: Colors.backgroundColor,
        }}>
        {/* ------ Header------ */}

        <Spacer height={CustomSpacing(63)} />

        <VStack>
          <TouchableOpacity
            onPress={() => {
              pickyuqStore.setPickUpLocationAddress(
                exploreStore.currentDeliveryAddress.lng,
                exploreStore.currentDeliveryAddress.lat,
                exploreStore.currentDeliveryAddress.address,
                exploreStore.currentDeliveryAddress.header,
              );
              navigation.navigate('SelectMapsPickyuq');
            }}
            style={componentStyles.containerCard}>
            <VStack
              style={{
                height: CustomSpacing(dimensions.screenWidth - 275),
                width: CustomSpacing(dimensions.screenWidth - 80),
                position: 'absolute',
                zIndex: 1000,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.neutral60,
                opacity: 0.6,
                // borderRadius: Rounded.xl,
              }}>
              <Text
                style={[
                  Fonts.headlineL,
                  {
                    fontSize: 23,
                    color: Colors.primaryMain,
                  },
                ]}>
                Lihat Peta
              </Text>
            </VStack>
            <MapView
              ref={mapRef}
              initialRegion={{
                latitude: exploreStore.tempDeliveryAddress.lat
                  ? exploreStore.tempDeliveryAddress.lat
                  : 0.1,
                longitude: exploreStore.tempDeliveryAddress.lng
                  ? exploreStore.tempDeliveryAddress.lng
                  : 0.1,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              style={{
                alignSelf: 'center',
                borderRadius: Rounded.xl,
                height: CustomSpacing(dimensions.screenWidth - 275),
                width: CustomSpacing(dimensions.screenWidth - 82),
                zIndex: -10,
              }}
              zoomEnabled={true}
              showsUserLocation={true}>
              {exploreStore.tempDeliveryAddress.lat &&
              exploreStore.tempDeliveryAddress.lat ? (
                <Marker
                  coordinate={{
                    latitude: parseFloat(exploreStore.tempDeliveryAddress.lat),
                    longitude: parseFloat(
                      exploreStore.tempDeliveryAddress?.lng,
                    ),
                  }}
                  pinColor="red"
                />
              ) : null}
            </MapView>
          </TouchableOpacity>
        </VStack>

        <Spacer height={CustomSpacing(23)} />
        <HStack
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: CustomSpacing(8),
          }}>
          {/* <ScrollView horizontal>
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 1</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 2</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 3</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 4</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 5</Text>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity
              style={{
                padding: CustomSpacing(8),
                borderRadius: 23,
                borderColor: Colors.neutral50,
                borderWidth: CustomSpacing(1),
                alignItems: 'center',
              }}>
              <Text>save 6</Text>
            </TouchableOpacity>
          </ScrollView> */}
        </HStack>
        <Spacer height={CustomSpacing(12)} />
        {/* RoutenFavorite */}
        <VStack style={{paddingHorizontal: CustomSpacing(16)}}>
          <Text style={[Fonts.headlineL]}>Route Favorite</Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack
            style={{
              justifyContent: 'space-between',
              paddingHorizontal: CustomSpacing(8),
            }}>
            <ScrollView horizontal>
              <TouchableOpacity>
                <VStack
                  style={{
                    paddingHorizontal: CustomSpacing(12),
                    paddingVertical: CustomSpacing(8),
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                  }}>
                  <HStack style={{maxWidth: CustomSpacing(256)}}>
                    <FastImage
                      source={LocationAdd}
                      style={componentStyles.imgSearchLocationIcon}
                    />
                    <Spacer width={CustomSpacing(12)} />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={[Fonts.labelSemiBold]}>
                      Jl. Kemang Sari No.85 RT.001/RW.007dsadasddasdasdas
                    </Text>
                  </HStack>
                  <HStack style={{maxWidth: CustomSpacing(256)}}>
                    <Spacer width={CustomSpacing(8)} />
                    <VStack
                      style={{
                        // position: 'absolute',
                        width: 2,
                        height: CustomSpacing(18),
                        backgroundColor: Colors.neutral30,
                        borderStyle: 'dotted',
                        borderWidth: 0,
                      }}
                    />
                  </HStack>
                  <HStack>
                    <FastImage
                      source={LocationIcon}
                      style={componentStyles.imgSearchLocationIcon}
                    />
                    <Spacer width={CustomSpacing(12)} />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={[Fonts.labelSemiBold]}>
                      PT. Hayuq system indonesia
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity>
              <Spacer width={CustomSpacing(12)} />

              {/* <TouchableOpacity>
                <VStack
                  style={{
                    paddingHorizontal: CustomSpacing(12),
                    paddingVertical: CustomSpacing(8),
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                  }}>
                  <HStack style={{maxWidth: CustomSpacing(256)}}>
                    <FastImage
                      source={LocationAdd}
                      style={componentStyles.imgSearchLocationIcon}
                    />
                    <Spacer width={CustomSpacing(12)} />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={[Fonts.labelSemiBold]}>
                      Jl. Kemang Sari No.85 RT.001/RW.007dsadasddasdasdas
                    </Text>
                  </HStack>
                  <HStack style={{maxWidth: CustomSpacing(256)}}>
                    <Spacer width={CustomSpacing(8)} />
                    <VStack
                      style={{
                        // position: 'absolute',
                        width: 2,
                        height: CustomSpacing(18),
                        backgroundColor: Colors.neutral30,
                        borderStyle: 'dotted',
                        borderWidth: 0,
                      }}
                    />
                  </HStack>
                  <HStack>
                    <FastImage
                      source={LocationIcon}
                      style={componentStyles.imgSearchLocationIcon}
                    />
                    <Spacer width={CustomSpacing(12)} />
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={[Fonts.labelSemiBold]}>
                      PT. Hayuq system indonesia
                    </Text>
                  </HStack>
                </VStack>
              </TouchableOpacity> */}
            </ScrollView>
          </HStack>
        </VStack>

        <Spacer height={CustomSpacing(18)} />
        {/*Rating Perjalanan*/}
        <VStack style={{paddingHorizontal: CustomSpacing(16)}}>
          <Text style={[Fonts.headlineL]}>Rating Perjalanan</Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack
            style={{
              justifyContent: 'space-between',
              paddingHorizontal: CustomSpacing(8),
            }}>
            <ScrollView horizontal>
              <TouchableOpacity>
                <VStack
                  style={{
                    paddingHorizontal: CustomSpacing(12),
                    paddingVertical: CustomSpacing(8),
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                  }}>
                  <HStack>
                    <VStack>
                      <FastImage
                        source={james}
                        style={componentStyles.imgDriver}
                      />
                    </VStack>
                    <Spacer width={CustomSpacing(8)} />
                    <VStack>
                      <Text style={[Fonts.subhead]}>James Warden</Text>
                      <Spacer height={CustomSpacing(8)} />
                      <HStack>
                        <FastImage
                          source={StarIcon}
                          tintColor={Colors.primaryMain}
                          style={componentStyles.imgSearchLocationIcon}
                        />

                        <Text>5.0</Text>
                        <Text style={Fonts.label}>{` • B1234QWE`}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                  <HStack>
                    <HStack
                      style={{
                        // position: 'absolute',
                        flex: 1,
                        backgroundColor: Colors.neutral50,
                        borderWidth: 0.2,
                      }}
                    />
                  </HStack>
                  <Spacer height={CustomSpacing(4)} />
                  <HStack>
                    <Text>Beri rating</Text>
                    <Spacer width={CustomSpacing(8)} />
                    <Rating
                      readonly={true}
                      isDisabled={true}
                      defaultRating={0}
                      startingValue={0}
                      ratingColor="#FFD202"
                      ratingBackgroundColor="#EDEDED"
                      ratingCount={5}
                      imageSize={23}
                    />
                  </HStack>
                </VStack>
              </TouchableOpacity>
              <Spacer width={CustomSpacing(12)} />

              {/* <TouchableOpacity>
                <VStack
                  style={{
                    paddingHorizontal: CustomSpacing(12),
                    paddingVertical: CustomSpacing(8),
                    borderRadius: 8,
                    backgroundColor: Colors.neutral10,
                  }}>
                  <HStack>
                    <VStack>
                      <FastImage
                        source={james}
                        style={componentStyles.imgDriver}
                      />
                    </VStack>
                    <Spacer width={CustomSpacing(8)} />
                    <VStack>
                      <Text style={[Fonts.subhead]}>James Warden</Text>
                      <Spacer height={CustomSpacing(8)} />
                      <HStack>
                        <FastImage
                          source={StarIcon}
                          tintColor={Colors.primaryMain}
                          style={componentStyles.imgSearchLocationIcon}
                        />

                        <Text>5.0</Text>
                        <Text style={Fonts.label}>{` • B1234QWE`}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <Spacer height={CustomSpacing(8)} />
                  <HStack>
                    <HStack
                      style={{
                        // position: 'absolute',
                        flex: 1,
                        backgroundColor: Colors.neutral50,
                        borderWidth: 0.2,
                      }}
                    />
                  </HStack>
                  <Spacer height={CustomSpacing(4)} />
                  <HStack>
                    <Text>Beri rating</Text>
                    <Spacer width={CustomSpacing(8)} />
                    <Rating
                      readonly={true}
                      isDisabled={true}
                      defaultRating={0}
                      startingValue={0}
                      ratingColor="#FFD202"
                      ratingBackgroundColor="#EDEDED"
                      ratingCount={5}
                      imageSize={23}
                    />
                  </HStack>
                </VStack>
              </TouchableOpacity>
              <Spacer width={CustomSpacing(12)} /> */}
            </ScrollView>
          </HStack>
        </VStack>

        <Spacer height={CustomSpacing(18)} />
        {/*Tujuan Terakhir*/}
        <VStack style={{paddingHorizontal: CustomSpacing(23)}}>
          <Text style={[Fonts.headlineL]}>Tujuan Terakhir</Text>
          <Spacer height={CustomSpacing(8)} />
          <HStack>
            <FastImage source={Time} style={componentStyles.imgTimeIcon} />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <Text style={[Fonts.labelSemiBold]}>Location A1</Text>
              <Spacer height={CustomSpacing(4)} />
              <HStack style={{maxWidth: '85%'}}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  Jl. Rose Garden 3 No.87, RT.002/RW.017, Jaka Setiadsadsadasdas
                </Text>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <TouchableOpacity>
              <FastImage
                source={AddBookmarkIcon}
                style={componentStyles.imgBookmarkIcon}
              />
            </TouchableOpacity>
          </HStack>

          <Spacer height={CustomSpacing(12)} />
          {/* <HStack>
            <FastImage source={Time} style={componentStyles.imgTimeIcon} />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <Text style={[Fonts.labelSemiBold]}>Location A2</Text>
              <Spacer height={CustomSpacing(4)} />
              <HStack style={{maxWidth: '85%'}}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  Jl. Rose Garden 3 No.87, RT.002/RW.017, Jaka Setiadsadsadasdas
                </Text>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <TouchableOpacity>
              <FastImage
                source={AddBookmarkIcon}
                style={componentStyles.imgBookmarkIcon}
              />
            </TouchableOpacity>
          </HStack>

          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <FastImage source={Time} style={componentStyles.imgTimeIcon} />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <Text style={[Fonts.labelSemiBold]}>Location A3</Text>
              <Spacer height={CustomSpacing(4)} />
              <HStack style={{maxWidth: '85%'}}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  Jl. Rose Garden 3 No.87, RT.002/RW.017, Jaka Setiadsadsadasdas
                </Text>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <TouchableOpacity>
              <FastImage
                source={AddBookmarkIcon}
                style={componentStyles.imgBookmarkIcon}
              />
            </TouchableOpacity>
          </HStack>

          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <FastImage source={Time} style={componentStyles.imgTimeIcon} />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <Text style={[Fonts.labelSemiBold]}>Location A4</Text>
              <Spacer height={CustomSpacing(4)} />
              <HStack style={{maxWidth: '85%'}}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  Jl. Rose Garden 3 No.87, RT.002/RW.017, Jaka Setiadsadsadasdas
                </Text>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <TouchableOpacity>
              <FastImage
                source={AddBookmarkIcon}
                style={componentStyles.imgBookmarkIcon}
              />
            </TouchableOpacity>
          </HStack>

          <Spacer height={CustomSpacing(12)} />
          <HStack>
            <FastImage source={Time} style={componentStyles.imgTimeIcon} />
            <Spacer width={CustomSpacing(8)} />
            <VStack>
              <Text style={[Fonts.labelSemiBold]}>Location A5</Text>
              <Spacer height={CustomSpacing(4)} />
              <HStack style={{maxWidth: '85%'}}>
                <Text ellipsizeMode="tail" numberOfLines={1}>
                  Jl. Rose Garden 3 No.87, RT.002/RW.017, Jaka Setiadsadsadasdas
                </Text>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <TouchableOpacity>
              <FastImage
                source={AddBookmarkIcon}
                style={componentStyles.imgBookmarkIcon}
              />
            </TouchableOpacity>
          </HStack> */}
        </VStack>

        <Spacer height={CustomSpacing(18)} />
      </ScrollView>
      <Spacer height={CustomSpacing(12)} />
    </VStack>
  );
});

export default Pickyuq;
