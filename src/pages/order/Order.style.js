import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.neutral10,
      flex: 1,
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
    // ------ Order Data------
    orderCard: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.l,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(16),
      marginBottom: CustomSpacing(16),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgIconOrder: {
      borderRadius: CustomSpacing(23),
      width: CustomSpacing(50),
      height: CustomSpacing(50),
    },
    textContainer: {
      maxWidth: dimensions.screenWidth * 0.6,
    },
    imgRatingIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    imgCommunicationIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
    },
    // ------ |||| ------
    // ------ No Order ------
    imgBillIcon: {
      width: dimensions.screenWidth * 0.46,
      height: dimensions.screenWidth * 0.67,
    },
    // ------ |||| ------
  });
};

export default styles;
