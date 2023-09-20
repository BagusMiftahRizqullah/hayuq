// create mobx store
import axios from 'axios';
import {makeAutoObservable, observable} from 'mobx';
import ApiClient from './Order.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino, {P} from 'pino';
import {persist} from 'mobx-persist';

const log = pino().child({module: 'OrderStore'});

export class OrderStore {
  // --- List Order State ---
  listOrderLoading = false;
  listOrderError = null;
  listOrderData = null;
  lisOrderPages = 1;
  allPages = 1;

  // --- Chat Order State ---
  listChatData = null;
  receiverOn = false;
  constructor() {
    makeAutoObservable(this);
  }

  // --- Get Order List ---
  async getOrderList() {
    this.listOrderLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.get(
        ApiClient.apiGetListOrder(USER_ID, this.lisOrderPages),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET ORDER LIST SUCCESS', response.data.data);
        this.getOrderListSuccess(response.data.data?.list);
        this.SetAllPage(response.data.data.allPage);
      } else if (response.data.code === 201) {
        log.info('GET ORDER LIST SUCCESS', response.data.data);
        log.info('GET ORDER LIST PAGE', this.lisOrderPages);
        this.getOrderListSuccess(null);
      } else {
        log.error('GET ORDER LIST FAILED', response.data);
        this.getOrderListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET ORDER LIST', error);
      this.getOrderListFailed(error);
    } finally {
      this.listOrderLoading = false;
    }
  }

  SetAllPage(data) {
    this.allPages = data;
  }

  getOrderListSuccess(data) {
    const fillData = data;
    console.log('DATAORDER', fillData);

    if (
      this.listOrderData &&
      this.listOrderData.length > 0 &&
      this.lisOrderPages > 1
    ) {
      const NewData = [...this.listOrderData, ...fillData];
      const sortingData = NewData.sort((a, b) => {
        return a.transcations?.update_at - b.transactions?.update_at;
      });
      this.listOrderData = sortingData;
    } else {
      this.listOrderData = fillData;
    }
    this.lisOrderPages = this.lisOrderPages + 1;
  }

  setPageOrder(data) {
    this.lisOrderPages = data;
  }

  getOrderListFailed(data) {
    this.listOrderError = data;
  }
  // --- end of Get Order List ---

  // --- Set Chat Listed ---
  setReceiverOn(status) {
    this.receiverOn = status;
  }
  setListChat(data, All_list) {
    console.log('datassnyaCHAT', data);
    console.log('datassnyaCHAT2', All_list);
    // this.listChatData = data;
    if (All_list) {
      this.listChatData = data;
    } else {
      if (this.listChatData && this.listChatData.length > 0) {
        this.listChatData = [...this.listChatData, data];
      } else {
        this.listChatData = [data];
      }
    }
  }

  // --- Clear Store ---

  clearOrderStore() {
    this.listOrderLoading = false;
    this.listOrderError = null;
    this.listOrderData = null;
    this.listChatData = null;
    this.receiverOn = false;
    this.lisOrderPages = 1;
    this.allPages = 1;
  }
}
