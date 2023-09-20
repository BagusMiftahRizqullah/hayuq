import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    loadingAnimation: {
      width: CustomSpacing(30),
      height: CustomSpacing(30),
      marginHorizontal: CustomSpacing(5),
    },
    dashboardPosition: {
      position: 'absolute',
      top: CustomSpacing(64),
      left: CustomSpacing(16),
    },
    dashboardContainer: {
      width: dimensions.screenWidth - CustomSpacing(32),
      backgroundColor: Colors.neutral20,
      borderRadius: Rounded.l,
      padding: CustomSpacing(16),
    },
    totalPaymentContainer: {
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral50,
      paddingBottom: CustomSpacing(12),
    },
    navigationContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
    },
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
  });
};

export default styles;
