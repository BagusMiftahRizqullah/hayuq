import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Fonts, CustomSpacing} from '@styles';
import {HStack, Spacer, Button, VStack} from '@components';

const Main = () => {
  return (
    <View
      style={{
        padding: CustomSpacing(20),
      }}>
      <Spacer topSafeAreaHeight />
      <ScrollView
        style={{
          height: '100%',
        }}>
        <VStack vertical={CustomSpacing(10)}>
          <Button label="Primary" type="primary" size="large" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="Primary medium" type="primary" size="medium" />
          <Spacer height={CustomSpacing(20)} />
          <Button
            label="Primary medium icon"
            type="primary"
            size="medium"
            icon
          />
          <Spacer height={CustomSpacing(20)} />
          <Button label="Primary regular" type="primary" size="regular" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="Primary small" type="primary" size="small" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="Pxsmall" type="primary" size="xsmall" />
        </VStack>
        <VStack vertical={CustomSpacing(10)}>
          <Button label="Secondary" type="secondary" size="large" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="sec medium" type="secondary" size="medium" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="sec medium icon" type="secondary" size="medium" icon />
          <Spacer height={CustomSpacing(20)} />
          <Button label="sec regular" type="secondary" size="regular" />
        </VStack>
        <VStack vertical={CustomSpacing(10)}>
          <Button label="Primary small" type="support" size="small" />
          <Spacer height={CustomSpacing(20)} />
          <Button label="Pxsmall" type="support" size="xsmall" />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default Main;
