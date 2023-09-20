import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.neutral10,
      height: '100%',
    },
    // ------ Navigation Bar  ------
    NavigatorContainer: {
      justifyContent: 'space-between',
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
    },
    imgCloseIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Payyuq balance  ------
    balanceContainer: {
      backgroundColor: Colors.primaryMain,
      padding: CustomSpacing(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    // ------ |||| ------
    // ------ Top Up Method  ------
    containerMethodList: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.l,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(16),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgIconMethod: {
      width: CustomSpacing(30),
      height: CustomSpacing(15),
    },
    imgChevronRight: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
    },
    // ------ |||| ------
    containerVA: {
      backgroundColor: Colors.supportSurface,
      borderRadius: Rounded.m,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(8),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    containerHeadSteps: {
      backgroundColor: Colors.primarySurface,
      borderRadius: Rounded.s,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(8),
    },
    containerSteps: {
      borderWidth: CustomSpacing(7),
      borderColor: Colors.neutral30,
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.s,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(16),

      elevation: 6,
    },
    imgIconSteps: {
      width: CustomSpacing(8),
      height: CustomSpacing(8),
    },
  });
};

export default styles;
