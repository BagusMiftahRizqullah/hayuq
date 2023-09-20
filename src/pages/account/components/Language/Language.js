import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, DevSettings} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {CustomSpacing, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {
  LinkIcon,
  PaymentIcon,
  ReceiptIcon,
  SaveIcon,
  ChevronRightIcon,
  PrivacyIcon,
  TermsIcon,
  BackGreyIcon,
  LanguageBg,
  UsFlag,
  IdFlag,
} from '@assets';
import {useTranslation} from 'react-i18next';

import {useStores} from '@store/root.store';
import {observer} from 'mobx-react-lite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Language.style';

const Language = observer(() => {
  const {t, i18n} = useTranslation();
  const {routerStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [currentLanguage, setCurrentLanguage] = useState();
  const [languageActive, setLanguageActive] = useState(null);

  const switchLang = async (lang) => {
    await routerStore.setLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
    await i18n.changeLanguage(lang);
  };

  const handleLangunage = (id) => {
    setLanguageActive(id);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const languangeList = [
    {
      id: 1,
      code: 'en',
      title: 'English (EN)',
      icon: UsFlag,
    },
    {
      id: 2,
      code: 'id',
      title: 'Bahasa Indonesia (ID)',
      icon: IdFlag,
    },
  ];

  useEffect(() => {
    const currentLanguage = routerStore.defaultLanguage;

    if (currentLanguage == 'id') {
      setCurrentLanguage(currentLanguage);
      setLanguageActive(2);
    } else {
      setCurrentLanguage(currentLanguage);
      setLanguageActive(1);
    }
  }, [routerStore.defaultLanguage]);

  return (
    <VStack
      style={{
        height: '100%',
        backgroundColor: Colors.neutral10,
      }}>
      {/* ------ Header------ */}
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={LanguageBg}
            style={componentStyles.imgProfileBg}
            resizeMode="cover"
          />
        </Animatable.View>
        <HStack style={componentStyles.containerNavigator}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgGoback}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
          <Text style={[Fonts.headlineL]}>{t('language')}</Text>
        </HStack>
      </VStack>
      <Spacer height={CustomSpacing(16)} />
      {/* ------ List Language------ */}
      <VStack
        style={{
          padding: CustomSpacing(16),
        }}>
        <VStack style={componentStyles.containerMyAccount}>
          {languangeList.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`language-${index}`}
              onPress={() => {
                switchLang(item.code), handleLangunage(item.id);
              }}>
              <HStack style={componentStyles.containerListLanguage}>
                <HStack>
                  <FastImage
                    source={item.icon}
                    style={{
                      width: CustomSpacing(24),
                      height: CustomSpacing(24),
                    }}
                  />
                  <Spacer width={CustomSpacing(8)} />
                  <Text style={[Fonts.label]}>{item.title}</Text>
                </HStack>
                {languageActive === item.id ? (
                  <View style={componentStyles.activeOuter}>
                    <View style={componentStyles.activeInner} />
                  </View>
                ) : (
                  <View style={componentStyles.inActiveOuter} />
                )}
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default Language;
