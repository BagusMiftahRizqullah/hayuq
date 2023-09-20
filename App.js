import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import MainNavigator from '@route';
import {StoreProvider} from '@store/root.store';

import NotificationController from './src/utils/NotificationController';
import codePush from 'react-native-code-push';
import InAppUpdate from './InAppUpdate';
import * as Sentry from '@sentry/react-native';
import Smartlook from 'react-native-smartlook-analytics';
import {useStores} from '@store/root.store';

Smartlook.instance.preferences.setProjectKey(
  '1d2b76c0358e8c34f96ea233ad75c55f6a4cd1f9',
);

Sentry.init({
  dsn: 'https://bff583d95e094a73a10dcf0f3989cc61@o1316409.ingest.sentry.io/4505465875333120',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  _experiments: {
    // The sampling rate for profiling is relative to TracesSampleRate.
    // In this case, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
  integrations: [
    //  new Sentry.Replay({
    //   // Additional SDK configuration goes in here, for example:
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
  ],
});

const App = () => {
  const {routerStore} = useStores();

  useEffect(() => {
    Smartlook.instance.start();
    if (Platform.OS !== 'ios') {
      if (InAppUpdate.checkUpdate()) {
        routerStore.setInAppUpdate(true);
        console.log('Waiting For Update');
      } else {
        routerStore.setInAppUpdate(false);
        console.log("Does't Update For Now");
      }
    } else {
      console.log('Runing From IOS');
    }
  }, []);

  return (
    <StoreProvider>
      <NotificationController />
      <MainNavigator />
    </StoreProvider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

export default codePush(codePushOptions)(Sentry.wrap(App));
