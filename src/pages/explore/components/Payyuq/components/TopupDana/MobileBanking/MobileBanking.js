import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, ToastAndroid, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import Clipboard from '@react-native-clipboard/clipboard';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {IconBRI, IconBCA, Ellipse, BackIcon, Copy} from '@assets';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './MobileBanking.style';

const MobileBanking = observer(() => {
  const componentStyles = styles();
  const navigation = useNavigation();
  const [activeSections, setActiveSections] = useState([]);

  const goBack = () => {
    navigation.goBack();
  };

  const copyToClipboard = async () => {
    console.log('copy No Virtua Account');
    Clipboard.setString('HAYUQ1192');
    ToastAndroid.showWithGravity(
      'Copy',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    console.log('copy No Virtua Account', text);
    setCopiedCode(text);
  };

  const methodList = [
    {
      id: 1,
      title: 'BRI Mobile',
      icon: IconBRI,
      noVA: '000081287318211',
      content: [
        'Login ke akun BRI Mobile anda',
        'Pilih Menu Dompet Digital',
        'Pilih Payyuq Masukkan nomor ponsel Anda:000008Xx-xxxx-xxxx',
        'Masukkan nominal Top up dan Pilih sumber dana',
        'Ikuti intruksi untuk menyelesaikan transaksi',
      ],
    },
    {
      id: 2,
      title: 'BRI Internet Banking',
      icon: IconBRI,
      noVA: '000003332244411',
      content: [
        'Masukkan kartu ATM dan PIN BRI Anda',
        'Pilih Menu Transaksi Linnya',
        'Pilih Menu Transfer',
        'Pilih Menu Ke Rek BRI Virtuan Account',
        'Masukkan 0000 + nomor ponsel Anda:000008Xx-xxxx-xxxx',
        'Masukkan Nominal Top up',
        'Ikuti intruksi untuk menyelesaikan transaksi',
      ],
    },
    {
      id: 3,
      title: 'BCA Mobile',
      icon: IconBCA,
      noVA: '00000667722883399',
      content: [
        'Login ke akun BCA Mobile anda',
        'Pilih Menu Dompet Digital',
        'Pilih Payyuq Masukkan nomor ponsel Anda:000008Xx-xxxx-xxxx',
        'Masukkan nominal Top up dan Pilih sumber dana',
        'Ikuti intruksi untuk menyelesaikan transaksi',
      ],
    },
  ];

  const NavigatorBar = () => {
    return (
      <HStack style={componentStyles.NavigatorContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
          <FastImage source={BackIcon} style={componentStyles.imgCloseIcon} />
        </TouchableOpacity>

        <Text style={[Fonts.subhead]}>Internet / Mobile Banking</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  const renderHeader = (section, index, isActive) => {
    return (
      <VStack>
        <HStack
          style={{
            justifyContent: 'space-between',
          }}>
          <HStack>
            <FastImage
              source={section.icon}
              style={componentStyles.imgIconMethod}
              resizeMode="contain"
            />
            <Spacer width={CustomSpacing(8)} />
            <Text style={[Fonts.subhead]}>{section.title}</Text>
          </HStack>
          <Icon
            name={isActive ? 'down' : 'right'}
            size={18}
            color={Colors.neutral80}
          />
        </HStack>
        <Spacer height={CustomSpacing(12)} />
      </VStack>
    );
  };

  const renderContent = (section, index) => {
    return (
      <VStack
        style={{
          marginBottom: index === 0 ? CustomSpacing(12) : 0,
        }}>
        <Spacer height={CustomSpacing(4)} />
        <Text
          style={[
            Fonts.subhead,
          ]}>{`${section.title} Virtual Account Number`}</Text>
        <Spacer height={CustomSpacing(8)} />

        <HStack style={componentStyles.containerVA}>
          <Text style={[Fonts.subhead]}>{section?.noVA}</Text>
          <TouchableOpacity onPress={() => copyToClipboard()}>
            <FastImage
              source={Copy}
              style={componentStyles.imgIconCopy}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </HStack>

        <Spacer height={CustomSpacing(12)} />

        <HStack style={componentStyles.containerHeadSteps}>
          <FastImage
            source={section.icon}
            style={componentStyles.imgIconMethod}
            resizeMode="contain"
          />
          <Spacer width={CustomSpacing(8)} />
          <Text style={[Fonts.subhead]}>ATM</Text>
        </HStack>

        <VStack style={componentStyles.containerSteps}>
          {section.content?.map((v, i) => {
            return (
              <VStack>
                <HStack>
                  <FastImage
                    source={Ellipse}
                    style={componentStyles.imgIconSteps}
                    resizeMode="contain"
                  />
                  <Spacer width={CustomSpacing(8)} />
                  <Text style={[Fonts.captionM]}>{v}</Text>
                </HStack>
                <Spacer height={CustomSpacing(12)} />
              </VStack>
            );
          })}
          <VStack>
            <Text style={[Fonts.captionM, Colors.neutral70]}>Catatan:</Text>
            <HStack>
              <Text>•</Text>
              <Spacer width={CustomSpacing(4)} />
              <Text style={[Fonts.captionM, Colors.neutral80]}>
                Minimum top-up Rp 20.000.
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <VStack style={componentStyles.container}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />

      {/* ------ Top Up Method ------ */}
      <VStack
        style={{
          padding: CustomSpacing(16),
        }}>
        <Spacer height={CustomSpacing(12)} />
        <VStack style={componentStyles.containerMethodList}>
          <Accordion
            duration={700}
            activeSections={activeSections}
            sections={methodList}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            underlayColor={Colors.neutral20}
          />
        </VStack>
      </VStack>
    </VStack>
  );
});

export default MobileBanking;
