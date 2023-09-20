// create mobx store
import axios from 'axios';
import {makeAutoObservable, observable} from 'mobx';
import ApiClient from './Pickyuq.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino, {P} from 'pino';
import {persist} from 'mobx-persist';

const log = pino().child({module: 'PickyuqStore'});

export class PickyuqStore {
  //PickYuq
  pickupLocation = null;
  destinationLocation = null;
  destinationLocationSaved = null;

  preCheckoutData = null;
  preCheckoutError = null;
  preCheckoutLoading = false;

  CheckoutData = null;
  CheckoutError = null;
  CheckoutLoading = false;

  DriverRating = null;
  DriverRatingError = null;
  DriverRatingLoading = false;

  DriverTip = null;
  DriverTipError = null;
  DriverTipLoading = false;

  CancelPickyuq = null;
  CancelPickyuqError = null;
  CancelPickyuqLoading = false;

  RatingDriver = null;
  TipDriver = null;

  orderPickyuData = null;
  OrderPickyuError = null;
  orderPickyuqLoading = false;

  myPaymentMethod = null;
  constructor() {
    makeAutoObservable(this);
  }

  // Set PickUp Location
  setPickUpLocationAddress(long, lat, address, header) {
    this.pickupLocation = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address?.slice(0, address.indexOf(',')),
    };
  }

  // Set Destination Location
  setDestinationLocationAddress(long, lat, address, header) {
    this.destinationLocation = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address?.slice(0, address.indexOf(',')),
    };
  }

  setDestinationLocationSaved(long, lat, address, header) {
    this.destinationLocationSaved = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address?.slice(0, address.indexOf(',')),
    };
  }

  // --- Get getPreCheckout ---
  async getPreCheckout() {
    this.preCheckoutLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.post(
        ApiClient.apiPreCheckout(),
        {
          users_id: USER_ID,
          pickup: {
            long: this.pickupLocation?.lng,
            lat: this.pickupLocation?.lat,
            address: this.pickupLocation?.address,
          },
          drop: {
            long: this.destinationLocation?.lng,
            lat: this.destinationLocation?.lat,
            address: this.destinationLocation?.address,
          },
          // options: 2,
          // type: 2,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET Pre Order SUCCESS', response.data.data);
        this.getPreCheckoutSuccess(response.data.data?.list);
      } else if (response.data.code === 201) {
        log.info('GET  Pre Order SUCCESS', response.data.data);
        this.getPreCheckoutSuccess(null);
      } else {
        log.error('GET  Pre Order FAILED', response.data);
        this.getPreCheckoutFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR Pre Order LIST', error);
      this.getPreCheckoutFailed(error);
    } finally {
      this.preCheckoutLoading = false;
    }
  }

  getPreCheckoutSuccess(data) {
    this.preCheckoutData = data;
  }

  getPreCheckoutFailed(data) {
    this.preCheckoutError = data;
  }

  async getCheckout(options, type) {
    this.CheckoutLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.post(
        ApiClient.apiCheckout(),
        {
          users_id: USER_ID,
          pickup: {
            long: this.pickupLocation?.lng,
            lat: this.pickupLocation?.lat,
            address: this.pickupLocation?.address,
          },
          drop: {
            long: this.destinationLocation?.lng,
            lat: this.destinationLocation?.lat,
            address: this.destinationLocation?.address,
          },
          options: options,
          type: type,
          payment_type: this.myPaymentMethod?.id,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('GET Checkout SUCCESS', response.data.data);
        this.getCheckoutSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET  Checkout SUCCESS', response.data.data);
        this.getCheckoutSuccess(null);
      } else {
        log.error('GET  Checkout FAILED', response.data);
        this.getCheckoutFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR Checkout LIST', error);
      this.getCheckoutFailed(error);
    } finally {
      this.CheckoutLoading = false;
    }
  }

  getCheckoutSuccess(data) {
    this.CheckoutData = data;
  }

  getCheckoutFailed(data) {
    this.CheckoutError = data;
  }

  saveDataRating(RatingDriver, TipDriver) {
    this.RatingDriver = RatingDriver;
    this.TipDriver = TipDriver;
  }

  async postDriverRatings() {
    this.DriverRatingLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const body = {
        users_id: USER_ID,
        ratings: {
          drivers_id: this.RatingDriver.drivers_id,
          transactions_id: this.RatingDriver?.transactions_id,
          ratings: Number(this.RatingDriver?.rating),
          notes: this.RatingDriver?.notes,
        },
      };
      console.log('dataRATINGDRIVER', body);

      const response = await axios.post(ApiClient.apiRatingDriver(), body, {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });

      if (response.data.code === 200) {
        log.info('GET DriverRating SUCCESS', response.data.data);
        this.getDriverRatingSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET  DriverRating SUCCESS', response.data.data);
        this.getDriverRatingSuccess(null);
      } else {
        log.error('GET  DriverRating FAILED', response.data);
        this.getDriverRatingFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR DriverRating LIST', error);
      this.getDriverRatingFailed(error);
    } finally {
      this.DriverRatingLoading = false;
    }
  }

  getDriverRatingSuccess(data) {
    this.DriverRating = data;
  }

  getDriverRatingFailed(data) {
    this.DriverRatingError = data;
  }

  async postDriverTip() {
    this.DriverTipLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const body = {
        users_id: USER_ID,
        drivers_id: this.TipDriver?.drivers_id,
        transactions_id: this.TipDriver?.transactions_id,
        amount: this.TipDriver?.Tip?.value,
      };
      console.log('dataTIP', body);
      const response = await axios.post(ApiClient.apiDriverTip(), body, {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });

      if (response.data.code === 200) {
        log.info('GET DriverTIP SUCCESS', response.data.data);
        this.getDriverTipSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET  DriverTIP SUCCESS', response.data.data);
        this.getDriverTipSuccess(null);
      } else {
        log.error('GET  DriverTIP FAILED', response.data);
        this.getDriverTipFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR DriverTIP LIST', error);
      this.getDriverTipFailed(error);
    } finally {
      this.DriverTipLoading = false;
    }
  }

  getDriverTipSuccess(data) {
    this.DriverTip = data;
  }

  getDriverRatingFailed(data) {
    this.DriverTipError = data;
  }

  async cancelPickyuq(transactionID) {
    this.CancelPickyuqLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      console.log('transactionID', transactionID);
      const response = await axios.post(
        ApiClient.apiCancelPickyuq(),
        {
          users_id: USER_ID,
          transactions_id: transactionID,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );

      if (response.data.code === 200) {
        log.info('CANCEL PICKYUQ SUCCESS', response.data.data);
        this.cancelPickyuqSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('CANCEL PICKYUQ SUCCESS', response.data.data);
        this.cancelPickyuqSuccess(null);
      } else {
        log.error('CANCEL PICKYUQ FAILED', response.data);
        this.cancelPickyuqFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR CANCEL PICKYUQ', error);
      this.cancelPickyuqFailed(error);
    } finally {
      this.CancelPickyuqLoading = false;
    }
  }

  cancelPickyuqSuccess(data) {
    this.CancelPickyuq = data;
  }

  cancelPickyuqFailed(data) {
    this.CancelPickyuqError = data;
  }

  // --- Get Order Pickyuq ---
  async getOrderPickyuq() {
    this.orderPickyuqLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const response = await axios.post(
        ApiClient.apiGetOrderPickyuq(),
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
        log.info('GET Order Pickyuq SUCCESS', response.data.data);
        this.getOrderPickyuqSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET Order Pickyuq SUCCESS', response.data.data);
        this.getOrderPickyuqSuccess(null);
      } else {
        log.error('GET Order Pickyuq FAILED', response.data);
        this.getOrderPickyuqFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR Order Pickyuq', error);
      this.getOrderPickyuqFailed(error);
    } finally {
      this.orderPickyuqLoading = false;
    }
  }

  getOrderPickyuqSuccess(data) {
    this.OrderPickyuData = data;
  }

  getOrderPickyuqFailed(data) {
    this.OrderPickyuError = data;
  }

  setPaymenMethod(type) {
    this.myPaymentMethod = type;
  }

  // --- Clear Store ---

  clearPickyuqStore() {
    this.pickupLocation = null;
    this.destinationLocation = null;
    this.preCheckoutData = null;
    this.preCheckoutError = null;
    this.preCheckoutLoading = false;
    this.CheckoutData = null;
    this.CheckoutError = null;
    this.CheckoutLoading = false;
    this.DriverRating = null;
    this.DriverRatingError = null;
    this.DriverRatingLoading = false;
    this.DriverTip = null;
    this.DriverTipError = null;
    this.DriverTipLoading = false;

    this.CancelPickyuq = null;
    this.CancelPickyuqError = null;
    this.CancelPickyuqLoading = false;

    this.RatingDriver = null;
    this.TipDriver = null;

    this.OrderPickyuData = null;
    this.OrderPickyuError = null;
    this.orderPickyuqLoading = false;
    this.myPaymentMethod = null;
  }
}
