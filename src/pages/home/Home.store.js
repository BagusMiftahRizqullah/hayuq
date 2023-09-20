// create mobx store
import axios from 'axios';
import {makeAutoObservable, observable} from 'mobx';
import ApiClient from './Home.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pino from 'pino';
import {persist} from 'mobx-persist';

const log = pino().child({module: 'HomeStore'});

export class HomeStore {
  // --- Routing State ---
  routerFilterTitle = '';
  routerFilterType = '';
  // --- Filter State ---
  payuqHistoryFilterDate = null;
  payuqHistoryFilterService = null;
  // --- Location State ---
  currentLocationAddress: any = {
    lat: 0,
    lng: 0,
    address: '',
    header: '',
  };
  currentDeliveryAddress: any = {
    lat: 0,
    lng: 0,
    address: '',
    header: '',
  };
  tempDeliveryAddress: any = {
    lat: 0,
    lng: 0,
    address: '',
    header: '',
  };
  @persist('list') @observable freqUsedAddress: any = [];
  // --- Account Detail State ---
  accountDetailLoading = false;
  accountDetailError = null;
  @persist('object') @observable accountDetailData = null;
  // --- Verify Email State ---
  verifyEmailLoading = false;
  verifyEmailError = null;
  verifyEmailData = null;
  // --- Address List State ---
  addressListLoading = false;
  addressListError = null;
  addressListData = null;
  // --- Create Address State ---
  createAddressLoading = false;
  createAddressError = null;
  createAddressData = null;
  // --- Update Account State ---
  updateAccountLoading = false;
  updateAccountError = null;
  updateAccountData = null;
  // --- Update Address State ---
  updateAddressLoading = false;
  updateAddressError = null;
  updateAddressData = null;
  // --- Delete Address State ---
  deleteAddressLoading = false;
  deleteAddressError = null;
  deleteAddressData = null;
  // --- List Explore State ---
  listExploreLoading = false;
  listExploreError = null;
  listExploreData = null;
  // --- Merchant Detail State ---
  merchantDetailId = null;
  merchantDetailLoading = false;
  merchantDetailError = null;
  merchantDetailData = null;
  // --- Main Recomended State ---
  mainRecomendedLoading = false;
  mainRecomendedError = null;
  mainRecomendedData = null;
  // --- Main Voucher State ---
  mainVoucherLoading = false;
  mainVoucherError = null;
  mainVoucherData = null;
  // --- Main Reorder State ---
  mainReorderLoading = false;
  mainReorderError = null;
  mainReorderData = null;
  // --- Main Liked State ---
  mainLikedLoading = false;
  mainLikedError = null;
  mainLikedData = null;
  // --- Main Popular State ---
  mainPopularLoading = false;
  mainPopularError = null;
  mainPopularData = null;
  // --- Main Rated State ---
  mainRatedLoading = false;
  mainRatedError = null;
  mainRatedData = null;
  // --- Search State ---
  searchLoading = false;
  searchError = null;
  searchData = null;
  recentSearch = null;
  // --- List History State ---
  listHistoryLoading = false;
  listHistoryError = null;
  listHistoryData = null;
  apiPostCreateOrder;
  lisHistoryPages = 1;
  // Product Detail
  productDetailData = null;
  productDetailLoading = false;
  productDetailError = null;
  // Cart
  cartListData = null;
  currentCartVariant = null;
  cartListLoading = false;
  cartListError = null;
  createCartLoading = false;
  createCartError = null;
  createCartResponse = null;
  updateCartData = null;
  updateCartLoading = false;
  updateCartError = null;
  // Order Checkout Detail
  orderCheckoutDetailLoading = false;
  orderCheckoutDetailError = null;
  orderCheckoutDetailData = null;
  // Create Order
  createOrderLoading = false;
  createOrderError = null;
  createOrderResponse = null;
  // Favorite
  getListFavoriteLoading = false;
  getListFavoriteError = null;
  getListFavoriteData = null;
  createFavoriteLoading = false;
  createFavoriteError = null;
  createFavoriteResponse = null;
  createFavoriteDetailLoading = false;
  createFavoriteDetailError = null;
  createFavoriteDetailResponse = null;
  currentFavoriteDetailData = null;
  // Most Like
  listExploreLikeData = null;
  listExploreLikeError = null;
  listExploreLikeLoading = false;
  // promo
  listExplorePromoData = null;
  listExplorePromoError = null;
  listExplorePromoLoading = false;
  //Populars
  listExplorePopularsData = null;
  listExplorePopularsError = null;
  listExplorePopularsLoading = false;
  //Hayuqers
  listExploreHayuqersData = null;
  listExploreHayuqersError = null;
  listExploreHayuqersLoading = false;
  // Cart List Product
  listCartProductData = null;
  listCartProductDataLoading = false;
  listCartProductDataError = null;
  //Id_Varians
  idVrians = null;
  // Check Distance Merchant and User
  distanceCheckData = null;
  distanceCheckLoading = false;
  distanceCheckError = null;
  //Note Driver on Checkout
  noteDrivers = null;
  //PaymentType
  PaymentType = null;
  //rEOrder
  listExploreReorderData = null;
  listExploreReordersError = null;
  listExploreReorderLoading = false;
  //Cousines
  listCousinesData = null;
  listCousinessError = null;
  listCousinesLoading = false;
  //TopUp
  topUpDanaLoading = false;
  topUpDanaData = null;
  topUpDanaError = null;
  // OrderStatus
  @persist @observable orderStatus = null;
  @persist('list') @observable currentListOrderData = [];
  @persist @observable notifyStatus = false;
  // verify email
  verifyEmailOtpResponse = null;
  verifyEmailOtpError = null;
  verifyEmailOtpLoading = false;
  // Delete Favorite
  deleteFavoriteResponse = null;
  deleteFavoriteError = null;
  deleteFavoriteLoading = false;

  // Cart List History TopUp
  listHistoryTopUpData = null;
  listHistoryTopUpDataLoading = false;
  listHistoryTopUpDataError = null;

  // Banner
  bannerDataPotrait = null;
  bannerDataLandscape = null;
  bannerDataError = null;
  bannerDataLoading = false;

  // Create Voucher
  createVoucherLoading = false;
  createVoucherError = null;
  createVoucherData = null;

  // Delete Voucher
  deleteVoucherResponse = null;
  deleteVoucherError = null;
  deleteVoucherLoading = false;

