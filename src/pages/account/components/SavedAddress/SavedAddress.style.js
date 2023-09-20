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
    // ------ Favourite Data ------
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
    // ------ |||| ------
    // ------ Add New Address ------
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
    // ------ |||| ------
    // ------ Search Input ------
    containerSearchInput: {
      backgroundColor: Colors.neutral30,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.l,
      alignItems: 'center',
    },
    imgSearchIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
    },
    searchInput: {
      ...Fonts.label,
      color: Colors.neutral70,
      height: CustomSpacing(35),
      marginTop: Platform.OS === 'ios' ? 0 : 5,
    },
    containerSelectFromMap: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? CustomSpacing(32) : CustomSpacing(16),
      left: CustomSpacing(16),
      padding: CustomSpacing(8),
      justifyContent: 'space-between',
      width: dimensions.screenWidth - CustomSpacing(32),
      height: dimensions.screenWidth * 0.16,
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.l,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgSelectMapIcon: {
      width: CustomSpacing(26),
      height: CustomSpacing(26),
      resizeMode: 'contain',
    },
    imgChevronRight: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Maps ------
    containerMap: {
      backgroundColor: Colors.neutral10,
      flex: 1,
    },
    // --- Map ---
    mapStyle: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      zIndex: 1,
    },
    imgMarkerLocation: {width: CustomSpacing(30), height: CustomSpacing(30)},
    containerBackIcon: {
      position: 'absolute',
      zIndex: 2,
      top: CustomSpacing(35),
      left: CustomSpacing(16),
    },
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ---- |||| ----
    // --- Bottom Sheet ---
    containerBottomSheet: {
      position: 'absolute',
      zIndex: 2,
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
    imgLocationBottomSheet: {
      width: CustomSpacing(44),
      height: CustomSpacing(44),
    },
    // ---- |||| ----
  });
};

export default styles;
