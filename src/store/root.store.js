import React, {createContext, useContext, useState} from 'react';
import {configure} from 'mobx';
import {persist, create} from 'mobx-persist';
import pino from 'pino';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ExploreStore} from '@pages/explore/Explore.store';
import {RouterStore} from '@route/Router.store';
import {AuthStore} from '@pages/auth/Auth.store';
import {HistoryStore} from '@pages/history/History.store';
import {OrderStore} from '@pages/order/Order.store';
import {AccountStore} from '@pages/account/Account.store';
import {HomeStore} from '@pages/home/Home.store';
import {PickyuqStore} from '@pages/pickyuq/Pickyuq.store';

const log = pino().child({module: 'ExploreStore'});

configure({
  enforceActions: 'never',
});
const hydrate = create({
  storage: AsyncStorage,
});
export class RootStore {
  orderStore = new OrderStore(this);
  historyStore = new HistoryStore(this);
  exploreStore = new ExploreStore(this);
  routerStore = new RouterStore(this);
  authStore = new AuthStore(this);
  accountStore = new AccountStore(this);
  homeStore = new HomeStore(this);
  pickyuqStore = new PickyuqStore(this);

  constructor() {
    Promise.all([
      hydrate('authStore', this.authStore),
      hydrate('exploreStore', this.exploreStore),
      hydrate('routerStore', this.routerStore),
    ]).then((e) => {
      log.info('HYDRATE SUCCESS');
    });
  }
}
export const RootsStoreContext = createContext(new RootStore());

export const useStores = () => useContext(RootsStoreContext);

export const StoreProvider = ({children}) => {
  const [store] = useState(() => new RootStore());
  return (
    <RootsStoreContext.Provider value={store}>
      {children}
    </RootsStoreContext.Provider>
  );
};
