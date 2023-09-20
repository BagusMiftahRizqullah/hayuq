import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';
import {RFValue} from 'react-native-responsive-fontsize';

const styles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.neutral10,
      height: '100%',
    },
    // ------ New Header  ------
    backgroundHeader: {
      top: CustomSpacing(Platform.OS == 'ios' ? -36 : 0),
      width: dimensions.screenWidth,
      height: CustomSpacing(170),
      paddingVertical: CustomSpacing(24),
      paddingHorizontal: CustomSpacing(16),
    },
    navigationBack: {
      paddingTop: CustomSpacing(Platform.OS == 'ios' ? 18 : 0),
    },
    navigationBackText: {
      fontSize: RFValue(17),
      fontFamily: 'Poppins-Bold',
      color: Colors.neutral10,
    },
    imgEyeBalance: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
      marginLeft: CustomSpacing(13),
      marginTop: CustomSpacing(-10),
    },
    // ------ |||| ------
    // ------ Navigation Bar  ------
    NavigatorContainer: {
      justifyContent: 'space-between',
      padding: CustomSpacing(16),
      backgroundColor: Colors.neutral10,
    },
    imgCloseIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      marginRight: CustomSpacing(15),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    imgBillIcon: {
      width: dimensions.screenWidth * 0.66,
      height: dimensions.screenWidth * 0.45,
    },
    // ------ Filter ------
    containerFilter: {
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.xl,
      marginRight: CustomSpacing(4),
      marginBottom: CustomSpacing(4),
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imgChevronDown: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    containerClearFilter: {
      borderColor: Colors.dangerMain,
      paddingHorizontal: CustomSpacing(16),
      paddingVertical: CustomSpacing(4),
      borderRadius: Rounded.xl,
      marginRight: CustomSpacing(4),
      marginBottom: CustomSpacing(4),
      backgroundColor: Colors.neutral10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // ------ |||| ------
    // ------ Date Filter ------
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
    dateContainer: {
      borderWidth: 1,
      borderColor: Colors.neutral50,
      padding: CustomSpacing(8),
      width: dimensions.screenWidth * 0.5 - CustomSpacing(24),
    },
    imgTickCircle: {
      position: 'absolute',
      width: CustomSpacing(20),
      height: CustomSpacing(20),
      bottom: CustomSpacing(0),
      right: CustomSpacing(0),
    },
    // ------ |||| ------
    // ------ History Data List ------
    containerSectionList: {
      paddingVertical: CustomSpacing(8),
      paddingHorizontal: CustomSpacing(16),
      // height: '100%',
    },
    renderSectionListItemContainer: {
      paddingVertical: CustomSpacing(8),
    },
    containerImg: {
      padding: CustomSpacing(8),
      borderRadius: Rounded.xl,
      alignSelf: 'flex-start',
    },
    imgIconBill: {
      width: CustomSpacing(18),
      height: CustomSpacing(18),
    },
    containerDetail: {
      width: dimensions.screenWidth - CustomSpacing(80),
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.neutral50,
      paddingBottom: CustomSpacing(8),
    },
    // ------ |||| ------
    // ------ Transaction Receipt ------
    containerNavigator: {
      justifyContent: 'space-between',
      padding: CustomSpacing(16),
    },
    containerReceipt: {
      width: dimensions.screenWidth * 0.82,
      borderRadius: CustomSpacing(20),
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(20),
      alignItems: 'center',
    },
    containerIconReceipt: {
      borderRadius: CustomSpacing(100),
      backgroundColor: Colors.supportSurface,
      width: CustomSpacing(68),
      height: CustomSpacing(68),
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgIconReceipt: {
      width: CustomSpacing(44),
      height: CustomSpacing(44),
    },
    containerFirstLayerReceipt: {
      paddingVertical: CustomSpacing(8),
      paddingHorizontal: CustomSpacing(12),
      borderRadius: CustomSpacing(16),
    },
    containerSecondLayerReceipt: {
      padding: CustomSpacing(8),
      borderRadius: CustomSpacing(16),
    },
    containerMenu: {
      width: dimensions.screenWidth * 0.82,
      padding: CustomSpacing(20),
    },
    triangleCorner: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderRightWidth: CustomSpacing(9),
      borderBottomWidth: CustomSpacing(18),
      borderLeftWidth: CustomSpacing(9),
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: Colors.primaryMain,
      borderLeftColor: 'transparent',
    },
    receiptBg: {
      position: 'absolute',
      bottom: CustomSpacing(100) * -1,
      left: CustomSpacing(50) * -1,
      zIndex: 1,
    },
    imgReceiptBg: {
      width: dimensions.screenWidth * 1.15,
      height: dimensions.screenWidth * 2,
    },
    // ------ |||| ------
    // ------ Button Topup -----
    buttonTopUp: {
      borderRadius: CustomSpacing(30),
      position: 'absolute',
      bottom: CustomSpacing(30),
      width: 'auto',
      paddingHorizontal: CustomSpacing(15),
      marginHorizontal: 'auto',
    },
    // ------ |||| ------
    // ------ Btn Topup Icon -----
    btnTopUpIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      marginRight: CustomSpacing(7),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ Form Topup ------
    containerNavigatorForm: {
      justifyContent: 'space-between',
      paddingVertical: CustomSpacing(12),
    },
    imgCloseTopUpForm: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    inputAmountTopUp: {
      borderBottomColor: Colors.neutral40,
      borderBottomWidth: 0.8,
      ...Fonts.titleMBold,
      paddingVertical: CustomSpacing(2),
      marginTop: CustomSpacing(5),
    },
    containerCardAmountTopUp: {
      marginVertical: CustomSpacing(10),
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    cardAmountTopUp: {
      width: dimensions.screenWidth / 3 - 19,
      paddingVertical: CustomSpacing(8),
      marginBottom: CustomSpacing(14),
      border: CustomSpacing(1),
      borderColor: Colors.neutral40,
      borderWidth: 0.8,
      borderRadius: CustomSpacing(4),
      ...Fonts.captionMSemiBold,
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexDirection: 'row',
      elevation: 0.4,
    },
    inputSelectMethod: {
      backgroundColor: Colors.neutral20,
      padding: CustomSpacing(16),
      marginBottom: CustomSpacing(30),
      borderTopColor: Colors.neutral40,
      borderTopWidth: 0.8,
      borderBottomColor: Colors.neutral40,
      borderBottomWidth: 0.8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    arrowDownIcon: {
      width: CustomSpacing(15),
      height: CustomSpacing(15),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    // ------ topup method modal -----
    labelMinimumTopUp: {
      ...Fonts.subhead,
      paddingVertical: CustomSpacing(10),
      paddingHorizontal: CustomSpacing(16),
      backgroundColor: Colors.neutral30,
    },
    containerListBank: {
      paddingVertical: CustomSpacing(19),
      borderBottomWidth: 0.8,
      borderBottomColor: Colors.neutral40,
      flexDirection: 'row',
    },
    iconBank: {
      width: CustomSpacing(57),
      height: CustomSpacing(13),
      resizeMode: 'contain',
    },
    btnChange: {
      ...Fonts.subhead,
      backgroundColor: Colors.secondarySurface,
      color: Colors.secondaryMain,
      paddingHorizontal: CustomSpacing(15),
      paddingVertical: CustomSpacing(6),
      borderRadius: CustomSpacing(16),
    },
    imgRatingIcon: {
      width: CustomSpacing(12),
      height: CustomSpacing(12),
    },
    // ------ |||| ------
  });
};

export default styles;
