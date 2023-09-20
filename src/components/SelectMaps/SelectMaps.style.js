import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    containerMap: {
      backgroundColor: Colors.neutral10,
      flex: 1,
    },
    // --- Map ---
    mapStyle: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      position: 'absolute',
      zIndex: 1,
    },
    imgMarkerLocation: {width: CustomSpacing(30), height: CustomSpacing(30)},
    containerBackIcon: {
      position: 'absolute',
      zIndex: 2,
      top: CustomSpacing(35),
      left: CustomSpacing(16),
    },
    imgBackIcon: {
      width: CustomSpacing(32),
      height: CustomSpacing(32),
      resizeMode: 'contain',
    },
    // ---- |||| ----
    // --- Bottom Sheet ---
    containerBottomSheet: {
      position: 'absolute',
      zIndex: 2,
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.neutral10,
      padding: CustomSpacing(16),
      borderTopLeftRadius: Rounded.xl,
      borderTopRightRadius: Rounded.xl,
    },
    imgLocationBottomSheet: {
      width: CustomSpacing(44),
      height: CustomSpacing(44),
    },
    // ---- |||| ----
  });
};

export default styles;
