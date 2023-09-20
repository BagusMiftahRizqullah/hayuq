// create mobx store
import axios from 'axios';
import {makeAutoObservable, observable} from 'mobx';
import ApiClient from './History.api';
import ApiClinetOrder from '../order/Order.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino from 'pino';
import {persist} from 'mobx-persist';

const log = pino().child({module: 'HistoryStore'});

export class HistoryStore {
  // --- List History State ---
  listHistoryLoading = false;
  listHistoryError = null;
  listHistoryData = null;
  lisHistoryPages = 1;
  allPages = 1;
  // --- Detail History State ---
  detailHistoryLoading = false;
  detailHistoryError = null;
  detailHistoryData = null;
  detailHistoryId = null;

  // --- Set Rating History State ---
  setRatingLoading = false;
  setRatingError = null;
  setRatingData = null;
  merchantID = null;
  transactionID = null;
  ratingParam = null;
  driverID = null;
  DriverRatingLoading = false;
  DriverRatingData = null;
  DriverRatingError = null;

  ReOrderLoading = false;
  ReOrderData = null;
  ReOrderError = null;

  constructor() {
    makeAutoObservable(this);
  }

  // --- Get History List ---
  async getHistoryList() {
    this.listHistoryLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.get(
        ApiClient.apiGetListHistory(USER_ID, this.lisHistoryPages),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      // console.log('response=>>', response);
      if (response.data.code === 200) {
        log.info('GET HISTORY LIST SUCCESS', response.data.data);
        this.getHistoryListSuccess(response.data.data?.list);
        this.SetAllPage(response.data.data.allPage);
      } else if (response.data.code === 201) {
        log.info('GET HISTORY LIST SUCCESS', response.data.data);
        this.getHistoryListSuccess(null);
      } else {
        log.error('GET HISTORY LIST FAILED', response.data);
        this.getHistoryListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET HISTORY LIST', error);
      this.getHistoryListFailed(error);
    } finally {
      this.listHistoryLoading = false;
    }
  }

  getHistoryListSuccess(data) {
    if (
      this.listHistoryData &&
      this.listHistoryData.length > 0 &&
      this.lisHistoryPages > 1
    ) {
      const NewData = [...this.listHistoryData, ...data];
      const sortingData = NewData.sort((a, b) => {
        return a.transcations?.update_at - b.transactions?.update_at;
      });
      this.listHistoryData = sortingData;
    } else {
      this.listHistoryData = data;
    }

    this.lisHistoryPages = this.lisHistoryPages + 1;
  }

  SetAllPage(data) {
    this.allPages = data;
  }

  setPageHistory(data) {
    this.lisHistoryPages = data;
  }

  getHistoryListFailed(data) {
    this.listHistoryError = data;
  }
  // --- end of Get History List ---

  // --- Get History Detail ---
  async getHistoryDetail() {
    this.detailHistoryLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      // const USER_ID = '0aeea7a1-b567-4902-b875-cac1fe532a84';
      // const TOKEN =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ1Mjk3MjIsImV4cCI6MTcwNjA4NzMyMn0.jd3G6pp_tnvBP-60hy-tzzsY8RgTfEWqaE0yRjdiPsI';

      const response = await axios.get(
        ApiClient.apiGetHistoryDetail(USER_ID, this.detailHistoryId),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET HISTORY DETAIL SUCCESS', response.data.data);
        this.getHistoryDetailSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET HISTORY DETAIL SUCCESS', response.data.data);
        this.getHistoryDetailSuccess(null);
      } else {
        log.error('GET HISTORY DETAIL FAILED', response.data);
        this.getHistoryDetailFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET HISTORY DETAIL', error);
      this.getHistoryDetailFailed(error);
    } finally {
      this.detailHistoryLoading = false;
    }
  }

  getHistoryDetailSuccess(data) {
    this.detailHistoryData = data;
  }
  setHistoryDetailTransactionId(id) {
    this.detailHistoryId = id;
  }
  getHistoryDetailFailed(data) {
    this.detailHistoryData = data;
  }
  setDriverId(id) {
    console.log('IDDRIVER', id);
    this.driverID = id;
  }
  // --- end of Get History List ---

  // --- Set Rating History ---
  async setRatingHistory() {
    this.setRatingLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.post(
        ApiClient.apiPostRating(),
        {
          users_id: USER_ID,
          ratings: {
            merchants_id: this.merchantID,
            transactions_id: this.transactionID,
            ratings: this.ratingParam?.rating,
            notes: this.ratingParam?.myReview,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('SET RATING SUCCESS', response.data.data);
        this.setRatingSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('SET RATING SUCCESS', response.data.data);
        this.setRatingSuccess(null);
      } else {
        log.error('SET RATING FAILED', response.data);
        this.setRatingFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR SET RATING', error);
      this.setRatingFailed(error);
    } finally {
      this.setRatingLoading = false;
    }
  }

  setMerchantId(data) {
    this.merchantID = data;
  }
  setTransactionID(data) {
    this.transactionID = data;
  }

  setRatingParam(data) {
    this.ratingParam = data;
  }

  setRatingSuccess(data) {
    // this.getHistoryList();
    this.setRatingData = data;
  }

  setRatingFailed(data) {
    this.setRatingError = data;
  }

  // --- Set Rating History Driver ---
  async setRatingDriver() {
    this.driverRatingLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const datas = {
        users_id: USER_ID,
        ratings: {
          drivers_id: this.driverID,
          transactions_id: this.transactionID,
          ratings: this.ratingParam?.rating,
          notes: this.ratingParam?.myReview,
        },
      };
      console.log('DRIVER RATING DATA', datas);

      const response = await axios.post(
        ApiClient.apiPostRatingDriver(),
        {
          users_id: USER_ID,
          ratings: {
            drivers_id: this.driverID,
            transactions_id: this.transactionID,
            ratings: this.ratingParam?.rating,
            notes: this.ratingParam?.myReview,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('SET RATING DRIVER SUCCESS', response.data.data);
        this.setRatingDriverSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('SET RATING DRIVER SUCCESS', response.data.data);
        this.setRatingDriverSuccess(response.data);
      } else {
        log.error('SET RATING DRIVER FAILED', response.data);
        this.setRatingDriverFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR SET RATING', error);
      this.setRatingDriverFailed(error);
    } finally {
      this.driverRatingLoading = false;
    }
  }

  setRatingDriverSuccess(data) {
    this.driverRatingData = data;
    this.getHistoryLists();
  }

  setRatingDriverFailed(data) {
    this.driverRatingError = data;
  }
  // --- end of Driver Ratings ---

  // --- Post ReOrder ---
  async postReOrder() {
    this.ReOrderLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.get(
        ApiClinetOrder.apiReorder(USER_ID, this.transactionID),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('REORDER SUCCESS', response.data.data);
        this.ReOrderSuccess(true);
      } else if (response.data.code === 201) {
        log.info('REORDER SUCCESS', response.data.data);
        this.ReOrderSuccess(null);
      } else {
        log.error('REORDER FAILED', response.data);
        this.ReOrderFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR REORDER', error);
      this.ReOrderFailed(error);
    } finally {
      this.ReOrderLoading = false;
    }
  }

  ReOrderSuccess(data) {
    this.ReOrderData = data;
  }

  ReOrderFailed(data) {
    this.ReOrderError = data;
  }
  // --- Clear Store ---

  clearHistoryStore() {
    this.listHistoryLoading = false;
    this.listHistoryError = null;
    this.listHistoryData = null;

    this.detailHistoryLoading = false;
    this.detailHistoryError = null;
    this.detailHistoryData = null;
    this.detailHistoryId = null;

    this.setRatingLoading = false;
    this.setRatingError = null;
    this.setRatingData = null;
    this.merchantID = null;
    this.transactionID = null;
    this.ratingParam = null;

    this.driverRatingLoading = false;
    this.driverRatingData = null;
    this.driverRatingError = null;
    this.driverID = null;

    this.ReOrderLoading = false;
    this.ReOrderData = null;
    this.ReOrderError = null;
    this.lisHistoryPages = 1;
    this.allPages = 1;
  }
}
