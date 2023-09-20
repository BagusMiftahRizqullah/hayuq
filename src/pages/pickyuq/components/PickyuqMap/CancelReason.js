import React, {useRef, useMemo, useState, useEffect} from 'react';
import {
  Text,
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
import {dimensions} from '@config/Platform.config';
import {WhiteBackIcon, Rectangle, RectangleActive} from '@assets';
import {useTranslation} from 'react-i18next';
import * as _ from 'lodash';
import styles from './MapsPickyuq.style';
import * as Animatable from 'react-native-animatable';

const CancelReason = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore, pickyuqStore} = useStores();
  const [selected, setSelected] = useState(null);
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

  const CancelButton = async () => {
    pickyuqStore.cancelPickyuq(route.params.DataOrder?.transactions_id);
  };

  useEffect(() => {
    if (pickyuqStore.CancelPickyuq) {
      navigation.navigate('EnterLocationDestination');
    }
  }, [pickyuqStore.CancelPickyuq]);

  const ALASAN_PEMBATALAN = [
    'Menunggu terlalu lama',
    'Mengganti lokasi penjemputan',
    'Mengganti lokasi pengantaran',
    'Driver sepertinya tidak berubah',
    'Driver tidak bisa dihubungi',
    'Driver mengatakan kendaraan rusak',
  ];

  console.log('pickupLocation', pickyuqStore.pickupLocation);
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
            <Spacer width={CustomSpacing(43)} />
            <Text style={[Fonts.headlineL]}>Alasan Pembatalan</Text>
          </HStack>
        </VStack>
        <VStack style={{flex: 1, backgroundColor: Colors.neutral10}}>
          <VStack style={{flex: 1, marginHorizontal: 12, paddingTop: 23}}>
            <Text style={[Fonts.titleMBold]}>
              PIlih alasan kenapa anda membatalkan orderan ini?
            </Text>
            <Spacer height={CustomSpacing(32)} />
            {ALASAN_PEMBATALAN?.map((v, i) => {
              return (
                <VStack>
                  <TouchableOpacity onPress={() => setSelected(v)}>
                    <HStack
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      <FastImage
                        source={selected === v ? RectangleActive : Rectangle}
                        style={componentStyles.imgIconLike}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text
                        style={[
                          selected === v ? Fonts.bodySemiBold : Fonts.body,
                        ]}>
                        {v}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                  <Spacer height={CustomSpacing(18)} />
                </VStack>
              );
            })}
          </VStack>
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
          <VStack style={{marginVertical: 32, marginHorizontal: 12}}>
            <Button
              disabled={selected == null ? true : false}
              onPress={CancelButton}
              type="primary"
              label={`Kirim Alasan`}
            />
          </VStack>
        </VStack>
        {/* Loadings */}
        {pickyuqStore.CancelPickyuqLoading && (
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
        )}
      </VStack>
    </VStack>
  );
});

export default CancelReason;
