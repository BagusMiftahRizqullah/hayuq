import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useStores} from '@store/root.store';
import {dimensions} from '@config/Platform.config';
import {CustomSpacing, Layout, Colors, Fonts, Rounded} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {
  CallIcon,
  CloseOutlineIcon,
  ChatBg,
  MicIcon,
  AddMediaIcon,
  Send,
  User,
} from '@assets';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './ChatPickyuq.style';
import CONFIG from '@config';
import moment from 'moment';

const ChatPickyuq = observer((props) => {
  const {t, i18n} = useTranslation();
  const {routerStore, authStore, orderStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [myMessage, setMyMessage] = useState('');
  const [listMessage, setListMessage] = useState([]);
  const [sendMessageStatus, setSendMessageStatus] = useState(false);

  // const goToCall = useCallback(() => {
  //   routerStore.setOnCall(true);
  // }, [routerStore]);

  // useFocusEffect(
  //   useCallback(async () => {
  //     const dataOrders = props?.route?.params;
  //     await CONFIG.portSocketChat.emit('find-rooms', {
  //       code: dataOrders?.transactions?.code,
  //       users_id: dataOrders?.transactions?.users_id,
  //     });

  //     await CONFIG.portSocketChat.on('find-rooms', (data) => {
  //       console.log('chat USER SOCKET FIND ROOMS', data.data);

  //       orderStore.setListChat(data.data.list, true);
  //     });

  //     await CONFIG.portSocketChat.on('received', async (data) => {
  //       console.log('received USER SOCKET123 =>>>>>>>', data.data);
  //       if (data.data) {
  //         await orderStore.setListChat(data.data);
  //       }
  //     });
  //   }, []),
  // );

  // useEffect(async () => {
  //   if (orderStore.listChatData.length > 0) {
  //     return;
  //   } else {
  //     await CONFIG.portSocketChat.on('received', async (data) => {
  //       console.log('received USER SOCKET123 =>>>>>>>', data.data);
  //       if (data.data) {
  //         await orderStore.setListChat(data.data);
  //       }
  //     });
  //   }
  // }, []);

  // useEffect(async () => {
  //   // console.log('recived TRIGGER', CONFIG.portSocketChat);
  //   await CONFIG.portSocketChat.on('received', async (data) => {
  //     console.log('received USER SOCKET123 =>>>>>>>', data.data);
  //     if (data.data) {
  //       await orderStore.setListChat(data.data);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
        if (scrollRef && scrollRef.current) {
          scrollRef.current.scrollToEnd({animated: true});
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const SendMessage = async () => {
    const dataOrders = props?.route?.params.dataOrders;
    const USER_ID = await AsyncStorage.getItem('USER_ID');
    if (myMessage.length > 0) {
      CONFIG.portSocketChat.emit('messages', {
        code: dataOrders?.code,
        users_id: USER_ID,
        text: myMessage,
        file: null,
      });
      orderStore.setListChat({
        code: dataOrders?.code,
        users_id: USER_ID,
        text: myMessage,
        file: null,
        createdAt: moment(),
      });
      setMyMessage('');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const NavigatorBar = () => {
    const dataOrders = props?.route?.params?.dataOrders;
    const dataDriver = props?.route?.params?.dataDriver;
    console.log('dataDriverChat', dataDriver);
    return (
      <HStack style={componentStyles.navigatorBarContainer}>
        <HStack>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <FastImage
              source={CloseOutlineIcon}
              style={componentStyles.imgCloseIcon}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(15)} />
          <FastImage
            source={
              dataDriver?.driverdetails?.path
                ? {
                    uri: `${dataDriver?.driverdetails?.path}`,
                  }
                : User
            }
            style={componentStyles.imgAvatar}
          />
          <Spacer width={CustomSpacing(15)} />
          <VStack>
            <Text style={[Fonts.subhead]}>
              {dataDriver?.driverdetails?.name
                ? dataDriver?.driverdetails?.name
                : ''}
            </Text>
            <Text style={Fonts.label}>{` • ${
              dataDriver?.drivervehicles?.plate_number
                ? dataDriver?.drivervehicles?.plate_number
                : ''
            }`}</Text>
          </VStack>
        </HStack>
        {/* <TouchableOpacity activeOpacity={0.8} onPress={goToCall}>
          <FastImage source={CallIcon} style={componentStyles.imgCallIcon} />
        </TouchableOpacity> */}
      </HStack>
    );
  };

  return (
    <VStack style={componentStyles.containerChat}>
      <Spacer topSafeAreaHeight />
      {/* ------ Navigation Bar ------ */}
      <NavigatorBar />
      <VStack>
        <FastImage
          source={ChatBg}
          style={componentStyles.imgChatBg}
          resizeMode="cover"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollRef}
            onContentSizeChange={() =>
              scrollRef.current.scrollToEnd({animated: true})
            }
            style={{
              padding: CustomSpacing(16),
            }}>
            {/* ------ Chat Content ------ */}
            {orderStore.listChatData?.map((item, index) => {
              return (
                <VStack
                  style={{
                    alignItems: item?.drivers_id ? 'flex-start' : 'flex-end',
                  }}
                  key={`chat-${index}`}>
                  <VStack
                    style={[
                      {
                        backgroundColor: item?.drivers_id
                          ? Colors.backgroundSurface
                          : Colors.primaryMain,
                        borderBottomLeftRadius: item?.drivers_id
                          ? 0
                          : Rounded.l,
                        borderBottomRightRadius: item?.drivers_id
                          ? Rounded.l
                          : 0,
                      },
                      componentStyles.containerChatContent,
                    ]}>
                    <Text style={[Fonts.label]}>{item?.text}</Text>
                  </VStack>
                  <Text style={[Fonts.captionM]}>
                    {moment(item?.createdAt).format('hh:mm')}
                  </Text>
                </VStack>
              );
            })}
            <Spacer
              height={
                isKeyboardVisible ? CustomSpacing(190) : CustomSpacing(110)
              }
            />
          </ScrollView>
          {/* ------ Input ------ */}
          <VStack
            style={[
              componentStyles.containerInput,
              {
                bottom: isKeyboardVisible
                  ? CustomSpacing(70)
                  : CustomSpacing(10) * -1,
              },
            ]}>
            <HStack style={componentStyles.inputBubble}>
              <HStack>
                <TouchableOpacity>
                  <FastImage
                    source={AddMediaIcon}
                    style={componentStyles.imgAddMedia}
                    tintColor={Colors.neutral60}
                  />
                </TouchableOpacity>
                <Spacer width={CustomSpacing(8)} />
                <VStack
                  style={{
                    width: CustomSpacing(232),
                  }}>
                  <TextInput
                    multiline
                    value={myMessage}
                    onChangeText={(text) => setMyMessage(text)}
                    placeholder={t('pTypeMessage')}
                    style={[
                      componentStyles.input,
                      {height: CustomSpacing(myMessage.length > 30 ? 100 : 55)},
                    ]}
                    underlineColorAndroid="transparent"
                  />
                </VStack>
              </HStack>
              <TouchableOpacity onPress={() => SendMessage()}>
                <FastImage source={Send} style={componentStyles.imgMic} />
              </TouchableOpacity>
            </HStack>
            <Spacer bottomSafeAreaHeight />
          </VStack>
        </KeyboardAvoidingView>
      </VStack>
    </VStack>
  );
});

export default ChatPickyuq;
