import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  View,
  Platform,
  ScrollView,
  Share,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import {useTranslation} from 'react-i18next';

import {
  WhiteBackIcon,
  ShareIcon,
  EditIcon,
  DeleteIcon,
  BGFavourite,
  SuperIcon,
  StarIcon,
  HeartFillIcon,
  TagIcon,
} from '@assets';
import Numbro from '@utils/numbro';

import DeleteFavoriteModal from './DeleteFavouriteModal';
import EditFavouriteModal from './EditFavouriteModal';

import styles from './DetailFavourite.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
const DetailFavourite = observer(() => {
  const {exploreStore} = useStores();
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const componentStyles = styles();

  const [showDeleteFavoriteModal, setShowDeleteFavoriteModal] = useState(false);
  const [showEditFavoriteModal, setShowEditFavoriteModal] = useState(false);
  const [collectionDetail, setCollectionDetail] = useState(null);

  useEffect(() => {
    if (
      exploreStore.currentFavoriteDetailData !== null &&
      exploreStore.currentFavoriteDetailData.collectionsdetails
    ) {
      const mergedData =
        exploreStore.currentFavoriteDetailData.collectionsdetails.reduce(
          (acc, detail) => {
            detail.merchants.forEach((merchant) => {
              const id = merchant.id;
              const products = merchant.products;
              if (!acc[id]) {
                acc[id] = products;
              } else {
                products.forEach((product) => {
                  if (!acc[id].some((p) => p.id === product.id)) {
                    acc[id].push(product);
                  }
                });
              }
            });
            return acc;
          },
          {},
        );

      const result = Object.entries(mergedData).map(([id, products]) => {
        const merchant =
          exploreStore.currentFavoriteDetailData.collectionsdetails.find(
            (detail) => detail.merchants.some((m) => m.id === id),
          ).merchants[0];
        return {
          ...merchant,
          products,
        };
      });
      setCollectionDetail(result);
    }
  }, [exploreStore.currentFavoriteDetailData]);

  const handleOpenEditFavoriteModal = () => {
    setShowEditFavoriteModal(!showEditFavoriteModal);
  };

  const handleOpenDeleteFavoriteModal = () => {
    setShowDeleteFavoriteModal(!showDeleteFavoriteModal);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (exploreStore.deleteFavoriteResponse) {
      goBack();
      exploreStore.clearDeleteFavorite();
    }
  }, [exploreStore.deleteFavoriteResponse]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Here is my favourite food, you can check it out on Hayuq App',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of ' + result.activityType);
        } else {
          console.log('shared', result);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed', result);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const NavigationBar = () => {
    return (
      <HStack style={componentStyles.navigationBarContainer}>
        <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
          <FastImage
            source={WhiteBackIcon}
            style={componentStyles.iconNavigation}
          />
        </TouchableOpacity>
        <HStack>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenEditFavoriteModal}>
            <FastImage
              source={EditIcon}
              style={componentStyles.iconNavigation}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(8)} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenDeleteFavoriteModal}>
            <FastImage
              source={DeleteIcon}
              style={componentStyles.iconNavigation}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(8)} />
          <TouchableOpacity activeOpacity={0.8} onPress={onShare}>
            <FastImage
              source={ShareIcon}
              style={componentStyles.iconNavigation}
            />
          </TouchableOpacity>
        </HStack>
      </HStack>
    );
  };

  if (exploreStore.currentFavoriteDetailData === null) return null;

  return (
    <VStack>
      {/* ------ Navigation Bar ------ */}
      <FastImage source={BGFavourite} style={componentStyles.imgBgFavorite}>
        <NavigationBar />
      </FastImage>
      {/* ------ Content ------ */}
      <VStack
        style={{
          backgroundColor: Colors.mainBackground,
          height: '100%',
        }}>
        <VStack style={componentStyles.contentTitle}>
          <Text style={[Fonts.headlineL]}>
            {exploreStore.currentFavoriteDetailData?.name}
          </Text>
        </VStack>
        {/* ------ List Restaurant ------ */}
        <ScrollView
          style={{
            marginBottom: CustomSpacing(260),
          }}>
          {collectionDetail?.map((item, index) => {
            return (
              <VStack key={`favorite-food-${index}`}>
                <VStack style={componentStyles.containerListRestaurant}>
                  <VStack style={componentStyles.containerDetailRestaurant}>
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <HStack>
                        <Text style={[Fonts.headlineL]}>{item.name}</Text>
                        <Spacer width={CustomSpacing(4)} />
                      </HStack>
                    </HStack>
                    <Spacer height={CustomSpacing(8)} />
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <Text style={[Fonts.captionM]}>
                        {item.partnerstypes_name}
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack style={componentStyles.containerListFood}>
                    {item.products.map((food, indexFood) => {
                      return (
                        <HStack key={`food-favorite-${indexFood}`}>
                          <VStack
                            style={componentStyles.containerImgFoodThumbnail}>
                            <FastImage
                              source={{
                                uri: food.productspictures.path,
                              }}
                              style={componentStyles.imgFoodThumbnail}
                            />
                          </VStack>
                          <Spacer width={CustomSpacing(8)} />
                          <VStack>
                            <Text
                              numberOfLines={1}
                              style={[
                                Fonts.headlineL,
                                componentStyles.containerDescriptionFood,
                              ]}>
                              {food.name}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={[
                                Fonts.captionM,
                                componentStyles.containerDescriptionFood,
                              ]}>
                              {food.productsdetails.description}
                            </Text>
                            <Spacer height={CustomSpacing(4)} />
                            <HStack
                              style={{
                                justifyContent: 'space-between',
                                width: dimensions.screenWidth * 0.6,
                              }}>
                              <HStack>
                                <Text style={[Fonts.captionMSemiBold]}>
                                  {Numbro.formatCurrency(
                                    food.productsprices.price,
                                  )}
                                </Text>
                                <Spacer width={CustomSpacing(4)} />
                                {/* <HStack
                                  style={componentStyles.discountTextContainer}>
                                  <Text
                                    style={[
                                      Fonts.captionS,
                                      componentStyles.discountText,
                                    ]}>
                                    {food.productsprices.price}
                                  </Text>
                                  <Spacer width={CustomSpacing(4)} />
                                  <FastImage
                                    source={TagIcon}
                                    style={componentStyles.imgTagIcon}
                                  />
                                </HStack> */}
                              </HStack>
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  exploreStore.deleteDetailFavorite(
                                    food.merchantscategorys_id,
                                  );
                                }}
                                style={componentStyles.loveContainer}>
                                <FastImage
                                  source={HeartFillIcon}
                                  style={componentStyles.imgLoveIcon}
                                />
                              </TouchableOpacity>
                            </HStack>
                          </VStack>
                        </HStack>
                      );
                    })}
                  </VStack>
                </VStack>
                <VStack style={componentStyles.containerDivider} />
              </VStack>
            );
          })}
        </ScrollView>
      </VStack>
      <DeleteFavoriteModal
        showing={showDeleteFavoriteModal}
        close={handleOpenDeleteFavoriteModal}
        favId={exploreStore.currentFavoriteDetailData.id}
      />
      <EditFavouriteModal
        showing={showEditFavoriteModal}
        close={handleOpenEditFavoriteModal}
      />
    </VStack>
  );
});

export default DetailFavourite;
