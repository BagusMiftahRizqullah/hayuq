import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    overlayContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      height: '95%',
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
    navigator: {
      justifyContent: 'space-between',
    },
    backIcon: {width: CustomSpacing(32), height: CustomSpacing(32)},
    contentOverlay: {flex: 1},
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral40,
      paddingBottom: CustomSpacing(5),
    },
    flagIcon: {width: CustomSpacing(23), height: CustomSpacing(23)},
    continueBtn: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? CustomSpacing(20) : CustomSpacing(10),
      width: '100%',
    },
    otpContainer: {
      width: '100%',
    },
    otpTextInput: {
      borderWidth: 3,
      ...Fonts.h3,
      width: Platform.OS == 'ios' ? CustomSpacing(62) : CustomSpacing(63),
      height: CustomSpacing(70),
      padding: 0,
    },
  });
};

export default styles;