  // download receipt
  downloadReceiptLoading = false;
  downloadReceiptError = null;
  downloadReceiptData = null;

  constructor() {
    makeAutoObservable(this);
  }

  // --- Action ---

  setNotifyStatus(data) {
    this.notifyStatus = data;
  }

  setCurrentFavoriteDetailData(data) {
    this.currentFavoriteDetailData = data;
  }

  setCurrentListOrderData(data) {
    let dataCurrent = this.currentListOrderData;
    let index = dataCurrent.findIndex(
      (x) => x.transaction_id == data.transaction_id,
    );
    if (index > -1) {
      dataCurrent[index] = data;
    } else {
      dataCurrent.push(data);
    }
  }

  setOrderStatus(data) {
    this.orderStatus = data;
  }

  setCurrentCartVariant(data) {
    console.log('current varian', data);
    this.currentCartVariant = data;
  }

  setOrderPaymentType(data) {
    this.PaymentType = data;
  }

  async dellartListProducts(id_product) {
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      console.log('Go Delleted', id_product, USER_ID);
      const response = await axios.post(
        ApiClient.apiDeleteCartListProducts(),
        {
          users_id: USER_ID,
          carts: {
            _id: id_product,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      console.log('responseDELL', response);
      if (response.data.code === 200) {
        log.info('Dell Current Varian Products SUCCESS', response.data.data);
        // this.getAccountDetailSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR Dell Current Varian Products', error);
      // this.getAccountDetailFailed(error);
    } finally {
    }
  }

  setProductDetail(data) {
    this.productDetailData = data;
  }

  setCurrentDeliveryAddress(long, lat, address, header?: string) {
    this.currentDeliveryAddress = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address.substring(0, address.indexOf(',')),
    };
  }

  setCurrentLocationAddress(long, lat, address, header?: string) {
    this.currentLocationAddress = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address.substring(0, address.indexOf(',')),
    };
    if (this.currentDeliveryAddress.address == '') {
      this.currentDeliveryAddress = {
        lat: lat,
        lng: long,
        address: address,
        header: header ? header : address.substring(0, address.indexOf(',')),
      };
    }
  }

  setTempAddress(long, lat, address, header?: string) {
    this.tempDeliveryAddress = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address.substring(0, address.indexOf(',')),
    };
  }

