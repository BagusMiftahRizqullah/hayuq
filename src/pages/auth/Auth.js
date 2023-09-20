import React, {useState} from 'react';
import {Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Carousel from 'react-native-reanimated-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';

import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {DashboardBg} from '@assets';
import {useTranslation} from 'react-i18next';

import {LoginOverlay, RegisterOverlay} from './Components';
import {useStores} from '@store/root.store';

import styles from './Auth.style';

const Auth = observer(() => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {accountStore} = useStores();
  const SLIDER_WIDTH = Dimensions.get('window').width + 80;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const componentStyles = styles();

  const [isCurrentProgress, setIsCurrentProgress] = useState('');
  const [index, setIndex] = useState(0);

  const handleResteCurrentProgress = () => {
    setIsCurrentProgress('');
  };

  const goToWebViewComponent = () => {
    navigation.navigate('WebViewComponent');
  };

  const data = [
    {
      title: t('greeting'),
      body: t('greetingDesc'),
    },
    {
      title: t('greetingVariant'),
      body: t('greetingVariantDesc'),
    },
    {
      title: t('greetingSafe'),
      body: t('greetingSafeDesc'),
    },
  ];

  const _renderItem = ({item, index}) => {
    return (
      <VStack key={`render-item-${index}`}>
        <Text style={[Fonts.titleSBold, {textAlign: 'center'}]}>
          {item.title}
        </Text>
        <VStack style={componentStyles.renderSubtitle}>
          <Text style={[Fonts.captionM, {textAlign: 'center'}]}>
            {item.body}
          </Text>
        </VStack>
      </VStack>
    );
  };

  return (
    <VStack style={[Layout.heightFull, {backgroundColor: Colors.primaryMain}]}>
      <Image source={DashboardBg} style={componentStyles.imgBg} />
      <Animatable.View
        duration={600}
        easing="ease-out"
        animation={'fadeInUp'}
        useNativeDriver
        style={componentStyles.containerBoarding}>
        <VStack style={componentStyles.containerCarousel}>
          <VStack>
            <Carousel
              loop
              width={ITEM_WIDTH}
              height={CustomSpacing(110)}
              autoPlay={isCurrentProgress === '' ? true : false}
              data={data}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setIndex(index)}
              renderItem={_renderItem}
            />
            <VStack style={componentStyles.paginationDot}>
              <PaginationDot
                activeDotColor={Colors.neutral80}
                curPage={index}
                maxPage={3}
              />
            </VStack>
          </VStack>
          <Spacer height={CustomSpacing(16)} />
          <Button
            type="primary"
            label={t('login')}
            onPress={() => {
              setIsCurrentProgress('login');
            }}
          />
          <Spacer height={CustomSpacing(16)} />
          <Button
            type="secondary"
            label={t('register')}
            onPress={() => {
              setIsCurrentProgress('register');
            }}
          />
          <Spacer height={CustomSpacing(12)} />
          <Text style={[Fonts.caption]}>{t('agreement')}</Text>
          <HStack>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                accountStore.setWebViewParam('tnc');
                goToWebViewComponent();
              }}>
              <Text style={[Fonts.caption, {color: Colors.primaryPressed}]}>
                {t('tnc')}
              </Text>
            </TouchableOpacity>
            <Text style={[Fonts.caption]}> & </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                accountStore.setWebViewParam('privacy');
                goToWebViewComponent();
              }}>
              <Text style={[Fonts.caption, {color: Colors.primaryPressed}]}>
                {t('privacy')}
              </Text>
            </TouchableOpacity>
          </HStack>
          <Spacer height={CustomSpacing(18)} />
        </VStack>
      </Animatable.View>
      <LoginOverlay
        showing={isCurrentProgress === 'login'}
        close={handleResteCurrentProgress}
      />
      <RegisterOverlay
        showing={isCurrentProgress === 'register'}
        close={handleResteCurrentProgress}
      />
    </VStack>
  );
});

export default Auth;
