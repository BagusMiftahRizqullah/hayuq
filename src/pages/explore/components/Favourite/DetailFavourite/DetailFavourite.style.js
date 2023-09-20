import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // --- Navigation Bar ---
    imgBgFavorite: {
      width: dimensions.screenWidth,
      height: CustomSpacing(124),
    },
    navigationBarContainer: {
      position: 'absolute',
      bottom: 0,
      justifyContent: 'space-between',
      padding: CustomSpacing(16),
      width: dimensions.screenWidth,
    },
    iconNavigation: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
    },
    // ---- ||| ----
    // --- Content ---
    contentTitle: {
      paddingHorizontal: CustomSpacing(16),
      paddingTop: CustomSpacing(16),
    },
    // ---- ||| ----
    // --- List Restaurant ---
    containerListRestaurant: {
      padding: CustomSpacing(16),
    },
    containerDetailRestaurant: {
      paddingBottom: CustomSpacing(8),
      borderBottomWidth: 0.7,
      borderBottomColor: Colors.neutral40,
    },
    restaurantRatingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryMain,
      maxWidth: CustomSpacing(60),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.l,
    },
    imgStarIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    imgSuperIcon: {
      width: CustomSpacing(20),
      height: CustomSpacing(20),
    },
    // ---- ||| ----
    // --- List Food ---
    containerListFood: {
      paddingVertical: CustomSpacing(8),
    },
    containerImgFoodThumbnail: {
      marginTop: CustomSpacing(5),
      alignSelf: 'flex-start',
    },
    imgFoodThumbnail: {
      width: CustomSpacing(80),
      height: CustomSpacing(80),
      borderRadius: Rounded.m,
    },
    containerDescriptionFood: {
      maxWidth: dimensions.screenWidth * 0.65,
    },
    discountTextContainer: {
      marginBottom:
        Platform.OS === 'ios' ? CustomSpacing(4) : CustomSpacing(10),
    },
    discountText: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    imgTagIcon: {
      width: CustomSpacing(11),
      height: CustomSpacing(11),
    },
    loveContainer: {
      width: CustomSpacing(26),
      height: CustomSpacing(26),
      backgroundColor: Colors.backgroundMain,
      borderRadius: Rounded.xl,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgLoveIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
    },
    containerDivider: {
      width: '100%',
      height: CustomSpacing(4),
      backgroundColor: Colors.neutral40,
    },
    // ------ Bottom Sheet ------
    bottomSheetContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      paddingTop: CustomSpacing(24),
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
      marginBottom: dimensions.screenHeight * 0.35,
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral40,
      paddingBottom: CustomSpacing(5),
    },

    // ------ |||| ------
  });
};

export default styles;
