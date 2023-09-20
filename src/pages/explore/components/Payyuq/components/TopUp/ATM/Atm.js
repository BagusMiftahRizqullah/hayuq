import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {IconBRI, IconBCA, Ellipse, BackIcon} from '@assets';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './Atm.style';

const Atm = observer(() => {
  const componentStyles = styles();
  const navigation = useNavigation();
  const [activeSections, setActiveSections] = useState([]);
  //   const [dropDown, setDropdown] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const methodList = [
    {
      id: 1,
      title: 'Bank BRI',
      icon: IconBRI,
      noVA: '000081287318211',
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
      id: 2,
      title: 'Bank BCA',
      icon: IconBCA,
      noVA: '00000667722883399',
      content: [
        'Masukkan kartu ATM dan PIN BCA Anda',
        'Pilih Menu Transaksi Linnya',
        'Pilih Menu Transfer',
        'Pilih Menu Ke Rek BCA Virtuan Account',
        'Masukkan 0000 + nomor ponsel Anda:000008Xx-xxxx-xxxx',
        'Masukkan Nominal Top up',
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

        <Text style={[Fonts.subhead]}>ATM</Text>
        <View
          style={{
            width: CustomSpacing(24),
          }}
        />
      </HStack>
    );
  };

  const renderHeader = (section, index, isActive) => {
    console.log('sections', section);
    return (
      <VStack
        style={{
          marginBottom: index === 0 ? CustomSpacing(12) : 0,
        }}>
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
        <VStack style={componentStyles.containerVA}>
          <Text style={[Fonts.subhead]}>{section?.noVA}</Text>
        </VStack>
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
          {/* {methodList.map((item, index) => (
            <Collapsible collapsed={isCollapsed}>
              <TouchableOpacity key={item.id} activeOpacity={0.8}>
                <VStack
                  style={{
                    marginBottom: index === 0 ? CustomSpacing(12) : 0,
                  }}>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <HStack>
                      <FastImage
                        source={item.icon}
                        style={componentStyles.imgIconMethod}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text style={[Fonts.label]}>{item.title}</Text>
                    </HStack>
                    <FastImage
                      source={ChevronRightIcon}
                      style={componentStyles.imgChevronRight}
                    />
                  </HStack>
                </VStack>
              </TouchableOpacity>
            </Collapsible>
          ))} */}
        </VStack>
      </VStack>
    </VStack>
  );
});

export default Atm;
