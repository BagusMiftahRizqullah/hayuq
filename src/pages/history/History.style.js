import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.mainBackground,
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
    // ------ Order Data------
    orderCard: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.l,
      padding: CustomSpacing(16),
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
      width: CustomSpacing(45),
      height: CustomSpacing(45),
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
    imgRatingIconTouch: {
      width: CustomSpacing(23),
      height: CustomSpacing(23),
      borderRadius: CustomSpacing(32),
    },
    imgRatingIconReviewFood: {
      width: CustomSpacing(23),
      height: CustomSpacing(23),
    },
    imgGoback: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ No Order ------
    imgBillIcon: {
      width: dimensions.screenWidth * 0.46,
      height: dimensions.screenWidth * 0.67,
    },
    // ------ |||| ------
    // ------ rateRestauran -----
    containerRateRestauran: {
      borderRadius: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#C2C2C2',
      height: 64,
      justifyContent: 'space-evenly',
    },
    // ------ |||| ------
    // ------ Review Food -----
    constinerReviewRestauran: {
      borderRadius: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#C2C2C2',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    btnReorder: {
      backgroundColor: Colors.secondarySurface,
      paddingHorizontal: CustomSpacing(8),
      paddingVertical: CustomSpacing(2),
      borderRadius: CustomSpacing(16),
    },
  });
};

export default styles;
