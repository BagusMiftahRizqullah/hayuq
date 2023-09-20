import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Header ------
    containerHeadear: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.36,
      backgroundColor: Colors.primaryMain,
    },
    imgProfileBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.36,
    },
    containerNavigator: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? CustomSpacing(4) : CustomSpacing(8),
      left: CustomSpacing(16),
    },
    imgGoback: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    imgCopy: {
      width: CustomSpacing(23),
      height: CustomSpacing(23),
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
    containerAffiliateStatus: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.s,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: CustomSpacing(12),
      marginHorizontal: CustomSpacing(18),
    },
    containerCard: {
      width: CustomSpacing(dimensions.screenWidth - 80),
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.xl,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: CustomSpacing(18),
      marginHorizontal: CustomSpacing(18),
    },
    containerNoCard: {
      padding: CustomSpacing(8),
      marginHorizontal: CustomSpacing(18),
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
    Coin: {
      width: CustomSpacing(120),
      height: CustomSpacing(62),
    },
    Money: {
      width: CustomSpacing(135),
      height: CustomSpacing(109),
    },
    imgInfo: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
    },
    containerCode: {
      justifyContent: 'space-between',
      backgroundColor: Colors.neutral30,
      borderRadius: Rounded.l,
      paddingHorizontal: CustomSpacing(22),
      paddingVertical: CustomSpacing(12),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    containerOrange: {
      backgroundColor: Colors.supportSurface,
      borderRadius: Rounded.l,
      shadowColor: Colors.supportSurface,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: CustomSpacing(7),
    },
    containerGreen: {
      backgroundColor: Colors.successBorder,
      borderRadius: Rounded.l,
      shadowColor: Colors.successBorder,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(8),
    },
    imgUser: {
      width: CustomSpacing(31),
      height: CustomSpacing(31),
    },
    btnReorder: {
      backgroundColor: Colors.secondarySurface,
      paddingHorizontal: CustomSpacing(8),
      paddingVertical: CustomSpacing(2),
      borderRadius: CustomSpacing(16),
    },
    // detail User
    navigatorBarContainer: {
      justifyContent: 'space-between',
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    imgCloseIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
  });
};

export default styles;
