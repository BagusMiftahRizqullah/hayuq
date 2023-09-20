import axios from 'axios';
// create mobx store
import {makeAutoObservable} from 'mobx';
import ApiClient from './Account.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino from 'pino';
const log = pino().child({module: 'ExploreStore'});

export class AccountStore {
  webViewParam = '';
  affiliateData = null;
  affiliateLoading = false;
  affiliateError = null;
  affiliateUserData = null;
  affiliateUserLoading = false;
  affiliateUserError = null;
  affiliateDriverData = null;
  affiliateDriverLoading = false;
  affiliateDriverError = null;
  accountData = null;
  accountLoading = false;
  accountError = null;
  deleteAccountData = null;
  deleteAccountLoading = false;
  deleteAccountError = null;

  constructor() {
    makeAutoObservable(this);
  }

  setWebViewParam = (param) => {
    this.webViewParam = param;
  };

  // Start Get Affiliated Data
  async getAffiliateData() {
    this.affiliateLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      // User No Data
      // const USER_ID = 'b27091d8-e64c-465f-9be9-7ff0e2f93e38';
      // User
      // const USER_ID = 'b27091d8-e64c-465f-9be9-7ff0e2f93e38';

      // //Leader
      // const USER_ID = '589d8c71-d7c1-4cc2-92de-a55c76c0e83e';
      // //member
      // const USER_ID = '89c89516-9301-4cc6-84fa-73b95a360551';
      // //influencer
      // const USER_ID = '656fb5bb-dd11-4a88-9fd8-282bcdd7e3eb';

      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetAffiliate(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });

      if (response.data.code === 200) {
        log.info('GET ACCOUNT AFFILIATE SUCCESS', response.data.data);
        this.getAccountAffiliateSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET ACCOUNT AFFILIATE', error);
      this.getAccountAffiliateFailed(error);
    } finally {
      this.affiliateLoading = false;
    }
  }

  getAccountAffiliateSuccess(data) {
    this.affiliateData = data;
  }

  getAccountAffiliateFailed(data) {
    this.affiliateError = data;
  }

  async getDetailAffiliateUser() {
    this.affiliateUserLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(
        ApiClient.apiGetDetailUserAffiliate(USER_ID),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET USER AFFILIATE SUCCESS', response.data.data);
        this.getUserAffiliateSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET USER AFFILIATE', error);
      this.getUserAffiliateFailed(error);
    } finally {
      this.affiliateUserLoading = false;
    }
  }

  getUserAffiliateSuccess(data) {
    this.affiliateUserData = data;
  }

  getUserAffiliateFailed(data) {
    this.affiliateUserError = data;
  }

  async getDetailAffiliateDriver() {
    this.affiliateDriverLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(
        ApiClient.apiGetDetailDriverAffiliate(USER_ID),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET DRIVER AFFILIATE SUCCESS', response.data.data);
        this.getUserAffiliateSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET DRIVER AFFILIATE', error);
      this.getUserAffiliateFailed(error);
    } finally {
      this.affiliateDriverLoading = false;
    }
  }

  getDriverAffiliateSuccess(data) {
    this.affiliateDriverData = data;
  }

  getDriverAffiliateFailed(data) {
    this.affiliateDriverError = data;
  }

  // Start Get Detail Account
  async getDetailsAccount() {
    this.accountLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetDetailAccount(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET ACCOUNT DETAIL SUCCESS', response.data.data);
        this.getDetailAccountSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET ACCOUNT DETAIL', error);
      this.getDetailAccountFailed(error);
    } finally {
      this.accountLoading = false;
    }
  }

  getDetailAccountSuccess(data) {
    this.accountData = data;
  }

  getDetailAccountFailed(data) {
    this.accountError = data;
  }

  // Start Delete Account
  async deleteAccount() {
    this.deleteAccountLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiGetDeleteAccount(),
        {
          users_id: USER_ID,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('DELETE ACCOUNT SUCCESS', response.data.data);
        this.deleteAccountSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR DELETE ACCOUNT', error);
      this.deleteAccountFailed(error);
    } finally {
      this.deleteAccountLoading = false;
    }
  }

  deleteAccountSuccess(data) {
    this.deleteAccountData = data;
  }

  deleteAccountFailed(data) {
    this.deleteAccountError = data;
  }
  // --- Clear Store ---

  clearAccountStore() {
    log.info('REMOVE EVERYTHING!!');
    this.affiliateUserData = null;
    this.affiliateUserLoading = false;
    this.affiliateUserError = null;
    this.affiliateData = null;
    this.affiliateLoading = false;
    this.affiliateError = null;
    this.accountData = null;
    this.accountLoading = false;
    this.accountError = null;
    this.deleteAccountData = null;
    this.deleteAccountLoading = false;
    this.deleteAccountError = null;
  }
}
