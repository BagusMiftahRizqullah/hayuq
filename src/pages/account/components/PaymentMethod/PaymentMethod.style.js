import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Header ------
    containerHeadear: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.46,
      backgroundColor: Colors.primaryMain,
    },
    imgProfileBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.46,
    },
    containerNavigator: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? CustomSpacing(44) : CustomSpacing(40),
      left: CustomSpacing(16),
    },
    imgGoback: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Card ------
    containerContent: {
      padding: CustomSpacing(16),
      position: 'absolute',
      top: dimensions.screenWidth * 0.26,
      width: '100%',
    },
    containerCard: {
      backgroundColor: Colors.neutral10,
      height: dimensions.screenWidth * 0.48,
      borderRadius: Rounded.xl,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgCardBg: {
      width: '100%',
      height: dimensions.screenWidth * 0.24,
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
    cardContentBalance: {
      position: 'absolute',
      left: CustomSpacing(12),
      top: CustomSpacing(12),
    },
    containerLogoPayyuq: {
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(4),
      borderRadius: Rounded.s,
    },
    imgLogoPayyuq: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
    },
    // ------ |||| ------
    // ------ Payment Method List ------
    containerMyAccount: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.l,
      paddingHorizontal: CustomSpacing(22),
      paddingVertical: CustomSpacing(10),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    containerAccountList: {
      justifyContent: 'space-between',
      paddingVertical: CustomSpacing(10),
    },
    imgAccountList: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
    },
    imgChevrontList: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
    },
  });
};

export default styles;
