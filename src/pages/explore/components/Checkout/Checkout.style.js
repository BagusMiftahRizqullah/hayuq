import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    imgBackIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    separator: {
      height: CustomSpacing(8),
      backgroundColor: Colors.backgroundMain,
    },
    deliveryContainer: {
      paddingVertical: CustomSpacing(12),
      paddingHorizontal: CustomSpacing(16),
    },
    addNotesBtn: {
      padding: CustomSpacing(6),
      borderWidth: 1,
      borderColor: Colors.neutral40,
      borderRadius: CustomSpacing(32),
      maxWidth: CustomSpacing(100),
      alignItems: 'center',
      justifyContent: 'center',
    },
    topPosition: {
      alignSelf: 'flex-start',
    },
    imgMenuOrderSummary: {
      width: CustomSpacing(50),
      height: CustomSpacing(50),
      borderRadius: CustomSpacing(4),
    },
    productNameContainer: {
      justifyContent: 'space-between',
      width: dimensions.screenWidth - CustomSpacing(114),
    },
    btnMinusCartModal: {
      padding: CustomSpacing(6),
      width: CustomSpacing(20),
      height: CustomSpacing(20),
      borderRadius: CustomSpacing(20),
      backgroundColor: Colors.primarySurface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnPlusCartModal: {
      padding: CustomSpacing(2),
      width: CustomSpacing(20),
      height: CustomSpacing(20),
      borderRadius: CustomSpacing(20),
      backgroundColor: Colors.primaryMain,
      alignItems: 'center',
      justifyContent: 'center',
    },
    voucherBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.3,
    },
    voucherPosition: {
      position: 'absolute',
      top: CustomSpacing(0),
    },
    voucherContainer: {
      paddingVertical: CustomSpacing(24),
      paddingHorizontal: CustomSpacing(16),
    },
    voucherContent: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
      borderRadius: CustomSpacing(12),
      justifyContent: 'space-between',
      width: dimensions.screenWidth - CustomSpacing(32),
    },
    voucherArrow: {
      padding: CustomSpacing(4),
      backgroundColor: Colors.secondaryBorder,
      borderRadius: CustomSpacing(30),
    },
    imgTagIcon: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
    },
  });
};

export default styles;
