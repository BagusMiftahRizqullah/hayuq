import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Delivery Addres Container ------
    deliveryAddressContainer: {
      flex: 1,
      paddingVertical: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    // ------ |||| ------
    // ------ Seach Bar ------
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    searchBarContainer: {
      flex: 1,
      backgroundColor: Colors.neutral10,
      height: CustomSpacing(52),
      borderRadius: Rounded.l,
      padding: CustomSpacing(14),
      justifyContent: 'space-between',
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgLocationIcon: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
      resizeMode: 'contain',
    },
    imgSearchOutlineIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    searchInput: {
      ...Fonts.body,
      color: Colors.neutral70,
      height: CustomSpacing(50),
    },
    // ------ |||| ------
    // ------ Save Location ------
    containerSeparator: {
      flexWrap: 'wrap',
      paddingHorizontal: CustomSpacing(16),
      paddingBottom: CustomSpacing(16),
      borderBottomWidth: CustomSpacing(4),
      borderBottomColor: Colors.backgroundMain,
    },
    imgSaveLocation: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    containerSaveLocation: {
      alignItems: 'center',
      marginRight: CustomSpacing(6),
      marginBottom: CustomSpacing(6),
      borderWidth: 1,
      borderColor: Colors.neutral50,
      padding: CustomSpacing(8),
      borderRadius: Rounded.xl,
      maxHeight: CustomSpacing(37),
      backgroundColor: Colors.neutral10,
    },
    // ------ |||| ------
    // ------ Current Location ------
    imgCurrentLocation: {
      width: CustomSpacing(26),
      height: CustomSpacing(26),
      resizeMode: 'contain',
    },
    imgAddBookmark: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    containerCurrentLocation: {
      padding: CustomSpacing(16),
      borderBottomWidth: CustomSpacing(4),
      borderBottomColor: Colors.backgroundMain,
    },
    // ------ |||| ------
    // ------ Select on Map ------
    containerSelectOnMap: {
      padding: CustomSpacing(16),
      borderBottomWidth: CustomSpacing(4),
      borderBottomColor: Colors.backgroundMain,
    },
    imgSelectMap: {
      width: CustomSpacing(26),
      height: CustomSpacing(26),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Frequently used ------
    imgSelectLocation: {
      width: CustomSpacing(26),
      height: CustomSpacing(26),
      resizeMode: 'contain',
    },
    addressContainer: {
      maxWidth: dimensions.screenWidth * 0.65,
      borderBottomColor: Colors.neutral50,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingBottom: CustomSpacing(8),
    },
    // ------ |||| ------
    // ------ Not Found ------
    containerNotFound: {
      padding: CustomSpacing(16),
      borderTopWidth: CustomSpacing(4),
      borderTopColor: Colors.backgroundMain,
      alignItems: 'center',
      flex: 1,
    },
    imgEmptyLocation: {
      width: CustomSpacing(290),
      height: CustomSpacing(225),
      resizeMode: 'contain',
    },
    imgChevronRight: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
    },
    chooseFromMapContainer: {
      position: 'absolute',
      bottom: 0,
      padding: CustomSpacing(8),
      justifyContent: 'space-between',
      width: dimensions.screenWidth * 0.7,
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
    // ------ |||| ------
    // ------ Bottom Sheet ------
    bottomSheetContainer: {
      height: '70%',
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
    inputStyle: {
      borderColor: Colors.neutral40,
      borderRadius: CustomSpacing(8),
      borderWidth: CustomSpacing(2),
      padding: CustomSpacing(8),
    },
    imgCloseIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
      justifyContent: 'space-between',
    },
    imgHideEye: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
      justifyContent: 'space-between',
    },
    // ------ |||| ------

    // ------ |||| ------
  });
};

export default styles;
