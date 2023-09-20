import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {useTranslation} from 'react-i18next';

import * as Animatable from 'react-native-animatable';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {Rectangle, RectangleActive} from '@assets';

import styles from './FoodDetails.style';

const ListExistingFavoriteModal = observer(({showing, close, products_id}) => {
  const {t, i18n} = useTranslation();
  const {exploreStore, authStore} = useStores();
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const handleSubmitFavorite = () => {
    exploreStore.postCreateDetailFavorite({
      id: selectedFavorite,
      products_id: products_id,
    });
  };

  useEffect(() => {
    if (
      exploreStore.createFavoriteDetailResponse &&
      !exploreStore.createFavoriteDetailLoading
    ) {
      exploreStore.getProductDetail(products_id);
      exploreStore.clearCreateDetailFavorite();
      close();
    }
  }, [exploreStore.createFavoriteDetailResponse]);

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
      <TouchableOpacity onPress={close} style={{flex: 1}} />

      <Animatable.View
        duration={500}
        easing="ease-out"
        animation={showing ? 'bounceInUp' : 'bounceOutDown'}
        useNativeDriver
        style={componentStyles.bottomSheetContainer}>
        <VStack>
          <Text style={[Fonts.headlineL]}>Choose Favorite List</Text>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack style={componentStyles.inputContainer}>
              {exploreStore.getListFavoriteData !== null &&
                exploreStore.getListFavoriteData.map((item, index) => {
                  return (
                    <VStack key={`favorite-${index}`}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedFavorite(item.id)}>
                        <HStack>
                          <FastImage
                            source={
                              selectedFavorite === item.id
                                ? RectangleActive
                                : Rectangle
                            }
                            style={componentStyles.imgTagIcon}
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <Text style={[Fonts.subhead]}>{item.name}</Text>
                        </HStack>
                      </TouchableOpacity>
                      <Spacer height={CustomSpacing(8)} />
                    </VStack>
                  );
                })}
              <HStack>
                <Text></Text>
              </HStack>
            </VStack>
          </VStack>

          <Spacer height={CustomSpacing(20)} />
          <Button
            isSubmitting={exploreStore.createFavoriteDetailLoading}
            disabled={
              exploreStore.createFavoriteDetailLoading ||
              selectedFavorite === null
            }
            onPress={handleSubmitFavorite}
            type="primary"
            label={`Add to Favorite`}
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
});

export default ListExistingFavoriteModal;
