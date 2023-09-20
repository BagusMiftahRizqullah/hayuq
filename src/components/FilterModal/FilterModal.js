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

import {CloseOutlineIcon, GreyLocation, StarIcon} from '@assets';

import * as Animatable from 'react-native-animatable';

import styles from './FilterModal.style';

const FilterModal = ({
  showing,
  close,
  currentFilter,
  handleCurrentFilter,
  onFilter,
}) => {
  const componentStyles = styles();
  const [shouldRender, setShouldRender] = useState(false);
  const [sortActive, setSortActive] = useState(null);
  const [ratingActive, setRatingActive] = useState(null);
  const [otherActive, setOtherActive] = useState(null);

  const handleClearFilter = () => {
    setOtherActive(null);
    setRatingActive(null);
    setSortActive(null);
  };

  const handleSetOtherActive = (id) => {
    setOtherActive(id);
  };

  const handleSetRatingActive = (id) => {
    setRatingActive(id);
  };

  const handleSetSortActive = (id) => {
    setSortActive(id);
  };

  const handleClose = () => {
    handleCurrentFilter({
      sort: sortActive,
      rating: ratingActive,
      other: otherActive,
    });
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
      handleSetSortActive(currentFilter.sort);
      handleSetRatingActive(currentFilter.rating);
      handleSetOtherActive(currentFilter.other);
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
          <HStack
            style={{
              justifyContent: 'space-between',
            }}>
            <Text style={[Fonts.headlineL]}>Filter</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={close}>
              <FastImage
                source={CloseOutlineIcon}
                style={componentStyles.imgBackIcon}
              />
            </TouchableOpacity>
          </HStack>
          <Spacer height={CustomSpacing(8)} />
          <VStack>
            <VStack>
              <Text style={[Fonts.captionM]}>Sort by</Text>
              <Spacer height={CustomSpacing(8)} />
              <HStack>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetSortActive(0)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleLeftStyle,
                      {
                        backgroundColor:
                          sortActive === 0
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={GreyLocation}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>Nearest</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetSortActive(1)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleRightStyle,
                      {
                        backgroundColor:
                          sortActive === 1
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>Highest rating</Text>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              <Text style={[Fonts.captionM]}>Restaurant ratings</Text>
              <Spacer height={CustomSpacing(8)} />
              <HStack>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetRatingActive(0)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleLeftStyle,
                      {
                        backgroundColor:
                          ratingActive === 0
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>Rated 4.0+</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetRatingActive(1)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleRightStyle,
                      {
                        backgroundColor:
                          ratingActive === 1
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>Rated 4.5+</Text>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(12)} />
            <VStack>
              <Text style={[Fonts.captionM]}>Other</Text>
              <Spacer height={CustomSpacing(8)} />
              <HStack>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetOtherActive(0)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleStyle,
                      {
                        backgroundColor:
                          otherActive === 0
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>Open now</Text>
                  </HStack>
                </TouchableOpacity>
                <Spacer width={CustomSpacing(8)} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSetOtherActive(1)}>
                  <HStack
                    style={[
                      componentStyles.filterCapsuleStyle,
                      {
                        backgroundColor:
                          otherActive === 1
                            ? Colors.primaryMain
                            : Colors.backgroundMain,
                      },
                    ]}>
                    <FastImage
                      source={StarIcon}
                      style={componentStyles.imgCapsuleIcon}
                    />
                    <Spacer width={CustomSpacing(4)} />
                    <Text style={[Fonts.captionMSemiBold]}>
                      Promo Available
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(44)} />
          <Button onPress={handleClose} type="primary" label="Apply" />
          <Spacer height={CustomSpacing(8)} />
          <Button
            onPress={handleClearFilter}
            type="dangerOutline"
            label="Clear Filter"
          />
          {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
        </VStack>
      </Animatable.View>
    </Animatable.View>
  );
};

export default FilterModal;
