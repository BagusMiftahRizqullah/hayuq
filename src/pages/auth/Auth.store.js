// create mobx store
import axios from 'axios';
import {makeAutoObservable, observable} from 'mobx';
import ApiClient from './Auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino from 'pino';
import {persist} from 'mobx-persist';

const log = pino().child({module: 'AuthStore'});
export class AuthStore {
  // @persist @observable authenticated = true;
  @persist @observable authenticated = false;
  isToken = null;
  loginData = null;
  loginError = null;
  loginLoading = false;
  // --- Verify OTP ---
  verifyOtpLoading = false;
  verifyOtpError = null;
  verifyOtpData = null;
  // --- Register ---
  registerData = null;
  registerError = null;
  registerLoading = false;
  // --- Token Firebase ---
  tokenFirebaseId = null;
  tokenFirebaseData = null;
  tokenFirebaseError = null;
  tokenFirebaseLoading = false;
  // USERID
  // @persist @observable userId = '7a9a562c-1d48-41cb-bcec-a74933698b71';
  // PROD
  // @persist @observable userId = 'fb6c836b-c7c8-4b5b-9591-82692e7dbb2a';

  @persist @observable userId = null;

  constructor() {
    makeAutoObservable(this);
  }
  // --- Action ---

  setAuthenticated = (authenticated) => {
    this.authenticated = authenticated;
  };

  setTokenFirebaseId = (tokenFirebaseId) => {
    this.tokenFirebaseId = tokenFirebaseId;
  };

  setIsToken = (status) => {
    this.isToken = status;
  };

  // --- end of Action ---
  // --- Login ---
  async login(phone) {
    this.loginLoading = true;
    try {
      const response = await axios.post(ApiClient.apiLoginUsers(), {
        phone: phone,
      });

      if (response.data.code === 200) {
        log.info('LOGIN SUCCESS', response.data.data);
        this.loginSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.error('ERROR LOGIN', response.messages);
        this.loginFailed(response.messages);
      } else {
        log.error('ERROR LOGIN', response.messages);
        this.loginFailed(response.messages);
      }
    } catch (error) {
      log.error('ERROR LOGIN', error);
      this.loginFailed(error);
    } finally {
      this.loginLoading = false;
    }
  }

  loginSuccess = (data) => {
    this.loginData = data;
  };

  loginFailed = (data) => {
    this.loginError = data;
  };

  // --- end of Login ---

  // --- Verify OTP ---
  async verifyOtpLogin(otp) {
    this.verifyOtpError = null;
    this.verifyOtpLoading = true;
    try {
      const response = await axios.post(ApiClient.apiVerifyOtp(), {
        otp: otp,
        type: 1,
        users: {
          phone: this.loginData.users.phone,
          email: this.loginData.users.email,
          name: this.loginData.users.name,
        },
      });
      if (response.data.code === 200) {
        log.info('VERIFY OTP SUCCESS', response.data.data);
        this.verifyOtpSuccess(response.data.data);
      } else {
        log.error('VERIFY OTP ERROR', response.data);
        this.verifyOtpFailed(response.data);
        this.verifyOtpLoading = false;
      }
    } catch (error) {
      log.error('VERIFY OTP ERROR', error);
      this.verifyOtpFailed(error);
      this.verifyOtpLoading = false;
    } finally {
      this.verifyOtpLoading = false;
    }
  }

  async verifyOtpRegister(otp) {
    this.verifyOtpError = null;
    this.verifyOtpLoading = true;

    try {
      const response = await axios.post(ApiClient.apiVerifyOtp(), {
        otp_id: this.registerData.otp_id,
        otp: otp,
        type: 2,
        users: {
          phone: this.registerData.users.phone,
          email: this.registerData.users.email,
          name: this.registerData.users.name,
          code: this.registerData.users.referalCode,
        },
      });
      if (response.data.code === 200) {
        log.info('VERIFY OTP SUCCESS', response.data.data);
        this.verifyOtpSuccess(response.data.data);
      } else {
        log.error('VERIFY OTP ERROR', response.data);
        this.verifyOtpFailed(response.data);
      }
    } catch (error) {
      log.error('VERIFY OTP ERROR', error);
      this.verifyOtpFailed(error);
    } finally {
      this.verifyOtpLoading = false;
    }
  }

  verifyOtpSuccess = async (data) => {
    if (data !== null) {
      await AsyncStorage.setItem('TOKEN', data.tokens.tokensjwt);
      await AsyncStorage.setItem('USER_ID', data.users.id);
      this.userId = data.users.id;
      this.verifyOtpData = data;
    } else {
      await AsyncStorage.setItem(
        'USER_ID',
        '0643afac-0702-4681-a481-46fc72925f0e',
      );
      this.userId = '0643afac-0702-4681-a481-46fc72925f0e';
    }
  };

  verifyOtpFailed = async (data) => {
    this.verifyOtpError = data;
    // this.verifyOtpData = data;
  };
  // --- end of Verify OTP ---

  // --- Register ---
  async register(data) {
    this.registerLoading = true;

    try {
      const response = await axios.post(ApiClient.apiRegisterUsers(), data);
      if (response.data.code === 200) {
        log.info('REGISTER SUCCESS', response.data.data);
        this.registerSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.error('ERROR REGISTER', response.data);
        this.registerFailed(response.data.messages);
      } else if (response.data.code === 202) {
        log.error('ERROR REGISTER', response.data);
        this.registerFailed('email');
      }
    } catch (error) {
      log.error('ERROR REGISTER', error);
      this.registerFailed(error);
    } finally {
      this.registerLoading = false;
    }
  }

  registerSuccess = (data) => {
    this.registerData = data;
  };

  registerFailed = (data) => {
    this.registerError = data;
  };

  // --- end of Register ---
  // --- Token FCM ---
  async postTokenFcm() {
    this.tokenFirebaseLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const data = {
        users_id: USER_ID,
        tokens: {
          token: this.tokenFirebaseId,
          type: 3,
        },
      };
      const response = await axios.post(ApiClient.apiPostTokenFCM(), data);
      if (response.data.code === 200) {
        log.info('POST TOKEN SUCCESS', response.data.data);
        this.postTokenFcmSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.error('ERROR POST TOKEN', response.data.messages);
        this.postTokenFcmFailed(response.data.messages);
      } else {
        log.error('ERROR POST TOKEN', response.data.messages);
        this.postTokenFcmFailed(response.data.messages);
      }
    } catch (error) {
      log.error('ERROR REGISTER', error);
      this.postTokenFcmFailed(error);
    } finally {
      this.tokenFirebaseLoading = false;
    }
  }

  postTokenFcmSuccess = (data) => {
    this.tokenFirebaseData = data;
  };

  postTokenFcmFailed = (data) => {
    this.tokenFirebaseError = data;
  };
  // --- end of Token FCM ---

  clearAuthStore = async () => {
    log.info('REMOVE EVERYTHING!!');
    this.authenticated = false;
    this.loginData = null;
    this.loginError = null;
    this.loginLoading = false;
    this.verifyOtpLoading = false;
    this.verifyOtpError = null;
    this.verifyOtpData = null;
    this.registerData = null;
    this.registerError = null;
    this.registerLoading = false;
    this.isToken = null;
  };
}
