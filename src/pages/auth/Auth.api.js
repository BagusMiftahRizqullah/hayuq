import CONFIG from '@config';

const apiLoginUsers = () => {
  return `${CONFIG.portAuth}/login`;
};

const apiRegisterUsers = () => {
  return `${CONFIG.portAuth}/register`;
};

const apiVerifyOtp = () => {
  return `${CONFIG.portAuth}/verify`;
};

const apiPostTokenFCM = () => {
  return `${CONFIG.portAuth}/tokens/firebase`;
};

export default {
  apiLoginUsers,
  apiVerifyOtp,
  apiRegisterUsers,
  apiPostTokenFCM,
};
