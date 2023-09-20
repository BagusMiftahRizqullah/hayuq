import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
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
import * as Animatable from 'react-native-animatable';
import {WhiteBackIcon, james, StarIcon, RectangleActive} from '@assets';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './MapsPickyuq.style';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {dimensions} from '@config/Platform.config';
import moment from 'moment';

const ReviewDriver = observer(({route}) => {
  console.log('routeREVIEW DRIVER', route.params);
  const {t, i18n} = useTranslation();
  const {exploreStore, pickyuqStore} = useStores();
  const [selected, setSelected] = useState(null);
  const [star, setStar] = useState(0);
  const [Rates, setRate] = useState([]);
  const [DriverTip, setDriverTip] = useState(null);
  const [AmountTip, setAmountTip] = useState(null);

  const componentStyles = styles();
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const DATA_RATE = [
    'Komunikatif',
    'Driver Sopan',
    'Tepat Lokasi',
    'Kondisi Motor Prima',
    'Driver tidak bisa dihubungi',
    'Safety Lengkap',
  ];

  const DATA_TIP = [
    {
      label: 'Rp. 1.000',
      value: 1000,
    },
    {
      label: 'Rp. 2.000',
      value: 2000,
    },
    {
      label: 'Rp. 5.000',
      value: 5000,
    },
    {
      label: 'Rp. 10.000',
      value: 10000,
    },
    {
      label: 'Rp. 15.000',
      value: 15000,
    },
    {
      label: 'Jumlah lain',
      value: parseInt(AmountTip),
    },
  ];

  useEffect(() => {
    if (pickyuqStore.DriverRating || pickyuqStore.DriverTip) {
      pickyuqStore.clearPickyuqStore();
      navigation.navigate('Pickyuq');
    }
  }, [pickyuqStore.DriverRating, pickyuqStore.DriverTip]);

  const RateDriver = async () => {
    const TIP_DRIVER = await DATA_TIP.find((a) => a.value == DriverTip.value);
    console.log('TIP_DRIVER', TIP_DRIVER);
    const Ratings = {
      drivers_id: route.params?.dataFinish?.drivers?.driverdetails?.drivers_id,
      transactions_id: route.params?.dataFinish?.transactions_id,
      Rating: {
        rating: star,
        notes: Rates,
      },
    };
    const Tips = {
      drivers_id: route.params?.dataFinish?.drivers?.driverdetails?.drivers_id,
      transactions_id: route.params?.dataFinish?.transactions_id,
      Tip: TIP_DRIVER ? TIP_DRIVER : 0,
    };

    await pickyuqStore.saveDataRating(Ratings, Tips);

    await pickyuqStore.postDriverRatings();
    await pickyuqStore.postDriverTip();
    // free amount
  };

  const handleInputTextChange = (newText) => {
    setAmountTip(newText);
  };

  // console.log('pickupLocation123', route.params?.dataFinish);
  return (
    <VStack
      style={{
        flex: 1,
      }}>
      {/* ------ Navigator & Search Bar ------ */}
      <VStack style={{flex: 1, backgroundColor: Colors.neutral10}}>
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
            {/* <Spacer width={CustomSpacing(43)} /> */}
            <Spacer width={CustomSpacing(68)} />
            <Text style={[Fonts.headlineL]}>{`Order Review`}</Text>
          </HStack>
        </VStack>
        <ScrollView style={{flex: 1, backgroundColor: Colors.neutral10}}>
          <VStack style={{flex: 1}}>
            <VStack style={{alignItems: 'center'}}>
              <Spacer height={CustomSpacing(12)} />
              <FastImage
                source={{
                  uri: `${route.params?.dataFinish?.drivers?.driverdetails?.path}`,
                }}
                style={componentStyles.imgDriver}
              />
              <Spacer height={CustomSpacing(8)} />
              <Text style={[Fonts.subhead]}>
                {route.params?.dataFinish?.drivers?.driverdetails?.name
                  ? route.params?.dataFinish?.drivers?.driverdetails?.name
                  : ''}
              </Text>
              <Spacer height={CustomSpacing(8)} />
              <HStack>
                <FastImage
                  source={StarIcon}
                  tintColor={Colors.primaryMain}
                  style={componentStyles.imgSearchLocationIcon}
                />
                <Text>
                  {route.params?.dataFinish?.driverRatings?.drivers?.ratings
                    ? route.params?.dataFinish?.drivers?.driverRatings?.ratings
                    : '0.0'}
                </Text>
                <Text style={Fonts.label}>{` • ${
                  route.params?.dataFinish?.drivers?.drivervehicles
                    ?.plate_number
                    ? route.params?.dataFinish?.drivers?.drivervehicles
                        ?.plate_number
                    : ''
                }`}</Text>
              </HStack>
              <Spacer height={CustomSpacing(8)} />
              {/* <Text>Monday, 21 Nov, 09:45</Text> */}
              <Text>
                {route.params?.dataFinish?.drivers?.updated_at
                  ? moment(
                      route.params?.dataFinish?.drivers?.updated_at,
                    ).format('DD MMM YYYY, HH:MM')
                  : ''}
              </Text>
              <Spacer height={CustomSpacing(8)} />
              <HStack style={{marginHorizontal: 18}}>
                <HStack
                  style={{
                    // position: 'absolute',
                    flex: 1,
                    backgroundColor: Colors.neutral10,
                    borderWidth: 0.2,
                  }}
                />
              </HStack>
              <HStack>
                <Text style={[Fonts.labelSemiBold]}>{t('wlAddRate')}</Text>
                <Spacer width={CustomSpacing(8)} />
                <Rating
                  defaultRating={star}
                  startingValue={star}
                  ratingColor="#FFD202"
                  ratingBackgroundColor="#EDEDED"
                  ratingCount={5}
                  imageSize={35}
                  onFinishRating={async (a) => {
                    setStar(a);
                  }}
                  style={{paddingVertical: 10}}
                />
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(8)} />
            <VStack>
              <HStack
                style={{
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                {DATA_RATE?.map((item, index) => {
                  return (
                    <HStack style={{marginVertical: 4}}>
                      <Spacer width={CustomSpacing(4)} />
                      <TouchableOpacity
                        onPress={() => {
                          if (Rates.find((a) => a == item)) {
                            const findIndx = Rates.indexOf(item);
                            const newArr = Rates.splice(findIndx, 1);
                            const newArr2 = Rates.filter((a) => a !== newArr);
                            setRate(newArr2);
                          } else {
                            setRate([...Rates, item]);
                          }
                        }}
                        style={{
                          backgroundColor: Rates.find((a) => a == item)
                            ? Colors.primaryMain
                            : Colors.neutral30,
                          paddingVertical: CustomSpacing(8),
                          paddingHorizontal: CustomSpacing(18),
                          // backgroundColor: Colors.neutral30,
                          borderRadius: 23,
                          borderColor: Rates.find((a) => a == item)
                            ? Colors.primarySurface
                            : Colors.neutral50,
                          borderWidth: 2,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[Fonts.captionMSemiBold]}>{`${item}`}</Text>
                      </TouchableOpacity>
                    </HStack>
                  );
                })}
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(23)} />
            <Text style={[Fonts.labelSemiBold, {marginHorizontal: 8}]}>
              {t('wlTipDriver')}
            </Text>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              <HStack
                style={{
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  paddingHorizontal: 8,
                }}>
                {DATA_TIP?.map((item, index) => {
                  return (
                    <HStack style={{marginVertical: 4}}>
                      <Spacer width={CustomSpacing(4)} />
                      <TouchableOpacity
                        onPress={() => {
                          setDriverTip(item);
                        }}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: CustomSpacing(22),
                          backgroundColor:
                            item.value === DriverTip?.value
                              ? Colors.primaryMain
                              : Colors.neutral30,
                          borderRadius: 23,
                          borderColor:
                            item.value === DriverTip?.value
                              ? Colors.primarySurface
                              : Colors.neutral50,
                          borderWidth: 2,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            Fonts.captionMSemiBold,
                          ]}>{`${item.label}`}</Text>
                      </TouchableOpacity>
                    </HStack>
                  );
                })}
              </HStack>
              {DriverTip?.label === 'Jumlah lain' ? (
                <VStack style={{flex: 1}}>
                  <HStack
                    style={{
                      paddingHorizontal: CustomSpacing(16),
                      alignItems: 'center',
                    }}>
                    <Text style={[Fonts.labelSemiBold]}>Rp.</Text>
                    <Spacer width={CustomSpacing(8)} />
                    <TextInput
                      placeholder="Masukan Driver Tip"
                      style={[Fonts.labelSemiBold]}
                      keyboardType={'numeric'}
                      onChangeText={(a) => handleInputTextChange(a)}
                      defaultValue={AmountTip}
                    />
                  </HStack>
                  <HStack
                    style={{
                      // position: 'absolute',
                      flex: 1,
                      marginHorizontal: CustomSpacing(18),
                      backgroundColor: Colors.neutral10,
                      borderWidth: 0.2,
                    }}
                  />
                </VStack>
              ) : null}

              <Spacer height={CustomSpacing(12)} />
            </VStack>
          </VStack>
        </ScrollView>
        {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        <VStack style={{marginVertical: 32, marginHorizontal: 12}}>
          <Button
            // disabled={timeSearchDriver <= 0 ? true : false}
            onPress={RateDriver}
            type="primary"
            label={`Kirim Alasan`}
          />
        </VStack>
      </VStack>
      {/* Loadings */}
      {pickyuqStore.DriverRatingLoading || pickyuqStore.DriverTipLoading ? (
        <VStack
          style={{
            backgroundColor: '#000',
            position: 'absolute',
            width: dimensions.screenWidth,
            height: dimensions.screenHeight,
            opacity: 0.8,
            zIndex: 10,
          }}>
          <Spacer height={dimensions.screenWidth * 0.28} />
          <Animatable.View animation="bounceIn" delay={200}>
            <VStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 20,
                width: dimensions.screenWidth,
                bottom: CustomSpacing(-256),
              }}>
              <ActivityIndicator size="large" color={Colors.primaryMain} />
              <Spacer height={CustomSpacing(16)} />
              <Text style={[Fonts.label, {color: '#FFF'}]}>
                {t('wlPleaseWait')}
              </Text>
            </VStack>
          </Animatable.View>
        </VStack>
      ) : null}
    </VStack>
  );
});

export default ReviewDriver;
