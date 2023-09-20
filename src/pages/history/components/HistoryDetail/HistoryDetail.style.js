import {StyleSheet, Platform, Dimensions} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';
const {width, height} = Dimensions.get('window');
const styles = () => {
  return StyleSheet.create({
    containerChat: {
      backgroundColor: Colors.backgroundSurface,
      flex: 1,
    },
    imgChatBg: {
      width: dimensions.screenWidth,
      height:
        Platform.OS === 'ios'
          ? height - CustomSpacing(120)
          : height - CustomSpacing(100),
    },
    // --- Navigation Bar ---
    navigatorBarContainer: {
      justifyContent: 'flex-start',
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    imgCloseIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    imgAvatar: {
      width: CustomSpacing(48),
      height: CustomSpacing(48),
      resizeMode: 'contain',
      borderRadius: CustomSpacing(100),
    },
    imgCallIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ---- ||| ----
    // --- Chat Content ---
    containerChatContent: {
      borderRadius: Rounded.l,
      minWidth: CustomSpacing(50),
      maxWidth: dimensions.screenWidth * 0.7,
      padding: CustomSpacing(8),
      marginVertical: CustomSpacing(4),
    },
    // ---- ||| ----
    // --- Input ---
    containerInput: {
      position: 'absolute',
      width: '100%',
      padding: CustomSpacing(16),
    },
    inputBubble: {
      backgroundColor: Colors.backgroundSurface,
      paddingHorizontal: CustomSpacing(14),
      borderRadius: Rounded.l,
      justifyContent: 'space-between',
    },
    imgAddMedia: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    input: {
      ...Fonts.labelSemiBold,
      color: Colors.neutral70,
      height: CustomSpacing(55),
    },
    imgMic: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ---- ||| ----
    imgIconStore: {
      borderRadius: CustomSpacing(32),
      width: CustomSpacing(73),
      height: CustomSpacing(73),
      alignSelf: 'center',
    },
    textFoodDelivery: {
      maxWidth: dimensions.screenWidth * 0.6,
      color: Colors.successMain,
    },
    textq: {
      justifyContent: 'center',
      maxWidth: dimensions.screenWidth * 0.7,
      color: Colors.neutral90,
    },
    imgRatingIconTouch: {
      width: CustomSpacing(42),
      height: CustomSpacing(42),
      borderRadius: CustomSpacing(32),
    },
    constinerReviewRestauran: {
      borderRadius: 9,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#C2C2C2',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 8,
    },
    imgRatingIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    imgRatingIconResult: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
    },
    imgDev: {
      width: CustomSpacing(23),
      height: CustomSpacing(23),
    },
    imgLike: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
    },
    imgInfo: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    textContainer: {
      maxWidth: dimensions.screenWidth * 0.8,
    },
    textContainerOrange: {
      maxWidth: dimensions.screenWidth * 0.8,
      color: Colors.supportMain,
    },
    ButtonOrderAgain: {
      alignSelf: 'center',
      width: dimensions.screenWidth,
      padding: CustomSpacing(12),
    },
  });
};

export default styles;
