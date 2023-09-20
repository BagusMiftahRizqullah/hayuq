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
    containerAnimationProfilePic: {
      position: 'absolute',
      bottom: CustomSpacing(55) * -1,
      left: dimensions.screenWidth / 2 - CustomSpacing(40),
      zIndex: 99,
    },
    containerProfilePic: {
      width: CustomSpacing(80),
      height: CustomSpacing(80),
      borderRadius: CustomSpacing(80),
      backgroundColor: Colors.secondaryMain,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // ------ |||| ------
    // ------ Profile Data ------
    containerProfileData: {
      padding: CustomSpacing(16),
      height: '100%',
    },
    containerInput: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral40,
      paddingBottom: CustomSpacing(5),
    },
    imgFlagicon: {
      width: CustomSpacing(23),
      height: CustomSpacing(23),
    },
    containerBtnAction: {
      position: 'absolute',
      bottom: dimensions.screenWidth + CustomSpacing(16),
      width: '100%',
      marginLeft: CustomSpacing(16),
    },
    // ------ |||| ------
    verifyEmailContainer: {
      backgroundColor: Colors.supportSurface,
      paddingVertical: CustomSpacing(10),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: Rounded.l,
    },
    verifiedEmailContainer: {
      backgroundColor: Colors.successBorder,
      paddingVertical: CustomSpacing(10),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: Rounded.l,
    },
  });
};

export default styles;
