import CONFIG from '@config';

const apiGetListOrder = (USER_ID, PAGE) => {
  return `${CONFIG.portTransaction}/list?users_id=${USER_ID}&size=5&page=${PAGE}`;
};

const apiGetOrderDetail = (USER_ID, TRX_ID) => {
  return `${CONFIG.portTransaction}/detail?users_id=${USER_ID}&transactions_id=${TRX_ID}`;
};

const apiReorder = (USER_ID, TRX_ID) => {
  return `${CONFIG.portTransaction}/reorder?transactions_id=${TRX_ID}&users_id=${USER_ID}`;
};

export default {
  apiGetOrderDetail,
  apiGetListOrder,
  apiReorder,
};
