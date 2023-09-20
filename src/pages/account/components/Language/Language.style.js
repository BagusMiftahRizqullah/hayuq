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
    // ------ List Language ------
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
    containerListLanguage: {
      justifyContent: 'space-between',
      paddingVertical: CustomSpacing(10),
    },
    activeOuter: {
      width: CustomSpacing(20),
      height: CustomSpacing(20),
      borderWidth: 1,
      borderColor: Colors.secondaryMain,
      borderRadius: Rounded.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeInner: {
      width: CustomSpacing(10),
      height: CustomSpacing(10),
      backgroundColor: Colors.secondaryMain,
      borderRadius: Rounded.xl,
    },
    inActiveOuter: {
      width: CustomSpacing(20),
      height: CustomSpacing(20),
      borderWidth: 1,
      borderColor: Colors.neutral70,
      borderRadius: Rounded.xl,
    },
  });
};

export default styles;
