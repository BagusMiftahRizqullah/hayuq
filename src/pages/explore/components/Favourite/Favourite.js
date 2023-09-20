import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';

import AddFavoriteModal from './AddFavouriteModal';

import {
  BackGreyIcon,
  ChevronRightIcon,
  OulineAddIcon,
  EmptyFavourite,
} from '@assets';
import {useTranslation} from 'react-i18next';

import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';

import styles from './Favourite.style';

const Favourite = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore, authStore} = useStores();

  const navigation = useNavigation();
  const componentStyles = styles();
  const [showAddFavoriteModal, setShowAddFavoriteModal] = useState(false);
  const [favoriteData, setFavoriteData] = useState(null);

  useEffect(() => {
    exploreStore.getListFavorite();
  }, []);

  useEffect(() => {
    if (exploreStore.getListFavoriteData) {
      setFavoriteData(exploreStore.getListFavoriteData);
    }
  }, [exploreStore.getListFavoriteData]);

  const handleOpenAddFavoriteModal = () => {
    setShowAddFavoriteModal(!showAddFavoriteModal);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const goToDetailFavourite = (data) => {
    exploreStore.setCurrentFavoriteDetailData(data);
    navigation.navigate('DetailFavourite');
  };

  const getInitialName = (name) => {
    const nameSplit = name.split(' ');
    return nameSplit[0]?.charAt(0)?.toUpperCase();
  };

  return (
    <VStack style={componentStyles.favouriteContainer}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigator ------ */}
      <HStack>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage
            source={BackGreyIcon}
            style={componentStyles.imgBackIcon}
          />
        </TouchableOpacity>
        <Spacer width={CustomSpacing(12)} />
        <Text style={[Fonts.headlineL]}> {t('wlMyFavorites')}</Text>
      </HStack>
      {/* ------ Content Favourite ------ */}
      <Spacer height={CustomSpacing(24)} />
      <VStack>
        {favoriteData !== null && favoriteData.length > 0 ? (
          favoriteData.map((item) => (
            <VStack key={`favourite-${item.id}`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => goToDetailFavourite(item)}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                  }}>
                  <HStack>
                    {/* <FastImage
                      source={{
                        uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
                      }}
                      style={componentStyles.imgFavThumbnail}
                    /> */}
                    <VStack
                      style={{
                        width: CustomSpacing(64),
                        height: CustomSpacing(64),
                        borderRadius: CustomSpacing(12),
                        backgroundColor:
                          Colors.randomColor[
                            Math.floor(
                              Math.random() * Colors.randomColor.length,
                            )
                          ],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={[Fonts.titleMBold, {color: Colors.neutral10}]}>
                        {getInitialName(item.name)}
                      </Text>
                    </VStack>
                    <Spacer width={CustomSpacing(8)} />
                    <VStack>
                      <Text style={[Fonts.subhead]}>{item.name}</Text>
                      <Text style={[Fonts.captionM, {color: Colors.neutral70}]}>
                        {`${
                          item.collectionsdetails
                            ? item.collectionsdetails.length
                            : 0
                        } ${t('wlDishes')}`}
                      </Text>
                    </VStack>
                  </HStack>
                  <FastImage
                    source={ChevronRightIcon}
                    style={componentStyles.imgChevronRight}
                  />
                </HStack>
              </TouchableOpacity>
              <Spacer height={CustomSpacing(12)} />
            </VStack>
          ))
        ) : (
          <VStack
            style={[
              {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Spacer height={CustomSpacing(24)} />
            <FastImage
              source={EmptyFavourite}
              style={componentStyles.imgEmptyFavourite}
              resizeMode={'contain'}
            />
            <Spacer height={CustomSpacing(24)} />
            <Text stlye={[Fonts.label, {color: Colors.neutral40}]}>
              {t('wlAdddishesYourFavorites')}
            </Text>
          </VStack>
        )}
      </VStack>
      {/* ------ Add Favourite ------ */}
      <TouchableOpacity
        onPress={handleOpenAddFavoriteModal}
        style={componentStyles.floatBtn}>
        <HStack style={componentStyles.addFavBtn}>
          <FastImage
            source={OulineAddIcon}
            style={componentStyles.imgOutlineAdd}
          />
          <Spacer width={CustomSpacing(5)} />
          <Text style={[Fonts.subhead]}> {t('wlNewFavorite')}</Text>
        </HStack>
      </TouchableOpacity>
      <AddFavoriteModal
        showing={showAddFavoriteModal}
        close={handleOpenAddFavoriteModal}
      />
    </VStack>
  );
});

export default Favourite;
