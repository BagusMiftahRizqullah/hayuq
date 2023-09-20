import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Delivery Addres Container ------
    favouriteContainer: {
      flex: 1,
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    // ------ |||| ------
    // ------ Navigator ------
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Content Favourite ------
    imgFavThumbnail: {
      width: CustomSpacing(64),
      height: CustomSpacing(64),
      resizeMode: 'contain',
      borderRadius: Rounded.s,
    },
    imgChevronRight: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
    },
    imgEmptyFavourite: {
      width: dimensions.screenWidth * 0.84,
      height: dimensions.screenWidth * 0.81,
    },
    // ------ |||| ------
    // ------ Add Favourite ------
    imgOutlineAdd: {
      width: CustomSpacing(21),
      height: CustomSpacing(21),
      resizeMode: 'contain',
    },
    addFavBtn: {
      backgroundColor: Colors.primaryMain,
      width: '70%',
      padding: CustomSpacing(16),
      borderRadius: CustomSpacing(100),
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatBtn: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: CustomSpacing(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
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
  });
};

export default styles;
