import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Explore Container ------
    containerContent: {
      position: 'absolute',
      top: CustomSpacing(10),
      left: CustomSpacing(26),
    },
    balanceContainer: {
      width: dimensions.screenWidth - CustomSpacing(60),
      justifyContent: 'space-between',
    },
    imgEyeDisabled: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    imgIconTopUp: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
    },

    // ------ |||| ------

    // ------New Explore Style -----
    containerCardPayment: {
      paddingHorizontal: CustomSpacing(16),
      paddingBottom: CustomSpacing(16),
      justifyContent: 'space-between',
    },
    cardPayment: {
      width: dimensions.screenWidth / 2 - CustomSpacing(24),
      height: CustomSpacing(92),
    },
    cardPaymentImage: {
      width: '100%',
      height: '100%',
      borderRadius: Rounded.l,
      flex: 1,
      justifyContent: 'center',
      paddingVertical: CustomSpacing(8),
      paddingHorizontal: CustomSpacing(18),
    },
    // ------ ||| -------
  });
};

export default styles;
