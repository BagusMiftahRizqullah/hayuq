import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    restaurantContainer: {
      flex: 1,
      backgroundColor: Colors.backgroundBorder,
    },
    imgProfileBg: {
      width: dimensions.screenWidth,
      height: dimensions.screenWidth * 0.4,
    },
    actionPosition: {
      position: 'absolute',
      bottom: dimensions.screenWidth * 0.15,
      paddingHorizontal: CustomSpacing(16),
      justifyContent: 'space-between',
      width: dimensions.screenWidth,
    },
    actionContainer: {
      width: CustomSpacing(40),
      height: CustomSpacing(40),
      backgroundColor: Colors.neutral10,
      borderRadius: CustomSpacing(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainerRestaurant: {
      position: 'absolute',
      top: -CustomSpacing(30),
      left: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.xl,
      width: dimensions.screenWidth - CustomSpacing(32),
      shadowColor: '#20252ad9',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    imgAvatar: {
      width: CustomSpacing(80),
      height: CustomSpacing(80),
      borderRadius: CustomSpacing(80),
      backgroundColor: Colors.neutral10,
      position: 'absolute',
      top: -CustomSpacing(20),
      left: CustomSpacing(16),
      borderWidth: 1,
      borderColor: Colors.neutral40,
    },
    detailContainer: {
      backgroundColor: Colors.neutral20,
      borderBottomLeftRadius: Rounded.xl,
      borderBottomRightRadius: Rounded.xl,
      paddingHorizontal: CustomSpacing(16),
      justifyContent: 'space-between',
      paddingVertical: CustomSpacing(8),
    },
    ratingContainer: {
      backgroundColor: Colors.primaryMain,
      borderRadius: Rounded.xl,
      paddingHorizontal: CustomSpacing(10),
      paddingVertical: CustomSpacing(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    separatorDetail: {
      width: 1,
      height: CustomSpacing(50),
      backgroundColor: Colors.neutral40,
    },
    totalLikesContainer: {
      backgroundColor: Colors.supportMain,
      borderRadius: Rounded.xl,
      paddingHorizontal: CustomSpacing(10),
      paddingVertical: CustomSpacing(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      padding: CustomSpacing(16),
    },
    voucherContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
      borderRadius: Rounded.xl,
      width: dimensions.screenWidth - CustomSpacing(32),
      shadowColor: '#20252ad9',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      justifyContent: 'space-around',
    },
    viewAllIcon: {
      width: CustomSpacing(21),
      height: CustomSpacing(21),
      backgroundColor: Colors.secondarySurface,
      borderRadius: CustomSpacing(40),
      justifyContent: 'center',
      alignItems: 'center',
    },
    titlePromo: {
      padding: CustomSpacing(8),
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral50,
      borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    },
    promoCard: {
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(8),
      maxWidth: CustomSpacing(133),
      borderRadius: Rounded.l,
      shadowColor: '#20252ad9',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    imgTagIcon: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
    },
    actionBarParalaxContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? -CustomSpacing(140) : -CustomSpacing(120),
      backgroundColor: Colors.neutral10,
      width: '100%',
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(8),
    },
    renderSectionContainer: {
      paddingVertical: CustomSpacing(16),
      borderBottomColor: Colors.neutral40,
    },
    imgRenderSection: {
      width: CustomSpacing(86),
      height: CustomSpacing(86),
      borderRadius: Rounded.l,
    },
    // --- Restaurant Detail ---
    imgAvatarDetail: {
      width: CustomSpacing(80),
      height: CustomSpacing(80),
      borderRadius: CustomSpacing(80),
      backgroundColor: Colors.neutral10,
      position: 'absolute',
      top: -CustomSpacing(20),
      left: dimensions.screenWidth / 2 - CustomSpacing(56),
      borderWidth: 1,
      borderColor: Colors.neutral40,
    },
    // --- Search Food ---
    searchFoodContainer: {
      backgroundColor: Colors.neutral10,
    },
    headerContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
    },
    searchContainer: {
      backgroundColor: Colors.neutral40,
      borderRadius: Rounded.xl,
      width: dimensions.screenWidth - CustomSpacing(91),
      paddingHorizontal: CustomSpacing(16),
    },
    textInputStyle: {
      ...Fonts.labelSemiBold,
      color: Colors.neutral70,
      height: CustomSpacing(50),
      width: '80%',
    },
    containerTagDiscount: {
      width: CustomSpacing(72),
      padding: CustomSpacing(4),
      borderRadius: Rounded.xl,
      backgroundColor: Colors.supportSurface,
      alignItems: 'center',
    },
    textDeduction: {
      color: Colors.neutral60,
      fontSize: 12,
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      paddingBottom: CustomSpacing(8),
    },
    containerFavorites: {
      paddingVertical: CustomSpacing(4),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: Rounded.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgShareIcon: {
      width: CustomSpacing(28),
      height: CustomSpacing(28),
    },
    containerShare: {
      paddingVertical: CustomSpacing(4),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: Rounded.xl,
      alignItems: 'center',
      borderColor: Colors.neutral70,
      borderWidth: CustomSpacing(1),
    },
    itemContainer: {
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
    },
    notes: {
      alignSelf: 'flex-start',
      borderColor: Colors.neutral40,
      borderRadius: CustomSpacing(8),
      borderWidth: CustomSpacing(2),
      height: dimensions.screenWidth - CustomSpacing(250),
      width: dimensions.screenWidth - CustomSpacing(32),
      padding: CustomSpacing(16),
      textAlignVertical: 'top',
    },
    ButtonAddtoCart: {
      alignSelf: 'center',
      width: dimensions.screenWidth,
      padding: CustomSpacing(12),
    },
    bottomSheetContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      paddingTop: CustomSpacing(24),
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
  });
};

export default styles;