  getAddress(long, lat, address, header?: string) {
    this.currentDeliveryAddress = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address.substring(0, address.indexOf(',')),
    };
  }

  setRouterFilter(filter, type) {
    this.routerFilterTitle = filter;
    this.routerFilterType = type;
  }

  setPayuqHistoryFilterDate(date) {
    this.payuqHistoryFilterDate = date;
  }

  setPayuqHistoryFilterService(service) {
    this.payuqHistoryFilterService = service;
  }

  clearTempAddress() {
    this.tempDeliveryAddress = {
      lat: 0,
      lng: 0,
      address: '',
    };
  }

  setFreqUsedAddress(address) {
    if (this.freqUsedAddress?.length > 0) {
      // check if lat or lng already exist return null then if not exist push to array
      const checkAddress = this.freqUsedAddress.find(
        (item) => item.address === address.address,
      );
      if (checkAddress) {
        log.info('ADDRESS ALREADY EXIST', address);
        return;
      } else {
        log.info('ADDRESS SAVE FREQ USED', address);
        if (this.freqUsedAddress?.length > 4) {
          this.freqUsedAddress.pop();
        }
        this.freqUsedAddress = [address, ...this.freqUsedAddress];
      }
    } else {
      this.freqUsedAddress = [address];
    }
  }

  setRecentSearch(search) {
    if (this.recentSearch === null) {
      this.recentSearch = [search];
    } else if (this.recentSearch?.length > 0) {
      const checkSearch = this.recentSearch.find((item) => item === search);
      if (checkSearch) {
        log.info('SEARCH ALREADY EXIST', search);
        return;
      } else {
        log.info('SEARCH SAVE RECENT SEARCH', search);
        if (this.recentSearch?.length > 4) {
          this.recentSearch.pop();
        }
        this.recentSearch = [search, ...this.recentSearch];
      }
    }
  }
  // --- end of Action ---

  // --- Get Account Detail ---

  async getAccountDetail() {
    this.accountDetailLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetAccountDetail(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET ACCOUNT DETAIL SUCCESS', response.data.data);
        this.getAccountDetailSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET ACCOUNT DETAIL', error);
      this.getAccountDetailFailed(error);
    } finally {
      this.accountDetailLoading = false;
    }
  }

  getAccountDetailSuccess(data) {
    this.accountDetailData = data;
  }

  getAccountDetailFailed(data) {
    this.accountDetailError = data;
  }

  // --- end of Get Account Detail ---
  // --- Request Verify Email ---
  async requestVerifyEmail(email) {
    this.verifyEmailLoading = true;
    try {
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiPostRequestVerifyEmail(),
        {
          email: email,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('REQ VERIFY EMAIL SUCCESS', response.data.data);
        this.requestVerifyEmailSuccess(response.data.data);
      } else {
        log.error('REQ VERIFY EMAIL FAILED', response.data);
        this.requestVerifyEmailFailed(response.data.data.message);
      }
    } catch (error) {
      log.error('ERROR REQ VERIFY EMAIL', error);
      this.requestVerifyEmailFailed(error);
    } finally {
      this.verifyEmailLoading = false;
    }
  }

  requestVerifyEmailSuccess(data) {
    this.verifyEmailData = data;
  }

  requestVerifyEmailFailed(data) {
    this.verifyEmailError = data;
  }

  // --- end of Request Verify Email ---
  // --- Get Address List ---
  async getAddressList() {
    this.addressListLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetAddressList(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET ADDRESS LIST SUCCESS', response.data.data);
        this.getAddressListSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET ADDRESS LIST SUCCESS', response.data.data);
        this.getAddressListSuccess(null);
      } else {
        log.error('GET ADDRESS LIST FAILED', response.data);
        this.getAddressListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET ADDRESS LIST', error);
      this.getAddressListFailed(error);
    } finally {
      this.addressListLoading = false;
    }
  }

  getAddressListSuccess(data) {
    this.addressListData = data;
  }

  getAddressListFailed(data) {
    this.addressListError = data;
  }
  // --- end of Get Address List ---
  // --- Create Address ---
  async createAddress(formAddress) {
    this.createAddressLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const data = {
        users_id: USER_ID,
        usersaddress: {
          type: formAddress.type,
          title: formAddress.title,
          address: formAddress.address,
          notes: formAddress.notes,
          lat: formAddress.lat,
          long: formAddress.lng,
          name: formAddress.contactName,
          phone: formAddress.contactPhone,
        },
      };
      const response = await axios.post(
        ApiClient.apiPostCreateAddress(),
        data,
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('CREATE ADDRESS SUCCESS', response.data.data);
        this.createAddressSuccess(response.data.data);
      } else {
        log.error('CREATE ADDRESS FAILED', response.data);
        this.createAddressFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR CREATE ADDRESS', error);
      this.createAddressFailed(error);
    } finally {
      this.createAddressLoading = false;
    }
  }

  createAddressSuccess(data) {
    this.createAddressData = data;
    this.getAddressList();
  }

  createAddressFailed(data) {
    this.createAddressError = data;
  }

  clearCreateAddress() {
    this.createAddressData = null;
    this.createAddressError = null;
    this.createAddressLoading = false;
  }

  // --- end of Create Address ---
  // --- Update Account ---
  async updateAccount(formAccount) {
    log.info('UPDATE ACCOUNT', formAccount);
    this.updateAccountLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const data = {
        users_id: USER_ID,
        users: formAccount,
      };
      const response = await axios.post(
        ApiClient.apiPostUpdateAccount(),
        data,
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('UPDATE ACCOUNT SUCCESS', response.data.data);
        this.updateAccountSuccess(response.data.data);
      } else {
        log.error('UPDATE ACCOUNT FAILED', response.data);
        this.updateAccountFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR UPDATE ACCOUNT', error);
      this.updateAccountFailed(error);
    } finally {
      this.updateAccountLoading = false;
    }
  }

  updateAccountSuccess = (data) => {
    this.updateAccountData = data;
    this.getAccountDetail();
  };

  updateAccountFailed = (data) => {
    this.updateAccountError = data;
  };

  // --- end of Update Account ---
  // --- Update Address ---
  async updateAddress(formAddress) {
    this.updateAddressLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const data = {
        users_id: USER_ID,
        usersaddress: {
          id: formAddress.id,
          type: formAddress.type,
          title: formAddress.title,
          address: formAddress.address,
          notes: formAddress.notes,
          lat: formAddress.lat,
          long: formAddress.lng,
          name: formAddress.contactName,
          phone: formAddress.contactPhone,
        },
      };
      const response = await axios.post(
        ApiClient.apiPostUpdateAddress(),
        data,
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('UPDATE ADDRESS SUCCESS', response.data.data);
        this.updateAddressSuccess(response.data.data);
      } else {
        log.error('UPDATE ADDRESS FAILED', response.data);
        this.updateAddressFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR UPDATE ADDRESS', error);
      this.updateAddressFailed(error);
    } finally {
      this.updateAddressLoading = false;
    }
  }

  updateAddressSuccess = (data) => {
    this.updateAddressData = data;
    this.getAddressList();
  };

  updateAddressFailed = (data) => {
    this.updateAddressError = data;
  };
  // --- end of Update Address ---
  // --- Delete Address ---
  async deleteAddress(formDelete) {
    this.deleteAddressLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const data = {
        users_id: USER_ID,
        usersaddress: {
          id: formDelete.id,
          type: formDelete.type,
        },
      };
      const response = await axios.post(
        ApiClient.apiPostDeleteAddress(),
        data,
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('DELETE ADDRESS SUCCESS', response.data.data);
        this.deleteAddressSuccess(response.data.data);
      } else {
        log.error('DELETE ADDRESS FAILED', response.data);
        this.deleteAddressFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR DELETE ADDRESS', error);
      this.deleteAddressFailed(error);
    } finally {
      this.deleteAddressLoading = false;
    }
  }

  deleteAddressSuccess = (data) => {
    this.deleteAddressData = data;
    this.getAddressList();
  };

  deleteAddressFailed = (data) => {
    this.deleteAddressError = data;
  };
  // --- end of Delete Address ---

  // --- Explore List ---
  async getExploreList(type, options = null) {
    this.listExploreLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    // const TOKEN = await AsyncStorage.getItem('TOKEN');
    // const datasss = {
    //   USER_ID,
    //   lat: this.currentDeliveryAddress.lat,
    //   lng: this.currentDeliveryAddress.lng,
    //   type,
    //   options,
    // };
    // console.log('dataEXPLORELIST2', datasss);
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
          options,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST SUCCESS', response.data.data);
        this.getExploreListSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST FAILED', response.data);
        this.getExploreListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE LIST', error);
      this.getExploreListFailed(error);
    } finally {
      this.listExploreLoading = false;
    }
  }

  async getExploreListCousines(type, options = null) {
    this.listExploreLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    // const TOKEN = await AsyncStorage.getItem('TOKEN');
    console.log('statusdataa=>>', options);
    try {
      const response = await axios.get(
        ApiClient.apiGetListExploreCousines(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
          options,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST SUCCESS', response.data.data);
        this.getExploreListSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST FAILED', response);
        this.getExploreListFailed(response);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE LIST', error);
      this.getExploreListFailed(error);
    } finally {
      this.listExploreLoading = false;
    }
  }

  getExploreListSuccess = (data, type) => {
    this.listExploreData = data;
    switch (type) {
      case 10:
        this.mainRecomendedData = data;
        break;
      default:
        break;
    }
  };

  getExploreListFailed = (data) => {
    this.listExploreData = null;
    this.listExploreError = data;
  };

  // --- end of Explore List ---
  // --- Merchant Detail ---
  setMerchantDetailId = (id) => {
    this.merchantDetailId = id;
  };

  async getMerchantDetail(id) {
    this.merchantDetailLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetMerchantDetail(
          USER_ID,
          id,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
        ),
        {
          // headers: {
          //   Authorization: `${TOKEN}`,
          // },
        },
      );
      if (response.data.code === 200) {
        log.info('GET MERCHANT DETAIL SUCCESS', response.data.data);
        this.getMerchantDetailSuccess(response.data.data);
      } else {
        log.error('GET MERCHANT DETAIL FAILED', response.data);
        this.getMerchantDetailFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET MERCHANT DETAIL', error);
      this.getMerchantDetailFailed(error);
    } finally {
      this.merchantDetailLoading = false;
    }
  }

  clearMerchantDetailData = () => {
    this.merchantDetailData = null;
  };

  getMerchantDetailSuccess = (data) => {
    this.merchantDetailData = data;
  };

  getMerchantDetailFailed = (data) => {
    this.merchantDetailError = data;
  };

  // --- end of Merchant Detail ---

  // --- Search List ---
  async getSearchList(data) {
    this.searchLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    console.log(
      'data',
      USER_ID,
      data.search,
      this.currentDeliveryAddress.lat,
      this.currentDeliveryAddress.lng,
      data.status,
    );
    try {
      const response = await axios.get(
        ApiClient.apiGetSearch(
          USER_ID,
          data.search,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          data.status,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET SEARCH LIST SUCCESS', response.data.data);
        this.getSearchListSuccess(response.data.data);
      } else {
        log.error('GET SEARCH LIST FAILED', response.data);
        this.getSearchListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET SEARCH LIST', error);
      this.getSearchListFailed(error);
    } finally {
      this.searchLoading = false;
    }
  }

  getSearchListSuccess = (data) => {
    this.searchData = data;
  };

  getSearchListFailed = (data) => {
    this.searchError = data;
    this.searchData = null;
  };
  // --- end of Search List ---

  // --- Get History List ---
  async getHistoryList() {
    this.listHistoryLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      // const USER_ID = '0aeea7a1-b567-4902-b875-cac1fe532a84';
      // const TOKEN =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ1Mjk3MjIsImV4cCI6MTcwNjA4NzMyMn0.jd3G6pp_tnvBP-60hy-tzzsY8RgTfEWqaE0yRjdiPsI';
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
        this.getHistoryListSuccess(response.data.data);
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
    const newData = data.filter((a) => a.transactions?.status !== 6);
    if (this.listHistoryData && this.listHistoryData.length > 0) {
      const NewData = [...this.listHistoryData, ...newData];
      const sortingData = NewData.sort((a, b) => {
        return a.transcations?.update_at - b.transactions?.update_at;
      });
      this.listHistoryData = sortingData;
    } else {
      this.listHistoryData = newData;
    }
    this.lisHistoryPages = this.lisHistoryPages + 1;
  }

  getHistoryListFailed(data) {
    this.listHistoryError = data;
  }
  // --- end of Get History List ---
  // --- Get Cart List ---
  async getCartList() {
    this.cartListLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      console.log('USER_ID', USER_ID);
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetCartList(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET CART LIST SUCCESS', response.data.data);
        this.getCartListSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('GET CART LIST SUCCESS', response.data.data);
        this.getCartListSuccess(null);
      } else {
        log.error('GET CART LIST FAILED', response.data);
        this.getCartListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET CART LIST', error);
      this.getCartListFailed(error);
    } finally {
      this.cartListLoading = false;
    }
  }

  getCartListSuccess(data) {
    this.cartListData = data;
  }

  getCartListFailed(data) {
    this.cartListError = data;
  }

  clearCartListData() {
    this.cartListData = null;
  }
  // --- end of Get Cart List ---
  // --- Create Cart List ---
  async createCartList(dataCart) {
    this.createCartLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiCreateCartList(),
        {
          users_id: USER_ID,
          carts: dataCart,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('CREATE CART LIST SUCCESS', response.data.data);
        this.createCartListSuccess(response.data.data);
      } else if (response.data.code === 201) {
        log.info('CREATE CART LIST SUCCESS', response.data.data);
        this.createCartListSuccess(response.data.data);
      } else {
        log.error('CREATE CART LIST FAILED', response.data);
        this.createCartListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR CREATE CART LIST', error);
      this.createCartListFailed(error);
    } finally {
      this.cartListLoading = false;
    }
  }

  createCartListSuccess(data) {
    this.createCartResponse = data;
    this.getCartList();
  }

  createCartListFailed(data) {
    this.createCartError = data;
  }

  clearCreateCartListResponse() {
    this.createCartResponse = null;
  }

  // --- end of Create Cart List ---
  // --- Update Cart List ---
  async updateCartList(dataCart, status) {
    this.updateCartLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const newCarts =
        status == 'edit'
          ? {
              _id: this.idVrians,
              merchants_id: dataCart?.merchants_id,
              products_id: dataCart?.products_id,
              quantity: dataCart?.quantity,
              notes: dataCart?.notes,
              variants: dataCart?.productsvariants,
            }
          : {
              _id: dataCart?.newCartsQty?.['_id'],
              merchants_id: dataCart?.newCartsQty?.merchants_id,
              products_id: dataCart?.newCartsQty?.products_id,
              quantity: dataCart?.newCartsQty?.quantity,
              notes: dataCart?.newCartsQty?.notes,
              variants: dataCart?.newCartsQty?.productsvariants,
            };

      // const newCartsEdit = {
      //   _id: this.idVrians,
      //   merchants_id: dataCart?.merchants_id,
      //   products_id: dataCart?.products_id,
      //   quantity: dataCart?.quantity,
      //   notes: dataCart?.notes,
      //   variants: dataCart?.productsvariants,
      // };

      console.log('bodyUpdate', {
        users_id: USER_ID,
        carts: newCarts,
      });
      console.log('datacartSEND', newCarts);

      const response = await axios.post(
        ApiClient.apiUpdateCartList(),
        {
          users_id: USER_ID,
          carts: newCarts,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('UPDATE CART LIST SUCCESS', response.data.data);
        this.updateCartListSuccess();
      } else if (response.data.code === 201) {
        log.info('UPDATE CART LIST SUCCESS', response.data.data);
        this.updateCartListSuccess(response.data.data);
      } else {
        log.error('UPDATE CART LIST FAILED', response.data);
        this.updateCartListFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR UPDATE CART LIST', error);
      this.updateCartListFailed(error);
    } finally {
      this.updateCartLoading = false;
    }
  }

  setIdVarians(_id) {
    this.idVrians = _id;
  }

  updateCartListSuccess(data) {
    this.updateCartData = data;
    this.getCartList();
  }

  updateCartListFailed(data) {
    this.updateCartError = data;
  }

  async getProductDetail(productId) {
    this.productDetailLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(
        ApiClient.apiGetProductDetail(USER_ID, productId),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET PRODUCT DETAIL SUCCESS', response.data.data);
        this.getProductDetailSuccess(response.data.data);
      } else {
        log.error('GET PRODUCT DETAIL FAILED', response.data);
        this.getProductDetailFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET PRODUCT DETAIL', error);
      this.getProductDetailFailed(error);
    } finally {
      this.productDetailLoading = false;
    }
  }

  getProductDetailSuccess(data) {
    this.productDetailData = data;
  }

  getProductDetailFailed(data) {
    this.productDetailError = data;
  }

  async postOrderCheckoutDetail(data) {
    this.orderCheckoutDetailLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      console.log('datasCheckout', {
        users_id: USER_ID,
        orders: {
          merchants_id: data.merchants_id,
          address_id: null,
          lat: this.currentDeliveryAddress.lat,
          long: this.currentDeliveryAddress.lng,
        },
      });
      const response = await axios.post(
        ApiClient.apiPostOrderDetail(),
        {
          users_id: USER_ID,
          orders: {
            merchants_id: data.merchants_id,
            address_id: null,
            lat: this.currentDeliveryAddress.lat,
            long: this.currentDeliveryAddress.lng,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('POST ORDER CHECKOUT DETAIL SUCCESS', response.data.data);
        this.postOrderCheckoutSuccess(response.data.data);
      } else {
        log.error('POST ORDER CHECKOUT DETAIL FAILED', response.data);
        this.postOrderCheckoutFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR POST ORDER CHECKOUT DETAIL', error);
      this.postOrderCheckoutFailed(response.data);
    } finally {
      this.orderCheckoutDetailLoading = false;
    }
  }

  postOrderCheckoutSuccess(data) {
    this.orderCheckoutDetailData = data;
  }

  postOrderCheckoutFailed(data) {
    this.orderCheckoutDetailError = data;
  }

  async postCreateOrderCheckout(data) {
    this.createOrderLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiPostCreateOrder(),
        {
          users_id: USER_ID,
          orderscheckout: {
            merchants_id: data.merchants_id,
            address_id: null,
            lat: this.currentDeliveryAddress.lat,
            long: this.currentDeliveryAddress.lng,
            payments_type: data.paymentType.type,
            notes: data.notes,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('POST CREATE ORDER CHECKOUT SUCCESS', response.data.data);
        this.postCreateOrderSuccess(response.data.data);
      } else {
        log.error('POST CREATE ORDER CHECKOUT FAILED', response.data);
        this.postCreateOrderFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR  POST CREATE ORDER CHECKOUT', error);
      this.postCreateOrderFailed(error);
    } finally {
      this.createOrderLoading = false;
    }
  }

  postCreateOrderSuccess(data) {
    this.createOrderResponse = data;
  }

  postCreateOrderFailed(data) {
    this.createOrderError = data;
  }

  createNoteDriver(data) {
    this.noteDrivers = data;
  }

  clearCreateOrder() {
    this.createOrderLoading = false;
    this.createOrderError = null;
    this.createOrderResponse = null;
    this.orderStatus = null;
    this.noteDrivers = null;
  }

  async getListFavorite() {
    this.getListFavoriteLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(ApiClient.apiGetListFavorite(USER_ID), {
        headers: {
          // Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET FAVORITE LIST SUCCESS', response.data.data);
        this.getListFavoriteSuccess(response.data.data);
      } else {
        log.error('GET FAVORITE LIST FAILED', response.data);
        this.getListFavoriteFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET LIST FAVORITE', error);
      this.getListFavoriteFailed(error);
    } finally {
      this.getListFavoriteLoading = false;
    }
  }

  getListFavoriteSuccess(data) {
    this.getListFavoriteData = data;
  }

  getListFavoriteFailed(data) {
    this.getListFavoriteError = data;
  }

  async postCreateHeaderFavorite(name) {
    this.createFavoriteLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiPostCreateHeaderFavorite(),
        {
          users_id: USER_ID,
          favorites: {
            name,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('POST CREATE FAVORITE SUCCESS', response.data.data);
        this.createHeaderFavoriteSuccess(response.data.data);
        this.getListFavorite();
      } else {
        log.error('POST CREATE FAVORITE FAILED', response.data);
        this.createHeaderFavoriteFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR POST CREATE FAVORITE', error);
      this.createHeaderFavoriteFailed(error);
    } finally {
      this.createFavoriteLoading = false;
    }
  }

  createHeaderFavoriteSuccess(data) {
    this.createFavoriteResponse = data;
  }

  createHeaderFavoriteFailed(data) {
    this.createFavoriteError = data;
  }

  async postCreateDetailFavorite(data) {
    this.createFavoriteDetailLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.post(
        ApiClient.apiPostCreateDetailFavorite(),
        {
          users_id: USER_ID,
          favorites: {
            id: data.id,
            products_id: data.products_id,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('POST CREATE FAVORITE DETAIL SUCCESS', response.data.data);
        this.createDetailFavoriteSuccess('success');
        this.getListFavorite();
      } else {
        log.error('POST CREATE FAVORITE DETAIL FAILED', response.data);
        this.createDetailFavoriteFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR POST CREATE FAVORITE DETAIL', error);
      this.createDetailFavoriteFailed(error);
    } finally {
      this.createFavoriteDetailLoading = false;
    }
  }

  createDetailFavoriteSuccess(data) {
    this.createFavoriteDetailResponse = data;
  }

  createDetailFavoriteFailed(data) {
    this.createFavoriteDetailError = data;
  }

  clearCreateDetailFavorite() {
    this.createFavoriteDetailLoading = false;
    this.createFavoriteDetailError = null;
    this.createFavoriteDetailResponse = null;
  }

  clearListFavorite() {
    this.getListFavoriteLoading = false;
    this.getListFavoriteError = null;
    this.getListFavoriteData = null;
    this.createFavoriteLoading = false;
    this.createFavoriteError = null;
    this.createFavoriteResponse = null;
  }

  // --- end of Update Cart List ---

  async getExploreMostLikeList(type) {
    this.listExploreLikeLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST lIKE SUCCESS', response.data.data);
        this.getExploreListLikeSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST lIKE  FAILED', response.data);
        this.getExploreListLikeFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE LIST lIKE ', error);
      this.getExploreListLikeFailed(error);
    } finally {
      this.listExploreLikeLoading = false;
    }
  }

  getExploreListLikeSuccess(data) {
    this.listExploreLikeData = data;
  }

  getExploreListLikeFailed(data) {
    this.listExploreLikeError = data;
  }

  clearListMostLike() {
    // Most Like
    this.listExploreLikeData = null;
    this.listExploreLikeError = null;
    this.listExploreLikeLoading = false;
  }

  // --- end of ExploreListLike ---

  async getExplorePromo(type) {
    this.listExplorePromoLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST PROMO SUCCESS', response.data.data);
        this.getExplorePromoSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST PROMO  FAILED', response.data);
        this.getExplorePromoFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE PROMO ', error);
      this.getExplorePromoFailed(error);
    } finally {
      this.listExplorePromoLoading = false;
    }
  }

  getExplorePromoSuccess(data) {
    this.listExplorePromoData = data;
  }

  getExplorePromoFailed(data) {
    this.listExplorePromoError = data;
  }
  clearListPromo() {
    // Most Like
    this.listExplorePromoData = null;
    this.listExplorePromoError = null;
    this.listExplorePromoLoading = false;
  }

  async getExplorePopulars(type) {
    this.listExplorePopularsLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST POPULARS SUCCESS', response.data.data);
        this.getExplorePopularsSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST POPULARS  FAILED', response.data);
        this.getExplorePopularsFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE POPULARS ', error);
      this.getExplorePopularsFailed(error);
    } finally {
      this.listExplorePopularsLoading = false;
    }
  }

  getExplorePopularsSuccess(data) {
    this.listExplorePopularsData = data;
  }

  getExplorePopularsFailed(data) {
    this.listExplorePopularsoError = data;
  }
  clearListPopulars() {
    this.listExplorePopularsData = null;
    this.listExplorePopularsError = null;
    this.listExplorePopularsLoading = false;
  }

  async getExploreHayuqers(type) {
    this.listExploreHayuqersLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST HAYUQERS SUCCESS', response.data.data);
        this.getExploreHayuqersSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST HAYUQERS  FAILED', response.data);
        this.getExploreHayuqersFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE HAYUQERS ', error);
      this.getExploreHayuqersFailed(error);
    } finally {
      this.listExploreHayuqersLoading = false;
    }
  }

  getExploreHayuqersSuccess(data) {
    this.listExploreHayuqersData = data;
  }

  getExploreHayuqersFailed(data) {
    this.listExploreHayuqersError = data;
  }
  clearListHayuqers() {
    // Most Like
    this.listExploreHayuqersData = null;
    this.listExploreHayuqersError = null;
    this.listExploreHayuqersLoading = false;
  }

  async getListProductCart(products_id) {
    this.listCartProductDataLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const response = await axios.get(
        ApiClient.apiGetCartListProducts(USER_ID, products_id),
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET LIST CART PRODUCT SUCCESS', response.data.data);
        this.getCartListProductSuccess(response.data.data);
      }
    } catch (error) {
      log.error('ERROR GET LIST CART PRODUCT', error);
      this.getCartListProductFailed(error);
    } finally {
      this.listCartProductDataLoading = false;
    }
  }

  getCartListProductSuccess(data) {
    this.listCartProductData = data;
    this.getCartList();
  }

  getCartListProductFailed(data) {
    this.listCartProductDataError = data;
  }

  // --- end of CartListProduct ---

  async getDistanceCheck() {
    console.log('cekdostance nya');
    this.distanceCheckLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');

      const body = {
        users_id: USER_ID,
        from: {
          latitude: this.currentDeliveryAddress?.lat,
          longitude: this.currentDeliveryAddress?.lng,
        },
        to: {
          latitude: this.currentLocationAddress?.lat,
          longitude: this.currentLocationAddress?.lng,
        },
        type: 1,
      };

      const response = await axios.post(
        ApiClient.apiCekDistanceUsers(),
        {
          users_id: USER_ID,
          from: {
            latitude: this.currentDeliveryAddress?.lat,
            longitude: this.currentDeliveryAddress?.lng,
          },
          to: {
            latitude: this.currentLocationAddress?.lat,
            longitude: this.currentLocationAddress?.lng,
          },
          type: 1,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET DISTANCE CHECK SUCCESS', response.data);
        this.getDistanceCheckSuccess(response.data);
      } else if (response.data.code === 201) {
        log.info('GET DISTANCE CHECK SUCCESS', response.data);
        this.getDistanceCheckSuccess(response.data);
      }
    } catch (error) {
      log.error('ERROR GET DISTANCE CHECK', error);
      this.getDistanceCheckFailed(error);
    } finally {
      this.distanceCheckLoading = false;
    }
  }

  getDistanceCheckSuccess(data) {
    this.distanceCheckData = data;
  }

  getDistanceCheckFailed(data) {
    this.distanceCheckError = data;
  }

  async getExploreReorder(type) {
    this.listExploreReorderLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiGetListExplore(
          USER_ID,
          this.currentDeliveryAddress.lat,
          this.currentDeliveryAddress.lng,
          type,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST REORDER SUCCESS', response.data.data);
        this.getExploreReorderSuccess(response.data.data, type);
      } else {
        log.error('GET EXPLORE LIST REORDER  FAILED', response.data);
        this.getExploreReorderFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET EXPLORE REORDER ', error);
      this.getExploreReorderFailed(error);
    } finally {
      this.listExploreReorderLoading = false;
    }
  }

  getExploreReorderSuccess(data) {
    this.listExploreReorderData = data;
  }

  getExploreReorderFailed(data) {
    this.listExploreReordersError = [];
  }

  clearListReorderData() {
    // Most Like
    this.listExploreReorderData = null;
    this.listExploreReordersError = null;
    this.listExploreReorderLoading = false;
  }

  async getCousinesData(type) {
    this.listCousinesLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');

    try {
      const response = await axios.get(
        ApiClient.apiCousinesList(
          type,
          this.currentDeliveryAddress?.lat,
          this.currentDeliveryAddress?.lng,
        ),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET EXPLORE LIST COUSINES SUCCESS', response.data.data);
        this.getCousinesSuccess(response.data.data);
      } else {
        log.error('GET EXPLORE LIST COUSINES  FAILED', response.data);
        this.getCousinesFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET COUSINES REORDER ', error);
      this.getCousinesFailed(error);
    } finally {
      this.listCousinesLoading = false;
    }
  }

  getCousinesSuccess(data) {
    this.listCousinesData = data;
  }

  getCousinesFailed(data) {
    this.listCousinessError = [];
  }

  async postTopUpDana(Amount) {
    this.topUpDanaLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    console.log('Body', {
      users_id: USER_ID,
      amount: Amount,
    });
    console.log('URL TOPUP', ApiClient.apiTopUpDana());
    try {
      const response = await axios.post(
        ApiClient.apiTopUpDana(),
        {
          users_id: USER_ID,
          amount: Amount,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      console.log('responseT OPUPDANA', response);
      if (response.data.code === 200) {
        log.info('TOPUP DANA SUCCESS', response.data.data);
        this.getTopUpDanaSuccess(response.data.data);
      } else {
        log.error('TOPUP DANA FAILED', response.data);
        this.getTopUpDanaFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR TOPUP DANA ', error);
      this.getTopUpDanaFailed(error);
    } finally {
      this.topUpDanaLoading = false;
    }
  }

  getTopUpDanaSuccess(data) {
    this.topUpDanaData = data;
  }

  getTopUpDanaFailed(data) {
    this.topUpDanaError = [];
  }

  clearTopUpDana() {
    this.topUpDanaLoading = false;
    this.topUpDanaData = null;
    this.topUpDanaError = null;
  }

  async verifyOtpEmail(otp) {
    this.verifyEmailOtpLoading = true;
    try {
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const USER_ID = await AsyncStorage.getItem('USER_ID');

      const response = await axios.post(
        ApiClient.apiPostVerifyEmail(),
        {
          email: this.accountDetailData.users.email,
          tokens: otp,
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('VERIFY EMAIL SUCCESS', response.data.data);
        this.verifyOtpEmailSuccess(response.data.data);
      } else {
        log.error('VERIFY EMAIL FAILED', response.data);
        this.verifyOtpEmailFailed(response.data.data.message);
      }
    } catch (error) {
      log.error('VERIFY EMAIL', error);
      this.verifyOtpEmailFailed(error);
    } finally {
      this.verifyEmailOtpLoading = false;
    }
  }

  verifyOtpEmailSuccess(data) {
    this.verifyEmailOtpResponse = data;
  }

  verifyOtpEmailFailed(data) {
    this.verifyEmailOtpError = data;
  }

  clearVerifyOtpEmail() {
    this.verifyEmailOtpResponse = null;
    this.verifyEmailOtpError = null;
    this.verifyEmailOtpLoading = false;
  }

  async deleteFavorite(id) {
    this.deleteFavoriteLoading = true;
    try {
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      console.log({
        users_id: USER_ID,
        favorites: {
          id: id,
        },
      });

      const response = await axios.post(
        ApiClient.apiDeleteFavorite(),
        {
          users_id: USER_ID,
          favorites: {
            id: id,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('DELETE FAVORITE SUCCESS', response.data);
        this.getListFavorite();
        this.deleteFavoriteSuccess(response.data);
      } else {
        log.error('DELETE FAVORITE FAILED', response.data);
        this.deleteFavoriteFailed(response.data.data.message);
      }
    } catch (error) {
      log.error('DELETE FAVORITE', error);
      this.deleteFavoriteFailed(error);
    } finally {
      this.deleteFavoriteLoading = false;
    }
  }

  async deleteDetailFavorite(id) {
    this.deleteFavoriteLoading = true;
    try {
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      console.log({
        users_id: USER_ID,
        favorites: {
          id: id,
        },
      });

      const response = await axios.post(
        ApiClient.apiDeleteDetailFavorite(),
        {
          users_id: USER_ID,
          favorites: {
            id: id,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('DELETE FAVORITE SUCCESS', response.data);
        this.getListFavorite();
        this.deleteFavoriteSuccess(response.data);
      } else {
        log.error('DELETE FAVORITE FAILED', response.data);
        this.deleteFavoriteFailed(response.data.data.message);
      }
    } catch (error) {
      log.error('DELETE FAVORITE', error);
      this.deleteFavoriteFailed(error);
    } finally {
      this.deleteFavoriteLoading = false;
    }
  }

  deleteFavoriteSuccess(data) {
    this.deleteFavoriteResponse = data;
  }

  deleteFavoriteFailed(data) {
    this.deleteFavoriteError = data;
  }

  clearDeleteFavorite() {
    this.deleteFavoriteResponse = null;
    this.deleteFavoriteError = null;
    this.deleteFavoriteLoading = false;
  }

  async getHistoryTopUpData() {
    this.listHistoryTopUpDataLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(ApiClient.apiGetHistoryTopUp(USER_ID), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('GET LIST HISTORY TOP UP SUCCESS', response.data.data);
        this.getHistoryTopUpSuccess(response.data.data);
      } else {
        log.error('GET LIST HISTORY TOP UP FAILED', response.data);
        this.getHistoryTopUpFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GE LIST HISTORY TOP UP ', error);
      this.getHistoryTopUpFailed(error);
    } finally {
      this.listHistoryTopUpDataLoading = false;
    }
  }

  getHistoryTopUpSuccess(data) {
    this.listHistoryTopUpData = data;
  }

  getHistoryTopUpFailed(data) {
    this.listHistoryTopUpDataError = [];
  }

  async getBannerData(language, type) {
    this.bannerDataLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(
        ApiClient.apiBanner(language?.toUpperCase(), type),
        {
          headers: {
            // Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('GET LIST BANNER SUCCESS', response.data.data);
        this.getBannerSuccess(response.data.data, type);
      } else {
        log.error('GET LIST BANNER FAILED', response.data);
        this.getBannerFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR GET BANNER ERROR', error);
      this.getBannerFailed(error);
    } finally {
      this.bannerDataLoading = false;
    }
  }

  getBannerSuccess(data, type) {
    if (type == 2) {
      console.log('datyaPOTRAIT=>', data);
      this.bannerDataPotrait = data;
    } else {
      console.log('datyaLandscape=>', data);
      this.bannerDataLandscape = data;
    }
  }

  getBannerFailed(data) {
    this.bannerDataError = [];
  }

  clearBannerData() {
    this.bannerDataPotrait = null;
    this.bannerDataLandscape = null;
    this.bannerDataError = null;
    this.bannerDataLoading = false;
  }

  // Create Voucher
  async createVoucher(id, merchant_id) {
    this.createVoucherLoading = true;
    try {
      const USER_ID = await AsyncStorage.getItem('USER_ID');
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const data = {
        users_id: USER_ID,
        vouchers: {
          _id: id,
          merchants_id: merchant_id,
        },
      };
      console.log('DATA', data);

      const response = await axios.post(ApiClient.apiCreateVoucher(), data, {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('CREATE VOUCHER SUCCESS', response.data.data);
        this.createVoucherSuccess(response.data.data);
      } else {
        console.log('CREATE VOUCHER FAILED', response);
        log.error('CREATE VOUCHER FAILED', response.data);
        this.createVoucherFailed(response.data);
      }
    } catch (error) {
      log.error('ERROR CREATE VOUCHER', error);
      this.createVoucherFailed(error);
    } finally {
      this.createVoucherLoading = false;
    }
  }

  createVoucherSuccess(data) {
    this.createVoucherData = data;
    // this.getAddressList();
  }

  createVoucherFailed(data) {
    this.createVoucherError = data;
  }

  clearVoucherData() {
    this.createVoucherData = null;
    this.createVoucherError = null;
    this.createVoucherLoading = false;
  }

  // end of Create Voucher

  // start of start Delete Voucher
  async deleteVoucher(id) {
    this.deleteVoucherLoading = true;
    try {
      const TOKEN = await AsyncStorage.getItem('TOKEN');
      const USER_ID = await AsyncStorage.getItem('USER_ID');

      const response = await axios.post(
        ApiClient.apiDeleteVoucher(),
        {
          users_id: USER_ID,
          vouchers: {
            _id: id,
          },
        },
        {
          headers: {
            Authorization: `${TOKEN}`,
          },
        },
      );
      if (response.data.code === 200) {
        log.info('DELETE VOUCHER SUCCESS', response.data);
        // this.getListFavorite();
        this.deleteVoucherSuccess(response.data);
      } else {
        log.error('DELETE VOUCHER FAILED', response.data);
        this.deleteVoucherFailed(response.data.data.message);
      }
    } catch (error) {
      log.error('DELETE VOUCHER', error);
      this.deleteVoucherFailed(error);
    } finally {
      this.deleteVoucherLoading = false;
    }
  }

  deleteVoucherSuccess(data) {
    this.deleteVoucherResponse = data;
  }

  deleteVoucherFailed(data) {
    this.deleteVoucherError = data;
  }

  clearDeleteVoucher() {
    this.deleteVoucherResponse = null;
    this.deleteVoucherError = null;
    this.deleteVoucherLoading = false;
  }
  // end Delete Voucher

  async downloadReceipt(id) {
    this.downloadReceiptLoading = true;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    const TOKEN = await AsyncStorage.getItem('TOKEN');
    try {
      const response = await axios.get(ApiClient.apiDownloadReceipt(id), {
        headers: {
          Authorization: `${TOKEN}`,
        },
      });
      if (response.data.code === 200) {
        log.info('DOWNLOAD RECEIPT SUCCESS', response.data.data);
        this.downloadReceiptSuccess(response.data.data, type);
      } else {
        log.error('DOWNLOAD RECEIPT FAILED', response.data);
        this.downloadReceiptFailed(response.data);
      }
    } catch (error) {
      log.error('DOWNLOAD RECEIPT FAILED', error);
      this.downloadReceiptFailed(error);
    } finally {
      this.downloadReceiptLoading = false;
    }
  }

  downloadReceiptSuccess(data) {
    this.downloadReceiptData = data;
  }

  downloadReceiptFailed(data) {
    this.downloadReceiptError = data;
  }

  clearDownloadReceiptdata() {
    this.downloadReceiptLoading = false;
    this.downloadReceiptError = null;
    this.downloadReceiptData = null;
  }

  // --- Clear Store ---

  clearHomeStore() {
    log.info('REMOVE EVERYTHING!!');

    this.accountDetailLoading = false;
    this.accountDetailError = null;
    this.accountDetailData = null;
    this.verifyEmailLoading = false;
    this.verifyEmailError = null;
    this.verifyEmailData = null;
    this.addressListLoading = false;
    this.addressListError = null;
    this.addressListData = null;
    this.freqUsedAddress = [];
    this.createAddressLoading = false;
    this.createAddressError = null;
    this.createAddressData = null;
    this.updateAccountLoading = false;
    this.updateAccountError = null;
    this.updateAccountData = null;
    this.updateAddressLoading = false;
    this.updateAddressError = null;
    this.updateAddressData = null;
    this.deleteAddressData = null;
    this.deleteAddressError = null;
    this.deleteAddressLoading = false;
    this.listExploreLoading = false;
    this.listExploreError = null;
    this.listExploreData = null;
    this.merchantDetailLoading = false;
    this.merchantDetailError = null;
    this.merchantDetailData = null;
    this.merchantDetailId = null;
    this.mainRecomendedLoading = false;
    this.mainRecomendedError = null;
    this.mainRecomendedData = null;
    this.mainVoucherLoading = false;
    this.mainVoucherError = null;
    this.mainVoucherData = null;
    this.mainReorderLoading = false;
    this.mainReorderError = null;
    this.mainReorderData = null;
    this.mainLikedLoading = false;
    this.mainLikedError = null;
    this.mainLikedData = null;
    this.mainPopularLoading = false;
    this.mainPopularError = null;
    this.mainPopularData = null;
    this.mainRatedLoading = false;
    this.mainRatedError = null;
    this.mainRatedData = null;
    this.searchLoading = false;
    this.searchError = null;
    this.searchData = null;
    this.listHistoryLoading = false;
    this.listHistoryError = null;
    this.listHistoryData = null;
    this.listCartProductData = null;
    this.listCartProductDataLoading = false;
    this.listCartProductDataError = null;
    this.distanceCheckData = null;
    this.distanceCheckLoading = false;
    this.distanceCheckError = null;
    this.listCousinesData = null;
    this.listCousinessError = null;
    this.listCousinesLoading = false;
    this.listHistoryTopUpData = null;
    this.listHistoryTopUpDataLoading = false;
    this.listHistoryTopUpDataError = null;
    this.clearDownloadReceiptdata();
    this.clearCartListData();
    this.clearCreateOrder();
    this.clearListFavorite();
    this.clearListMostLike();
    this.clearListPromo();
    this.clearListPopulars();
    this.clearListHayuqers();
    this.clearListReorderData();
    this.notifyStatus = false;
    this.clearTopUpDana();
    this.clearVerifyOtpEmail();
    this.clearDeleteFavorite();
    this.clearBannerData();
    this.clearDeleteVoucher();
    this.clearVoucherData();
  }
}
