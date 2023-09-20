import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
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
    },
    inputContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.neutral40,
      paddingBottom: CustomSpacing(5),
    },
    imgBackIcon: {
      width: CustomSpacing(24),
      height: CustomSpacing(24),
      resizeMode: 'contain',
    },
    // ------ |||| ------
    imgCapsuleIcon: {
      width: CustomSpacing(16),
      height: CustomSpacing(16),
    },
    filterCapsuleLeftStyle: {
      borderRightWidth: 0,
      borderWidth: 1,
      borderColor: Colors.neutral50,
      borderTopLeftRadius: 100,
      borderBottomLeftRadius: 100,
      paddingVertical: CustomSpacing(6),
      paddingHorizontal: CustomSpacing(14),
    },
    filterCapsuleRightStyle: {
      borderWidth: 1,
      borderColor: Colors.neutral50,
      borderTopRightRadius: 100,
      borderBottomRightRadius: 100,
      paddingVertical: CustomSpacing(6),
      paddingHorizontal: CustomSpacing(14),
    },
    filterCapsuleStyle: {
      borderWidth: 1,
      borderColor: Colors.neutral50,
      borderRadius: 100,
      paddingVertical: CustomSpacing(6),
      paddingHorizontal: CustomSpacing(14),
    },
  });
};

export default styles;
