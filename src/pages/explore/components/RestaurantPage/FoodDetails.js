import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Platform,
  FlatList,
  SectionList,
  LogBox,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated from 'react-native-reanimated';

import Numbro from '@utils/numbro';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';
import {
  TagIcon,
  HeartFillIcon,
  ShareIcon,
  Rectangle,
  RectangleActive,
  Checkbox,
  CheckboxActive,
} from '@assets';
import styles from './FoodDetails.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {values} from 'mobx';
import ListExistingFavoriteModal from './ListExistingFavoriteModal';
import {useTranslation} from 'react-i18next';

// import Share from 'react-native-share';

LogBox.ignoreLogs(['VirtualizedLists']);

const FoodDetails = observer((route) => {
  const {t, i18n} = useTranslation();
  const componentStyles = styles();
  const navigation = useNavigation();
  const {exploreStore} = useStores();
  const [productNotes, setProductNotes] = useState('');
  const [productData, setProductData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedData, setSelectedData] = useState({
    singleSelect: [],
    multipleSelect: [],
  });
  const [submitForm, setSubmitForm] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState(null);
  const [requiredVariant, setRequiredVariant] = useState(null);
  const [filledRequiredVariant, setFilledRequiredVariant] = useState(null);
  const [warningSubmit, setWarningSubmit] = useState(null);

  const [submited, setSubmited] = useState(false);

  const [showListExistingFavoriteModal, setShowListExistingFavoriteModal] =
    useState(false);

  const handleOpenListExistingFavoriteModal = (id) => {
    setFavoriteItem(id);
    setShowListExistingFavoriteModal(!showListExistingFavoriteModal);
  };

  const checkRequiredVariant = () => {
    if (filledRequiredVariant !== null && requiredVariant.length > 0) {
      const filtered = requiredVariant.filter(
        (item) => !filledRequiredVariant.includes(item),
      );
      if (filtered.length > 0) {
        setWarningSubmit(filtered);
      } else {
        setWarningSubmit(null);
        setSubmited(true);
      }
    } else {
      setWarningSubmit(requiredVariant);
    }
    if (requiredVariant && requiredVariant.length === 0) {
      setWarningSubmit(null);
      setSubmited(true);
    }
  };

  const findData = (source, reference) => {
    const singleSelectIds = reference.singleSelect.map((item) => item.id);
    const multipleSelectIds = reference.multipleSelect.map((item) => item.id);
    let dataArr = [];
    source.forEach((data) => {
      if (data.type === 1) {
        const variantsIds = data.variantsdetails.map((variant) => variant.id);
        const foundVariantId = variantsIds.find(
          (variantId) =>
            singleSelectIds.includes(variantId) ||
            multipleSelectIds.includes(variantId),
        );
        if (foundVariantId) {
          dataArr.push(data.id);
        }
      }
    });
    setFilledRequiredVariant(dataArr);
  };

  useEffect(() => {
    if (productData) {
      let newData = [];
      if (
        productData.productsvariants &&
        productData.productsvariants.length > 0
      ) {
        productData.productsvariants.forEach((data) => {
          if (data.type === 1) {
            newData.push(data.id);
          }
        });
        setRequiredVariant(newData);
      } else {
        setRequiredVariant(newData);
      }
    }
  }, [productData]);

  useEffect(() => {
    if (
      selectedData.singleSelect.length > 0 ||
      selectedData.multipleSelect.length > 0
    ) {
      findData(productData.productsvariants, selectedData);
    }
  }, [selectedData]);

  useEffect(() => {
    if (warningSubmit === null && submited) {
      if (route?.route?.params?.edit) {
        exploreStore.updateCartList(submitForm, 'edit');

        goBack();
        setSubmited(false);
      } else {
        exploreStore.createCartList(submitForm);
      }
    }
  }, [warningSubmit, submited]);

  const isOnCart = useMemo(() => {
    if (
      exploreStore.cartListData &&
      exploreStore.cartListData?.cart.length > 0 &&
      productData
    ) {
      const index = exploreStore.cartListData.cart.findIndex(
        (item) =>
          item.merchants_id === productData.merchants_id &&
          item.products_id === productData.products_id,
      );
      if (index > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, [productData, exploreStore.cartListData]);

  const handleSingleSelected = (item) => {
    if (selectedData.singleSelect.length > 0) {
      const index = selectedData.singleSelect.findIndex(
        (data) => data.merchantsvariants_id === item.merchantsvariants_id,
      );
      if (index > -1) {
        const newData = selectedData.singleSelect.filter(
          (data) => data.merchantsvariants_id !== item.merchantsvariants_id,
        );
        setSelectedData({
          ...selectedData,
          singleSelect: newData,
        });
      } else {
        setSelectedData({
          ...selectedData,
          singleSelect: [...selectedData.singleSelect, item],
        });
      }
    } else {
      setSelectedData({
        ...selectedData,
        singleSelect: [item],
      });
    }
    setWarningSubmit(null);
  };

  const handleMultipleSelected = (item) => {
    if (selectedData.multipleSelect.length > 0) {
      const index = selectedData.multipleSelect.findIndex(
        (data) => data.id === item.id,
      );
      if (index > -1) {
        const newData = selectedData.multipleSelect.filter(
          (data) => data.id !== item.id,
        );
        setSelectedData({
          ...selectedData,
          multipleSelect: newData,
        });
      } else {
        setSelectedData({
          ...selectedData,
          multipleSelect: [...selectedData.multipleSelect, item],
        });
      }
    } else {
      setSelectedData({
        ...selectedData,
        multipleSelect: [item],
      });
    }
    setWarningSubmit(null);
  };

  const handleSubmitForm = () => {
    checkRequiredVariant();
  };

  useEffect(() => {
    if (exploreStore.productDetailData) {
      setProductData(exploreStore.productDetailData);
    }
  }, [exploreStore.productDetailData]);

  useEffect(() => {
    if (
      exploreStore.createCartResponse &&
      !exploreStore.cartListLoading &&
      warningSubmit === null &&
      submited
    ) {
      goBack();
      setSubmited(false);
    }
  }, [exploreStore.cartListLoading]);

  useEffect(() => {
    if (selectedData && productData) {
      const totalSingle = selectedData.singleSelect.reduce((acc, item) => {
        return acc + item.price;
      }, 0);
      const totalMultiple = selectedData.multipleSelect.reduce((acc, item) => {
        return acc + item.price;
      }, 0);
      setTotalPrice(
        productData.productsprices.total
          ? productData.productsprices.total
          : productData.productsprices.price + totalSingle + totalMultiple,
      );
    }
  }, [productData, selectedData]);

  useEffect(() => {
    if (selectedData && productData) {
      const data = {
        merchants_id: productData.merchants_id,
        products_id: productData.products_id,
        quantity: 1,
        notes: productNotes,
        variants: [
          ...selectedData.singleSelect,
          ...selectedData.multipleSelect,
        ],
      };
      setSubmitForm(data);
    }
  }, [selectedData, productData, productNotes]);

  const goBack = useCallback(() => {
    exploreStore.clearMerchantDetailData();
    navigation.goBack();
  }, []);

  // const goShare = () => {
  //   console.log('goshare');
  // };

  const goShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Here is my favourite restaurant, you can check it out on Hayuq App',
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
      Alert.alert(error.message);
    }
  };

  if (productData === null) return null;

  const Navigator = () => {
    return (
      <HStack style={componentStyles.actionPosition}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={componentStyles.actionContainer}
          onPress={goBack}>
          <Icon name="close" size={28} color={Colors.neutral80} />
        </TouchableOpacity>
      </HStack>
    );
  };

  const HeaderContainer = () => {
    return (
      <VStack style={componentStyles.headerContainerRestaurant}>
        <VStack>
          <Spacer height={CustomSpacing(18)} />

          <HStack
            paddingHorizontal={CustomSpacing(16)}
            justifyContent="space-between">
            <Text
              numberOfLines={1}
              style={[
                Fonts.titleSBold,
                {
                  maxWidth: dimensions.screenWidth * 0.68,
                },
              ]}>
              {productData.name}
            </Text>
            <HStack style={componentStyles.totalLikesContainer}>
              <Text style={[Fonts.labelSemiBold, {color: Colors.neutral10}]}>
                {productData.rating.likes}
              </Text>
              <Spacer width={CustomSpacing(4)} />
              <Icon name="thumb-up" size={16} color={Colors.neutral10} />
            </HStack>
          </HStack>

          <VStack paddingHorizontal={CustomSpacing(16)}>
            <Text numberOfLines={3} style={[Fonts.label]}>
              {productData.productsdetails.description}
            </Text>
          </VStack>
          <Spacer height={CustomSpacing(4)} />
          <HStack paddingHorizontal={CustomSpacing(16)}>
            <Text style={[Fonts.headlineL, {color: Colors.neutral90}]}>
              Rp{' '}
              {Numbro.formatCurrency(
                productData.productsprices.total
                  ? productData.productsprices.total
                  : productData.productsprices.price,
              )}
            </Text>
            <Spacer width={CustomSpacing(4)} />
            {productData.productsprices.discount_type !== 0 && (
              <Text style={componentStyles.textDeduction}>
                {Numbro.formatCurrency(productData.productsprices.price)}
              </Text>
            )}
          </HStack>
          <Spacer height={CustomSpacing(2)} />
          {productData.productsprices.discount_type === 1 && (
            <HStack paddingHorizontal={CustomSpacing(16)}>
              <HStack style={componentStyles.containerTagDiscount}>
                <FastImage
                  source={TagIcon}
                  style={componentStyles.imgTagIcon}
                />
                <Text style={[Fonts.captionM, {color: Colors.supportMain}]}>
                  {productData.productsprices.discount_price}%
                </Text>
                <Text style={[Fonts.captionM, {color: Colors.supportMain}]}>
                  off
                </Text>
              </HStack>
            </HStack>
          )}
          <Spacer height={CustomSpacing(12)} />
          <HStack paddingHorizontal={CustomSpacing(16)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                handleOpenListExistingFavoriteModal(productData.id);
              }}>
              <HStack
                style={[
                  componentStyles.containerFavorites,
                  {
                    borderColor: Colors.neutral70,
                    borderWidth: CustomSpacing(1),
                  },
                ]}>
                <Icon
                  name="favorite-outline"
                  size={16}
                  color={Colors.neutral80}
                />
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.captionM]}>{t('wlAddtoFavorite')}</Text>
              </HStack>
            </TouchableOpacity>
            <Spacer width={CustomSpacing(12)} />
            <TouchableOpacity onPress={() => goShare()}>
              <HStack style={componentStyles.containerShare}>
                <Icon name="share" size={16} color={Colors.neutral80} />
                <Spacer width={CustomSpacing(4)} />
                <Text style={[Fonts.captionM]}>{t('wlShare')}</Text>
              </HStack>
            </TouchableOpacity>
          </HStack>
          <Spacer height={CustomSpacing(18)} />
        </VStack>
      </VStack>
    );
  };

  const renderSingleSelect = ({item, index}) => {
    const selected = selectedData.singleSelect.findIndex(
      (selectedItem) => selectedItem.id === item.id,
    );
    return (
      <VStack>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleSingleSelected(item);
          }}
          key={index}
          style={componentStyles.itemContainer}>
          <HStack style={{justifyContent: 'space-between'}}>
            <HStack>
              <FastImage
                source={selected !== -1 ? RectangleActive : Rectangle}
                style={componentStyles.imgTagIcon}
              />
              <Spacer width={CustomSpacing(8)} />
              <Text
                style={[
                  selected !== -1 ? Fonts.labelSemiBold : Fonts.label,
                  {color: Colors.neutral90},
                ]}>
                {item.name}
              </Text>
            </HStack>
            <HStack>
              {item.price !== 0 && item.active && (
                <HStack>
                  <Text
                    style={[
                      Fonts.label,
                      {color: Colors.neutral80},
                    ]}>{`+${Numbro.formatCurrency(item?.price)}`}</Text>
                </HStack>
              )}
            </HStack>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  const renderMultipleSelect = ({item, index}) => {
    const selected = selectedData.multipleSelect.findIndex(
      (selectedItem) => selectedItem.id === item.id,
    );
    return (
      <VStack>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleMultipleSelected(item)}
          key={index}
          style={componentStyles.itemContainer}>
          <HStack style={{justifyContent: 'space-between'}}>
            <HStack>
              <FastImage
                source={selected !== -1 ? CheckboxActive : Checkbox}
                style={componentStyles.imgTagIcon}
              />
              <Spacer width={CustomSpacing(8)} />
              <Text
                style={[
                  selected !== -1 ? Fonts.labelSemiBold : Fonts.label,
                  {color: Colors.neutral90},
                ]}>
                {item.name}
              </Text>
            </HStack>
            <HStack>
              {item.price !== 0 && item.active && (
                <HStack>
                  <Text
                    style={[
                      Fonts.label,
                      {color: Colors.neutral80},
                    ]}>{`+${Numbro.formatCurrency(item?.price)}`}</Text>
                </HStack>
              )}
              {!item.active && (
                <HStack>
                  <Text style={[Fonts.label, {color: Colors.dangerMain}]}>
                    {t('wlOutofStock')}
                  </Text>
                </HStack>
              )}
            </HStack>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <>
      <VStack style={componentStyles.restaurantContainer}>
        <VStack style={componentStyles.restaurantContainer}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <VStack>
              {/* Profile Picture */}
              <FastImage
                source={{
                  uri: productData?.productspictures?.path,
                }}
                style={componentStyles.imgProfileBg}
              />
              {/* Navigator */}
              <Navigator />
            </VStack>
            <VStack>
              {/* Header */}
              <HeaderContainer />
              <Spacer height={dimensions.screenWidth * 0.43} />
              {productData.productsdetails.description &&
                productData.productsdetails.description.length < 100 && (
                  <Spacer height={CustomSpacing(30)} />
                )}
              {productData.productsdetails.description &&
                productData.productsdetails.description.length > 100 && (
                  <Spacer height={CustomSpacing(90)} />
                )}
              <VStack style={componentStyles.itemContainer}>
                {productData.productsvariants !== null &&
                  productData.productsvariants.map((item, index) => {
                    return (
                      <VStack key={`variant-${index}`}>
                        <HStack>
                          <Text style={[Fonts.bodySemiBold]}>{item.name}</Text>
                          <Text
                            style={[Fonts.captionM, {color: Colors.neutral70}]}>
                            {` • `}{' '}
                            {item.max > 1
                              ? item.min !== 0
                                ? `Min ${item.min} Max ${item.max}`
                                : `Max ${item.max}`
                              : `Select ${item.max}`}
                          </Text>
                          <Spacer width={CustomSpacing(8)} />
                          {warningSubmit !== null &&
                            warningSubmit.includes(item.id) && (
                              <Text
                                style={[
                                  Fonts.captionM,
                                  {color: Colors.dangerMain},
                                ]}>
                                Must be selected
                              </Text>
                            )}
                        </HStack>
                        <Text
                          style={[
                            Fonts.captionS,
                            {
                              color:
                                item.type === 1
                                  ? Colors.supportMain
                                  : Colors.neutral70,
                            },
                          ]}>
                          {item.type === 1 ? t('wlRequire') : t('wlOptional')}
                        </Text>
                        {item.max === 1 && (
                          <FlatList
                            data={item.variantsdetails}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderSingleSelect}
                            keyExtractor={(item, index) => index.toString()}
                            maxToRenderPerBatch={5}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{
                                  height: 2,
                                  backgroundColor: Colors.backgroundMain,
                                }}
                              />
                            )}
                            ListFooterComponent={() => (
                              <>
                                <View
                                  style={{
                                    height: 5,
                                    backgroundColor: Colors.backgroundMain,
                                  }}
                                />
                                <Spacer height={CustomSpacing(16)} />
                              </>
                            )}
                            updateCellsBatchingPeriod={100}
                            initialNumToRender={5}
                            windowSize={10}
                          />
                        )}
                        {item.max !== 1 && (
                          <FlatList
                            data={item.variantsdetails}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderMultipleSelect}
                            keyExtractor={(item, index) => index.toString()}
                            maxToRenderPerBatch={5}
                            updateCellsBatchingPeriod={100}
                            initialNumToRender={5}
                            windowSize={10}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{
                                  height: 2,
                                  backgroundColor: Colors.backgroundMain,
                                }}
                              />
                            )}
                            ListFooterComponent={() => (
                              <>
                                <View
                                  style={{
                                    height: 5,
                                    backgroundColor: Colors.backgroundMain,
                                  }}
                                />
                                <Spacer height={CustomSpacing(16)} />
                              </>
                            )}
                          />
                        )}
                      </VStack>
                    );
                  })}
                <VStack>
                  <HStack>
                    <Text
                      style={[Fonts.bodySemiBold, {color: Colors.neutral90}]}>
                      {t('wlNotes')}
                    </Text>
                  </HStack>
                  <Spacer height={CustomSpacing(2)} />
                  <Text style={[Fonts.captionS, {color: Colors.neutral70}]}>
                    {t('wlOptional')}
                  </Text>
                  <Spacer height={CustomSpacing(8)} />
                  <TextInput
                    placeholder={t('pExampleMoreSauce')}
                    style={[Fonts.label, componentStyles.notes]}
                    value={productNotes}
                    onChangeText={(text) => setProductNotes(text)}
                  />
                </VStack>
              </VStack>
            </VStack>

            <Spacer height={CustomSpacing(16)} />
          </Animated.ScrollView>
          <VStack style={componentStyles.ButtonAddtoCart}>
            <Button
              disabled={warningSubmit !== null}
              onPress={handleSubmitForm}
              style={{color: Colors.primarySurface}}
              label={`${
                route?.route?.params?.edit
                  ? t('btnEdittoCart')
                  : t('btnAddtoCart')
              } - Rp ${Numbro.formatCurrency(totalPrice)}`}
              type="primary"
              size="large"
            />
            <Spacer height={CustomSpacing(24)} />
          </VStack>
        </VStack>
      </VStack>
      <ListExistingFavoriteModal
        showing={showListExistingFavoriteModal}
        close={handleOpenListExistingFavoriteModal}
        products_id={favoriteItem}
      />
    </>
  );
});

export default FoodDetails;
