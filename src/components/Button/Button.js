import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Layout, Spacing, Colors, Fonts, Rounded} from '@styles';
import {HStack, Spacer} from '@components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CustomSpacing} from '../../styles/Spacing';

const BaseButton = ({
  children,
  style,
  disabled,
  isSubmitting,
  activeOpacity,
  label,
  type = 'primary',
  size = 'large',
  icon,
  ...props
}) => {
  let buttonBorderColor;
  let buttonBorderWidth = 0;
  let buttonColor;
  let buttonSize;
  let textColor = Colors.neutral90;
  let roundedButton = Rounded.m;
  let textFont = Fonts.subhead;
  let heightButton = CustomSpacing(48);
  let paddingButton = CustomSpacing(12);
  let loadingSize = 'small';

  switch (true) {
    case type == 'primary':
      buttonColor = Colors.primaryMain;
      break;
    case type == 'secondary':
      buttonColor = Colors.primarySurface;
      break;
    case type == 'support':
      buttonColor = Colors.secondaryMain;
      textColor = Colors.neutral10;
      break;
    case type == 'supportOpacity':
      buttonColor = Colors.secondarySurface;
      textColor = Colors.secondaryMain;
      break;
    case type == 'danger':
      buttonColor = Colors.dangerMain;
      textColor = Colors.neutral10;
      break;
    case type == 'dangerOutline':
      buttonColor = Colors.neutral10;
      textColor = Colors.dangerMain;
      buttonBorderWidth = 1;
      buttonBorderColor = Colors.dangerMain;
      break;
    default:
      buttonColor = Colors.primaryMain;
      textColor = Colors.neutral90;
      break;
  }
  switch (true) {
    case size == 'large':
      buttonSize = '100%';
      break;
    case size == 'regular':
      buttonSize = '45%';
      break;
    case size == 'medium':
      buttonSize = '70%';
      break;
    case size == 'small':
      buttonSize = '30%';
      roundedButton = Rounded.xl;
      textFont = Fonts.captionMSemiBold;
      heightButton = CustomSpacing(30);
      paddingButton = CustomSpacing(5);
      loadingSize = 'small';
      break;
    case size == 'xsmall':
      buttonSize = '20%';
      roundedButton = Rounded.xl;
      textFont = Fonts.captionMSemiBold;
      heightButton = CustomSpacing(30);
      paddingButton = CustomSpacing(5);
      loadingSize = 'small';
      break;
    case size == 'xsmall-s':
      buttonSize = '20%';
      roundedButton = 32;
      textFont = Fonts.captionMSemiBold;
      heightButton = CustomSpacing(18);
      paddingButton = CustomSpacing(5);
      loadingSize = 'small';
      break;
    default:
      buttonSize = '100%';
      break;
  }

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={activeOpacity || 0.7}
      disabled={disabled || isSubmitting}
      style={StyleSheet.flatten([
        {
          borderWidth: buttonBorderWidth,
          borderColor: buttonBorderColor,
          padding: paddingButton,
          width: buttonSize,
          backgroundColor: buttonColor,
          minHeight: heightButton,
          borderRadius: roundedButton,
          opacity: disabled || isSubmitting ? 0.5 : 1,
          shadowColor: Colors.neutral80,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        },
        Layout.flexCenterMid,
        style,
      ])}>
      {isSubmitting ? (
        <HStack>
          <ActivityIndicator color={Colors.neutral90} size={loadingSize} />
          <Spacer width={Spacing[8]} />
          {icon && (
            <>
              <Icon name="download" size={10} color={textColor} />
              <Spacer width={Spacing[8]} />
            </>
          )}
          <Text style={[textFont, {color: textColor}]}>{label}</Text>
        </HStack>
      ) : (
        <HStack>
          {children}
          {icon && (
            <>
              <Icon name="download" size={10} color={Colors.neutral70} />
              <Spacer width={Spacing[8]} />
            </>
          )}
          <Text style={[textFont, {color: textColor}]}>{label}</Text>
        </HStack>
      )}
    </TouchableOpacity>
  );
};

export default BaseButton;
