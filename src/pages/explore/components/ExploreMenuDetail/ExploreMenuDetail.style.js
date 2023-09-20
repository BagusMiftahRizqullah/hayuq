import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Navigator & Search Bar ------
    navigatorContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.primaryMain,
    },
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    searchBarContainer: {
      backgroundColor: Colors.neutral10,
      paddingHorizontal: CustomSpacing(16),
      borderRadius: Rounded.xl,
      justifyContent: 'space-between',
    },
    imgSearchIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    searchInput: {
      ...Fonts.label,
      color: Colors.neutral70,
      height: CustomSpacing(50),
    },
    imgFilterIcon: {
      width: CustomSpacing(34),
      height: CustomSpacing(34),
      resizeMode: 'contain',
    },
    dotFilter: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: Colors.supportMain,
      width: CustomSpacing(12),
      height: CustomSpacing(12),
      borderRadius: CustomSpacing(12),
    },
    // ------ |||| ------
    // ------ Content------
    containerScrollContent: {
      height: '100%',
      paddingHorizontal: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
    },
    containerContent: {
      borderTopWidth: CustomSpacing(3),
      borderTopColor: Colors.neutral30,
      marginBottom: CustomSpacing(16),
    },
    imgContent: {
      width: CustomSpacing(156),
      height: CustomSpacing(85),
      borderRadius: Rounded.m,
    },
    ratingContainer: {
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
    hayuqPartnerContainer: {
      backgroundColor: Colors.supportMain,
      borderBottomLeftRadius: Rounded.l,
      borderBottomRightRadius: Rounded.l,
      height: CustomSpacing(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgWhiteSuper: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
    },
    // ------ |||| ------
    // ------ Cuisine Render ------
    containerCuisineCard: {
      paddingVertical: CustomSpacing(8),
      paddingHorizontal: CustomSpacing(8),
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.m,
      marginVertical: CustomSpacing(8),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgCuisineType: {
      width: CustomSpacing(84),
      height: CustomSpacing(84),
      borderRadius: Rounded.m,
    },
    imgIconCuisine: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
    },
    // ------ |||| ------
    // ------ Popular Render ------
    imgLogoMerchant: {
      width: CustomSpacing(75),
      height: CustomSpacing(75),
    },
    containerPopularRating: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryMain,
      maxWidth: CustomSpacing(60),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.l,
      position: 'absolute',
      bottom: CustomSpacing(2) * -1,
      left: CustomSpacing(12),
      minWidth: CustomSpacing(50),
    },
    imgIconLike: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
    },

    // ------ |||| ------
    // ------ Reorder Render ------
    imgDishReorder: {
      width: dimensions.screenWidth * 0.15,
      height: dimensions.screenWidth * 0.15,
      borderRadius: Rounded.m,
    },
    // ------ |||| ------
    // ------ Most Liked Render ------
    containerMostLiked: {
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
    imgDishMostLiked: {
      width: dimensions.screenWidth * 0.38,
      height: dimensions.screenWidth * 0.38,
      borderRadius: Rounded.m,
    },
    containerTotalLike: {
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
    imgLikedIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    containerDiscount: {
      marginBottom:
        Platform.OS === 'ios' ? CustomSpacing(4) : CustomSpacing(10),
    },
    discountText: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    imgTagLikedIcon: {
      width: CustomSpacing(11),
      height: CustomSpacing(11),
    },
    containerLogoMerchantLiked: {
      marginVertical: CustomSpacing(8),
      borderBottomColor: Colors.neutral80,
      borderBottomWidth: 0.4,
    },
    imgMerchantLogo: {
      width: CustomSpacing(50),
      height: CustomSpacing(50),
      borderRadius: CustomSpacing(30),
    },
    containerFlatlistMostliked: {
      height: '100%',
      padding: CustomSpacing(16),
      backgroundColor: Colors.backgroundSurface,
      flexDirection: 'column',
      marginBottom: CustomSpacing(16),
    },
    // ------ No Order ------
    imgBillIcon: {
      width: dimensions.screenWidth * 0.46,
      height: dimensions.screenWidth * 0.67,
    },
    // ------ |||| ------
  });
};

export default styles;
