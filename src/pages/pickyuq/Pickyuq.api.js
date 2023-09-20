import CONFIG from '@config';

const apiPreCheckout = () => {
  return `${CONFIG.portOrder}/pre-checkout`;
};

const apiCheckout = () => {
  return `${CONFIG.portOrder}/checkout`;
};

const apiRatingDriver = () => {
  return `${CONFIG.portTransaction}/ratings/create-drivers`;
};

const apiDriverTip = () => {
  return `${CONFIG.portTransaction}/tips`;
};

const apiCancelPickyuq = () => {
  return `${CONFIG.portOrder}/cancel`;
};

const apiGetOrderPickyuq = () => {
  return `${CONFIG.portOrder}/list`;
};

export default {
  apiPreCheckout,
  apiCheckout,
  apiRatingDriver,
  apiDriverTip,
  apiCancelPickyuq,
  apiGetOrderPickyuq,
};
