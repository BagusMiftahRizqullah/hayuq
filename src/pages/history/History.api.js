import CONFIG from '@config';

const apiGetListHistory = (USER_ID, PAGE) => {
  return `${CONFIG.portTransaction}/list?users_id=${USER_ID}&size=5&page=${PAGE}`;
};

const apiGetHistoryDetail = (USER_ID, TRX_ID) => {
  return `${CONFIG.portTransaction}/detail?users_id=${USER_ID}&transactions_id=${TRX_ID}`;
};

const apiPostRating = () => {
  return `${CONFIG.portTransaction}/ratings/create`;
};

const apiPostRatingDriver = () => {
  return `${CONFIG.portTransaction}/ratings/create-drivers`;
};
export default {
  apiGetHistoryDetail,
  apiGetListHistory,
  apiPostRating,
  apiPostRatingDriver,
};
