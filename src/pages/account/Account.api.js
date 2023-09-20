import CONFIG from '@config';

const apiGetAffiliate = (USER_ID) => {
  return `${CONFIG.portWallet}/list-summary?users_id=${USER_ID}`;
};
const apiGetDetailUserAffiliate = (USER_ID) => {
  return `${CONFIG.portWallet}/list-summary?users_id=${USER_ID}&all=true`;
};

const apiGetDetailDriverAffiliate = (USER_ID) => {
  return `${CONFIG.portWallet}/list-summary?driver_id=${USER_ID}`;
};

const apiGetDetailAccount = (USER_ID) => {
  return `${CONFIG.portAccount}/data?users_id=${USER_ID}`;
};

const apiGetDeleteAccount = () => {
  return `${CONFIG.portAccount}/delete`;
};

export default {
  apiGetAffiliate,
  apiGetDetailUserAffiliate,
  apiGetDetailDriverAffiliate,
  apiGetDetailAccount,
  apiGetDeleteAccount,
};
