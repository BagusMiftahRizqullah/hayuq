import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {observer} from 'mobx-react-lite';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {BackGreyIcon} from '@assets';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {useStores} from '@store/root.store';

import styles from './WebView.style';

const WebViewComponent = observer(() => {
  const {accountStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      accountStore.setWebViewParam('');
    }
  };

  useEffect(() => {
    if (accountStore.webViewParam === 'help') {
      setUrl('https://hayuq.com/help-centre');
    }
    if (accountStore.webViewParam === 'tnc') {
      setUrl('https://hayuq.com/privacy-policy?type=user&status=tnc');
    }
    if (accountStore.webViewParam === 'privacy') {
      setUrl('https://hayuq.com/privacy-policy?type=user&status=privacy');
    }
  }, []);

  const parseTitle = () => {
    let textTitle;
    switch (accountStore.webViewParam) {
      case 'help':
        textTitle = 'Help Centre';
        break;
      case 'tnc':
        textTitle = 'Terms & Conditions';
        break;
      case 'privacy':
        textTitle = 'Privacy Policy';
        break;
      default:
        textTitle = 'Help Centre';
        break;
    }
    return <Text style={[Fonts.headlineL]}>{textTitle}</Text>;
  };

  return (
    <VStack
      style={{
        flex: 1,
        backgroundColor: Colors.neutral10,
      }}>
      <Spacer topSafeAreaHeight />
      <HStack style={componentStyles.navigationContainer}>
        <TouchableOpacity onPress={goBack}>
          <FastImage
            source={BackGreyIcon}
            style={componentStyles.imgBackIcon}
          />
        </TouchableOpacity>
        <Spacer width={CustomSpacing(16)} />
        {parseTitle()}
      </HStack>
      <WebView
        onLoad={() => setLoading(false)}
        originWhitelist={['*']}
        source={{uri: url ?? 'https://hayuq.com/help-centre'}}
      />
      {loading && (
        <Animatable.View
          animation="fadeIn"
          style={componentStyles.loadingIndicator}>
          <ActivityIndicator size="large" color={Colors.secondaryMain} />
        </Animatable.View>
      )}
    </VStack>
  );
});

export default WebViewComponent;
