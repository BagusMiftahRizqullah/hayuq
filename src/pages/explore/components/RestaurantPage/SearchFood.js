import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, TextInput, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {dimensions} from '@config/Platform.config';

import Numbro from '@utils/numbro';
import styles from './RestaurantPage.style';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import * as _ from 'lodash';
import {useTranslation} from 'react-i18next';

const SearchFood = observer(({route}) => {
  const {t, i18n} = useTranslation();
  const {merchantscategorys_id} = route.params;

  const {exploreStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();

  const [restaurantFoodData, setRestaurantFoodData] = useState([]);

  const [searchString, setSearchString] = useState('');

  const goToFoodDetail = (data) => {
    exploreStore.setProductDetail(data);
    navigation.navigate('FoodDetails');
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  useEffect(() => {
    if (exploreStore.merchantDetailId) {
      exploreStore.getMerchantDetail(exploreStore.merchantDetailId);
    }
  }, []);

  useEffect(() => {
    if (exploreStore.merchantDetailData) {
      if (
        exploreStore.merchantDetailData.categorys.length > 0 &&
        merchantscategorys_id === undefined
      ) {
        let data = [];
        exploreStore.merchantDetailData.categorys.map((item) => {
          item.products.map((product) => {
            data.push(product);
          });
        });
        setRestaurantFoodData(data);
      } else if (
        exploreStore.merchantDetailData.categorys.length > 0 &&
        merchantscategorys_id !== undefined
      ) {
        let data = [];
        exploreStore.merchantDetailData.categorys.map((item) => {
          item.products.map((product) => {
            if (product.merchantscategorys_id === merchantscategorys_id) {
              data.push(product);
            }
          });
        });
        setRestaurantFoodData(data);
      }
    }
  }, [exploreStore.merchantDetailData]);

  useEffect(() => {
    if (searchString.length > 0 && exploreStore.merchantDetailData) {
      let data = [];
      exploreStore.merchantDetailData?.categorys.map((item) => {
        item.products.map((product) => {
          if (merchantscategorys_id) {
            if (
              product.name
                .toLowerCase()
                .includes(
                  searchString.toLowerCase() &&
                    product.merchantscategorys_id === merchantscategorys_id,
                )
            ) {
              data.push(product);
            }
          } else {
            if (
              product.name.toLowerCase().includes(searchString.toLowerCase())
            ) {
              data.push(product);
            }
          }
        });
      });
      setRestaurantFoodData(data);
    } else {
      let data = [];
      exploreStore.merchantDetailData?.categorys.map((item) => {
        item.products.map((product) => {
          if (
            merchantscategorys_id &&
            product.merchantscategorys_id === merchantscategorys_id
          ) {
            data.push(product);
          } else if (!merchantscategorys_id) {
            data.push(product);
          }
        });
      });
      setRestaurantFoodData(data);
    }
  }, [searchString]);

  const RenderSection = ({item, index}) => {
    return (
      <VStack>
        <HStack
          style={[
            {
              borderBottomWidth: 1,
            },
            componentStyles.renderSectionContainer,
          ]}>
          <FastImage
            source={{uri: item.productspictures.path}}
            style={componentStyles.imgRenderSection}
          />
          <Spacer width={CustomSpacing(12)} />
          <VStack
            style={{
              width: dimensions.screenWidth - CustomSpacing(130),
            }}>
            <Text style={[Fonts.bodySemiBold]}>{item.name}</Text>
            <Text style={[Fonts.captionS]}>
              {item.rating !== null ? item.rating?.sold : 0} {t('wlSold')}{' '}
              {item.rating?.likes} {t('wlLikes')}
            </Text>
            <Spacer height={CustomSpacing(12)} />
            <HStack justifyContent="space-between">
              <Text style={[Fonts.bodySemiBold]}>
                {Numbro.formatCurrency(item.productsprices.total)}
              </Text>
              <Button
                onPress={() => goToFoodDetail(item)}
                label="Add"
                type="primary"
                size="small"
              />
            </HStack>
          </VStack>
        </HStack>
        <Spacer height={CustomSpacing(12)} />
      </VStack>
    );
  };

  return (
    <VStack style={componentStyles.searchFoodContainer}>
      <Spacer topSafeAreaHeight />
      {/* Header */}
      <VStack style={componentStyles.headerContainer}>
        <HStack>
          <HStack style={componentStyles.searchContainer}>
            <Icon name="search" size={16} color={Colors.neutral70} />
            <Spacer width={CustomSpacing(16)} />
            <TextInput
              autoFocus={merchantscategorys_id ? false : true}
              style={componentStyles.textInputStyle}
              underlineColorAndroid="transparent"
              placeholder="Search food"
              allowClear
              value={searchString}
              onChangeText={(value) => {
                setSearchString(value);
              }}
            />
          </HStack>
          <Spacer width={CustomSpacing(16)} />
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <Text style={[Fonts.labelSemiBold]}>Cancel</Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
      {!merchantscategorys_id &&
        searchString.length > 0 &&
        restaurantFoodData.length > 0 && (
          <FlatList
            style={{
              paddingHorizontal: CustomSpacing(16),
            }}
            data={restaurantFoodData}
            renderItem={RenderSection}
            keyExtractor={(item, index) => `promo-${index.toString()}`}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            initialNumToRender={5}
            windowSize={10}
            contentContainerStyle={{paddingBottom: CustomSpacing(150)}}
          />
        )}
      {merchantscategorys_id && restaurantFoodData.length > 0 && (
        <FlatList
          style={{
            paddingHorizontal: CustomSpacing(16),
          }}
          data={restaurantFoodData}
          renderItem={RenderSection}
          keyExtractor={(item, index) => `promo-${index.toString()}`}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          windowSize={10}
          contentContainerStyle={{paddingBottom: CustomSpacing(150)}}
        />
      )}
    </VStack>
  );
});

export default SearchFood;
