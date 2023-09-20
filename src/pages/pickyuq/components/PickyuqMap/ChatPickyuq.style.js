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
      justifyContent: 'space-between',
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
    },
    imgMic: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
    },
    // ---- ||| ----
  });
};

export default styles;
