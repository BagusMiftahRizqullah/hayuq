import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    containerAccount: {
      flex: 1,
      paddingTop: CustomSpacing(28),
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    // ------ Header ------
    containerProfilePic: {
      width: CustomSpacing(80),
      height: CustomSpacing(80),
      borderRadius: CustomSpacing(80),
      backgroundColor: Colors.secondaryMain,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgChevronRight: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ My Account ------
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

    containerAffiliate: {
      justifyContent: 'space-between',
      paddingVertical: CustomSpacing(4),
    },
  });
};

export default styles;
