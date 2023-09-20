import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    // ------ Explore Container ------
    exploreContainer: {
      flex: 1,
      backgroundColor: Colors.neutral10,
    },
    // ------ Explore Header ------
    imgHeaderBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.4,
    },
    // ------ |||| ------
    // ------ Set Delivery Address ------
    deliveryAddressContainer: {
      top: CustomSpacing(-36),
      backgroundColor: Colors.primaryMain,
    },
    deliveryAddressContainerHead: {
      paddingTop: CustomSpacing(Platform.OS === 'ios' ? 32 : 8),
      position: 'absolute',
    },
    deliveryAddressContent: {
      padding: CustomSpacing(16),
      paddingBottom: CustomSpacing(35),
    },
    imgLocationIcon: {
      width: CustomSpacing(14),
      height: CustomSpacing(14),
      resizeMode: 'contain',
    },
    imgChevronDownIcon: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
      resizeMode: 'contain',
    },
    imgFavoriteIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Search Bar ------
    searchBarContainer: {
      backgroundColor: Colors.neutral10,
      height: CustomSpacing(52),
      borderRadius: Rounded.l,
      padding: CustomSpacing(14),
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgSearchOutlineIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
      resizeMode: 'contain',
    },
    searchInput: {
      ...Fonts.label,
      color: Colors.neutral70,
      height: CustomSpacing(50),
    },
    // ------ |||| ------
    // ------ Explore Menu ------
    containerMenu: {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    containerIcon: {
      width: CustomSpacing(80),
      height: CustomSpacing(74),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: CustomSpacing(8),
    },
    imgIconMenu: {
      width: CustomSpacing(50),
      height: CustomSpacing(50),
    },
    // ------ |||| ------
    // ------  Recomended ------
    titleRecomended: {
      padding: CustomSpacing(13),
      justifyContent: 'space-between',
    },
    containerRecomended: {
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
    imgFoodRecomended: {
      width: dimensions.screenWidth * 0.38,
      height: dimensions.screenWidth * 0.38,
      borderRadius: Rounded.m,
    },
    likeContainer: {
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
    imgLikeIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    imgTagIcon: {
      width: CustomSpacing(11),
      height: CustomSpacing(11),
    },
    imgShopicon: {
      width: CustomSpacing(10),
      height: CustomSpacing(10),
    },
    // ------ |||| ------
    // ------  Order Voucher ------
    containerOrderVoucherCard: {
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(8),
      borderRadius: Rounded.s,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 9,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    imgFoodVoucher: {
      alignSelf: 'center',
      width: dimensions.screenWidth * 0.4,
      height: dimensions.screenWidth * 0.22,
      borderRadius: Rounded.s,
    },
    containerTagPromotion: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.supportMain,
      maxWidth: CustomSpacing(100),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.s,
      position: 'absolute',
      top: CustomSpacing(4),
      left: CustomSpacing(4),
    },
    containerRatingVoucher: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryMain,
      maxWidth: CustomSpacing(60),
      paddingVertical: CustomSpacing(2),
      paddingHorizontal: CustomSpacing(8),
      borderRadius: Rounded.l,
    },
    imgStarIcon: {
      width: CustomSpacing(10),
      height: CustomSpacing(10),
    },
    imgVoucherBg: {
      paddingVertical: CustomSpacing(10),
      height: dimensions.screenWidth * 0.52,
    },
    // ------ |||| ------
    // ------  Most Liked ------
    imgMostLikedBg: {
      paddingVertical: CustomSpacing(10),
      height:
        Platform.OS === 'ios'
          ? dimensions.screenWidth * 0.72
          : dimensions.screenWidth * 0.7,
    },
    containerMostLikedCard: {
      maxWidth: CustomSpacing(153),
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
    imgMostLikedFood: {
      alignSelf: 'center',
      width: dimensions.screenWidth * 0.3,
      height: dimensions.screenWidth * 0.3,
      borderRadius: Rounded.m,
    },
    containerLikeMostLiked: {
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
    // ------ |||| ------
    // ------  Popular ------
    imgFoodPopular: {
      alignSelf: 'center',
      width: dimensions.screenWidth * 0.25,
      height: dimensions.screenWidth * 0.25,
      borderRadius: Rounded.s,
    },
    // ------ |||| ------
    // ------ Verify Email ------
    verifyEmailContainer: {
      backgroundColor: Colors.supportSurface,
      paddingVertical: CustomSpacing(10),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: Rounded.l,
    },
    // ------ |||| ------
    // ------ Rate your Order ------
    containerCardRateOrder: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.xl,
      shadowColor: Colors.neutral70,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      padding: CustomSpacing(18),
      marginHorizontal: CustomSpacing(18),
    },
    imgIconOrder: {
      borderRadius: CustomSpacing(23),
      width: CustomSpacing(50),
      height: CustomSpacing(50),
    },
    imgArrowOrder: {
      width: CustomSpacing(20),
      height: CustomSpacing(20),
    },
    imgRatingIconTouch: {
      width: CustomSpacing(30),
      height: CustomSpacing(30),
      marginRight: CustomSpacing(8),
    },
    containerRateOrder: {
      backgroundColor: Colors.neutral10,
      paddingVertical: CustomSpacing(16),
      paddingHorizontal: CustomSpacing(12),
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
    // ------ |||| ------
    // ------ |||| ------
    // ------ Rate your Order ------
    imgBanner: {
      alignSelf: 'center',
      width: CustomSpacing(318),
      height: CustomSpacing(125),
      borderRadius: Rounded.s,
    },
    containerimgBanner: {
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.m,
    },
    imgGoback: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ------ |||| ------
  });
};

export default styles;
