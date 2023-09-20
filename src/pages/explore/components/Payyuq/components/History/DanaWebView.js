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

import styles from './DanaWebView.style';

const DanaWebView = observer(() => {
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const goBack = async () => {
    if (navigation.canGoBack()) {
      await exploreStore.clearTopUpDana();
      await navigation.goBack();
    }
  };

  useEffect(() => {
    if (exploreStore.topUpDanaData !== null) {
      setUrl(exploreStore.topUpDanaData?.webRedirectUrl);
    }
  }, [exploreStore.topUpDanaData]);

  const parseTitle = () => {
    return <Text style={[Fonts.headlineL]}>TopUp DANA</Text>;
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
        incognito={true}
        onNavigationStateChange={async (event) => {
          if (event?.title?.includes('refund-callback')) {
            await exploreStore.clearTopUpDana();
            navigation.navigate('HistoryPayyuq');
          }
        }}
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

export default DanaWebView;
