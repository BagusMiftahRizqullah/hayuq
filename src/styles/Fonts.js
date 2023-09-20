import {CustomSpacing} from './Spacing';
import * as Colors from './Color';
import {fs} from './Reponsive';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const baseFont = {
  color: Colors.neutral90,
  letterSpacing: RFValue(0.25),
};

const headBoldFont = {
  fontFamily: 'Poppins-Bold',
  ...baseFont,
};

const headSemiboldFont = {
  fontFamily: 'Poppins-SemiBold',
  ...baseFont,
};

const headFont = {
  fontFamily: 'Poppins-Regular',
  ...baseFont,
};

const textfont = {
  fontFamily: 'Hind-Regular',
  ...baseFont,
};

const textBoldFont = {
  fontFamily: 'Hind-Bold',
  ...baseFont,
};

const textSemiboldFont = {
  fontFamily: 'Hind-SemiBold',
  ...baseFont,
};

export const Fonts = {
  h1: {
    ...headBoldFont,
    fontSize: RFValue(34),
  },
  h2: {
    ...headSemiboldFont,
    fontSize: RFValue(34),
  },
  h3: {
    ...headFont,
    fontSize: RFValue(34),
  },
  titleL: {
    ...headFont,
    fontSize: RFValue(28),
  },
  titleM: {
    ...headFont,
    fontSize: RFValue(22),
  },
  titleMBold: {
    ...headBoldFont,
    fontSize: RFValue(22),
  },
  titleSBold: {
    ...headBoldFont,
    fontSize: RFValue(20),
  },
  titleS: {
    ...headFont,
    fontSize: RFValue(20),
  },
  headlineL: {
    ...headSemiboldFont,
    fontSize: RFValue(17),
  },
  headlineM: {
    ...textBoldFont,
    fontSize: RFValue(14),
  },
  body: {
    ...textfont,
    fontSize: RFValue(17),
  },
  bodySemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(17),
  },
  subhead: {
    ...textSemiboldFont,
    fontSize: RFValue(15),
  },
  label: {
    ...textfont,
    fontSize: RFValue(14),
  },
  labelSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(14),
  },
  captionM: {
    ...textfont,
    fontSize: RFValue(12),
  },
  captionMSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(12),
  },
  captionS: {
    ...textfont,
    fontSize: RFValue(11),
  },
  captionSSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(11),
  },
};
