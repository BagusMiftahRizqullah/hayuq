import {StyleSheet, Platform} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Colors, Rounded, Fonts} from '@styles';

const styles = () => {
  return StyleSheet.create({
    renderSubtitle: {
      height: CustomSpacing(60),
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgBg: {
      width: '100%',
      height: '100%',
    },
    containerBoarding: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: Colors.neutral10,
      width: dimensions.screenWidth,
      height: Platform.OS === 'ios' ? '50%' : '50%',
      borderTopLeftRadius: Rounded.l,
      borderTopRightRadius: Rounded.l,
    },
    containerCarousel: {
      padding: CustomSpacing(16),
      alignItems: 'center',
      marginBottom: CustomSpacing(16),
    },
    paginationDot: {
      alignItems: 'center',
    },
  });
};

export default styles;
