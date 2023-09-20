import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Header ------
    containerHeadear: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.3,
      backgroundColor: Colors.primaryMain,
    },
    imgProfileBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.3,
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
    // ------ Manage Account list ------
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
    containerNonActive: {
      backgroundColor: Colors.neutral30,
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
    // ------ |||| ------
    // ------ Bottom Sheet ------
    bottomSheetContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      paddingTop: CustomSpacing(24),
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral40,
      paddingBottom: CustomSpacing(5),
    },
    // ------ |||| ------
    // ------ Delete Account ------
    containerAddNewAddress: {
      height: '100%',
      backgroundColor: Colors.backgroundMain,
    },
    // ------ Navigator ------
    containerNavigatorAddNewAddress: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgArrowBack: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
    },
    containerImgSad: {
      position: 'absolute',
      bottom: 0,
      right: CustomSpacing(20) * -1,
    },
    imgSadIllustration: {
      width: dimensions.screenWidth * 0.51,
      height: dimensions.screenWidth * 0.61,
    },
    // ------ |||| ------
    // ------ |||| ------
  });
};

export default styles;
