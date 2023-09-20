import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    searchBarContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
      flex: 1,
    },
    // --- Navigation Bar ---
    imgBackIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ---- ||| ----
    // --- Search Bar ---
    imgSearchOutlineIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    imgFilterIcon: {
      width: CustomSpacing(34),
      height: CustomSpacing(34),
      resizeMode: 'contain',
    },
    searchInput: {
      ...Fonts.labelSemiBold,
      color: Colors.neutral70,
      height: CustomSpacing(50),
    },
    // ---- ||| ----
    // --- Search Type ---
    containerSearchType: {
      borderColor: Colors.neutral30,
      paddingHorizontal: CustomSpacing(8),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.xl,
      marginRight: CustomSpacing(8),
    },
    // ---- ||| ----
    // --- Recent Search ---
    containerRecentType: {
      borderColor: Colors.neutral30,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.xl,
      marginRight: CustomSpacing(4),
      marginBottom: CustomSpacing(4),
      backgroundColor: Colors.neutral10,
      borderWidth: 1,
    },
    imgArrowDownIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    // ---- ||| ----
    // --- Trending Search ---
    containerTrendingSearch: {
      borderColor: Colors.neutral30,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.xl,
      marginRight: CustomSpacing(4),
      marginBottom: CustomSpacing(4),
      backgroundColor: Colors.neutral10,
      borderWidth: 1,
    },
    // ---- ||| ----
    // --- Search in cuisines ---
    containerSearchInCuisines: {
      marginRight: CustomSpacing(12),
      marginBottom: CustomSpacing(8),
    },
    imgCuisine: {
      width: CustomSpacing(75),
      height: CustomSpacing(75),
      borderRadius: Rounded.l,
    },
    // ---- ||| ----
    // --- Restaurant Detail ---
    containerRestaurantDetail: {
      borderTopWidth: CustomSpacing(3),
      borderTopColor: Colors.neutral30,
      marginBottom: CustomSpacing(16),
    },
    imgRestaurant: {
      width: CustomSpacing(156),
      height: CustomSpacing(85),
      borderRadius: Rounded.m,
    },
    imgTagIcon: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
    },
    restaurantRatingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryMain,
      maxWidth: CustomSpacing(60),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.l,
      position: 'absolute',
      top: CustomSpacing(4),
      right: CustomSpacing(4),
    },
    imgStarIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    // ---- ||| ----
    // --- Restaurant Dish Detail ---
    imgRestaurantDish: {
      width: CustomSpacing(62),
      height: CustomSpacing(62),
      borderRadius: Rounded.s,
    },
    // ---- ||| ----
    // --- Dish Result Detail ---
    containerDishResult: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    containerDishResultItem: {
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(8),
      borderRadius: Rounded.m,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      marginBottom: CustomSpacing(16),
    },
    imgDishResult: {
      width: dimensions.screenWidth * 0.38,
      height: dimensions.screenWidth * 0.38,
      borderRadius: Rounded.m,
    },
    discountTextContainer: {
      marginBottom:
        Platform.OS === 'ios' ? CustomSpacing(4) : CustomSpacing(10),
    },
    discountText: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    imgTagDiscountIcon: {
      width: CustomSpacing(11),
      height: CustomSpacing(11),
    },
    separator: {
      marginVertical: CustomSpacing(8),
      borderBottomColor: Colors.neutral80,
      borderBottomWidth: 0.4,
    },
    imgLogoRestaurant: {
      width: CustomSpacing(50),
      height: CustomSpacing(50),
      borderRadius: CustomSpacing(30),
    },
    dishRatingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.supportMain,
      maxWidth: CustomSpacing(60),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.l,
      position: 'absolute',
      bottom: CustomSpacing(8),
      right: CustomSpacing(8),
    },
    // ---- ||| ----
  });
};

export default styles;
