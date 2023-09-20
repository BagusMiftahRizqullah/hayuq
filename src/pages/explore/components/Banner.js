import React from 'react';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import {VStack, HStack, Spacer, Button} from '@components';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {dimensions} from '@config/Platform.config';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {PromoTes} from '@assets';
import {observer} from 'mobx-react-lite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStores} from '@store/root.store';

const Banner = observer(({isModalVisible, toggleModalBanner, bannerData}) => {
  const navigation = useNavigation();

  const {authStore} = useStores();
  const goToDetail = async (data) => {
    if (data.type_banner == 'TOPUP') {
      (await CekUserToken()) ? navigation.navigate('HistoryPayyuq') : null;
    } else if (data.type_banner == 'DANA') {
      (await CekUserToken()) ? navigation.navigate('HistoryDana') : null;
    } else if (data.type_banner == 'REFERAL') {
      (await CekUserToken()) ? navigation.navigate('Affiliate') : null;
    } else {
      return;
    }
  };
  const CekUserToken = async () => {
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    if (TOKEN !== null) {
      authStore.setIsToken('IS_TOKEN');
      return true;
    } else {
      authStore.setIsToken('NO_TOKEN');
      return false;
    }
  };
  return (
    <VStack>
      <Modal isVisible={isModalVisible}>
        <VStack style={{alignItems: 'center'}}>
          <Carousel
            mode="parallax"
            sliderWidth={dimensions.screenWidth}
            itemWidth={dimensions.screenWidth}
            snapEnabled={true}
            loop
            width={dimensions.screenWidth}
            height={dimensions.screenHeight - CustomSpacing(100)}
            autoPlay={true}
            scrollAnimationDuration={3000}
            data={bannerData}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({item}) => (
              <VStack
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => goToDetail(item)}>
                  <FastImage
                    source={{uri: item.path}}
                    style={{
                      width: dimensions.screenWidth,
                      height: dimensions.screenHeight,
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </TouchableOpacity>
              </VStack>
            )}
          />
        </VStack>

        <Button label="Tutup" onPress={toggleModalBanner} />
      </Modal>
    </VStack>
  );
});

export default Banner;
