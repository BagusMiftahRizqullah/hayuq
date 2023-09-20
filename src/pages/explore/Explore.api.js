import CONFIG from '@config';

const apiGetAccountDetail = (USER_ID) => {
  return `${CONFIG.portAccount}/data?users_id=${USER_ID}`;
};

const apiPostRequestVerifyEmail = () => {
  return `${CONFIG.portAccount}/email/request`;
};

const apiPostVerifyEmail = () => {
  return `${CONFIG.portAccount}/email/verify`;
};

const apiGetAddressList = (USER_ID) => {
  return `${CONFIG.portAccount}/address/list?users_id=${USER_ID}`;
};

const apiPostCreateAddress = () => {
  return `${CONFIG.portAccount}/address/create`;
};

const apiPostUpdateAccount = () => {
  return `${CONFIG.portAccount}/update`;
};

const apiPostUpdateAddress = () => {
  return `${CONFIG.portAccount}/address/update`;
};

const apiPostDeleteAddress = () => {
  return `${CONFIG.portAccount}/address/delete`;
};

const apiGetNearmeList = (USER_ID, LAT, LNG) => {
  return `${CONFIG.portMerchant}/explore/list?users_id=${USER_ID}&lat=${LAT}&long=${LNG}&type=1&size=10`;
};

const apiGetListExplore = (USER_ID, LAT, LNG, TYPE, OPTIONS) => {
  return `${CONFIG.portMerchant}/explore/list?users_id=${USER_ID}&lat=${LAT}&long=${LNG}&type=${TYPE}&size=10`;
};

const apiGetListExploreCousines = (USER_ID, LAT, LNG, TYPE, OPTIONS) => {
  return `${CONFIG.portMerchant}/explore/list?users_id=${USER_ID}&lat=${LAT}&long=${LNG}&type=${TYPE}&options=${OPTIONS}`;
};

const apiGetMerchantDetail = (USER_ID, MERCHANT_ID, LAT, LNG) => {
  return `${CONFIG.portMerchant}/explore/detail?users_id=${USER_ID}&merchants_id=${MERCHANT_ID}&lat=${LAT}&long=${LNG}&type=0`;
};

const apiGetSearch = (USER_ID, SEARCH, LAT, LNG, STATUS) => {
  return `${CONFIG.portMerchant}/explore/list?users_id=${USER_ID}&lat=${LAT}&long=${LNG}&type=9&search=${SEARCH}&status=${STATUS}&size=10`;
};

const apiGetListHistory = (USER_ID, PAGE) => {
  return `${CONFIG.portTransaction}/list?users_id=${USER_ID}&page=${PAGE}`;
};

const apiGetCartList = (USER_ID) => {
  return `${CONFIG.portAccount}/cart/list?users_id=${USER_ID}`;
};

const apiCreateCartList = () => {
  return `${CONFIG.portAccount}/cart/create`;
};

const apiUpdateCartList = () => {
  return `${CONFIG.portAccount}/cart/update`;
};

const apiGetProductDetail = (USER_ID, PRODUCT_ID) => {
  return `${CONFIG.portProduct}/details?users_id=${USER_ID}&products_id=${PRODUCT_ID}`;
};

const apiPostOrderDetail = () => {
  return `${CONFIG.portOrder}/detail`;
};

const apiPostCreateOrder = () => {
  return `${CONFIG.portOrder}/create`;
};

const apiGetListFavorite = (USER_ID) => {
  return `${CONFIG.portAccount}/favorites/list?users_id=${USER_ID}`;
};

const apiPostCreateHeaderFavorite = () => {
  return `${CONFIG.portAccount}/favorites/head-create`;
};

const apiPostCreateDetailFavorite = () => {
  return `${CONFIG.portAccount}/favorites/detail-create`;
};

const apiGetCartListProducts = (userID, productID) => {
  return `${CONFIG.portAccount}/cart/list-products?users_id=${userID}&products_id=${productID}`;
};

const apiDeleteCartListProducts = () => {
  return `${CONFIG.portAccount}/cart/delete`;
};

const apiCekDistanceUsers = () => {
  return `${CONFIG.portMaster}/distance/check`;
};

const apiCousinesList = (type, LAT, LNG) => {
  return `${CONFIG.portMaster}/tags/list?type=${type}&lat=${LAT}&long=${LNG}`;
};

const apiTopUpDana = () => {
  return `${CONFIG.BASEURL}/api/v1/dana/top-up/users`;
};

const apiDeleteFavorite = () => {
  return `${CONFIG.portAccount}/favorites/head-delete`;
};

const apiDeleteDetailFavorite = () => {
  return `${CONFIG.portAccount}/favorites/detail-delete`;
};

const apiGetHistoryTopUp = (USER_ID) => {
  return `${CONFIG.portWallet}/list?users_id=${USER_ID}`;
};
const apiBanner = (language, type) => {
  return `${CONFIG.portMaster}/banner/list?lang=${language}&type=${type}`;
};

const apiCreateVoucher = () => {
  return `${CONFIG.portVoucher}/create`;
};

const apiDeleteVoucher = () => {
  return `${CONFIG.portVoucher}/delete`;
};

const apiDownloadReceipt = (id) => {
  return `${CONFIG.portWallet}/downloads?id=${id}`;
};

export default {
  apiGetAccountDetail,
  apiPostRequestVerifyEmail,
  apiPostVerifyEmail,
  apiGetAddressList,
  apiPostCreateAddress,
  apiPostUpdateAccount,
  apiPostUpdateAddress,
  apiPostDeleteAddress,
  apiGetNearmeList,
  apiGetListExplore,
  apiGetMerchantDetail,
  apiGetSearch,
  apiGetListHistory,
  apiGetCartList,
  apiCreateCartList,
  apiUpdateCartList,
  apiGetProductDetail,
  apiPostOrderDetail,
  apiPostCreateOrder,
  apiGetListFavorite,
  apiPostCreateHeaderFavorite,
  apiPostCreateDetailFavorite,
  apiGetCartListProducts,
  apiDeleteCartListProducts,
  apiCekDistanceUsers,
  apiGetListExploreCousines,
  apiCousinesList,
  apiTopUpDana,
  apiDeleteFavorite,
  apiDeleteDetailFavorite,
  apiGetHistoryTopUp,
  apiBanner,
  apiCreateVoucher,
  apiDeleteVoucher,
  apiDownloadReceipt,
};
