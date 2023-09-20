import {StyleSheet} from 'react-native';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing} from '@styles';

const styles = () => {
  return StyleSheet.create({
    callContainer: {
      position: 'absolute',
      bottom: CustomSpacing(0),
      padding: CustomSpacing(16),
      justifyContent: 'center',
      alignItems: 'center',
      width: dimensions.screenWidth,
      backgroundColor: '#0575E6',
    },
  });
};

export default styles;
