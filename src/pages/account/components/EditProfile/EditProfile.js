import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import {useStores} from '@store/root.store';
import {CustomSpacing, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer, Button} from '@components';
import {ProfileBg, BackGreyIcon, Flagicon} from '@assets';
import {useTranslation} from 'react-i18next';

import styles from './EditProfile.style';
import {observer} from 'mobx-react-lite';

const EditProfile = observer(() => {
  const {t, i18n} = useTranslation();
  const {exploreStore} = useStores();
  const componentStyles = styles();
  const navigation = useNavigation();
  const [formProfile, setFormProfile] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const isVerified = useMemo(
    () => exploreStore.accountDetailData.users.status,
    [exploreStore.accountDetailData],
  );

  useEffect(() => {
    setFormProfile({
      name: exploreStore.accountDetailData.users.name,
      phone: exploreStore.accountDetailData.users.phone,
      email: exploreStore.accountDetailData.users.email,
    });
  }, []);

  const getInitialName = (name) => {
    const nameSplit = name.split(' ');
    return (
      nameSplit[0]?.charAt(0)?.toUpperCase() +
      nameSplit[1]?.charAt(0)?.toUpperCase()
    );
  };

  const requestVerifyEmail = () => {
    exploreStore.requestVerifyEmail(exploreStore.accountDetailData.users.email);
    navigation.navigate('OtpVerify');
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const isFormNameEdit = useMemo(() => {
    return formProfile.name !== exploreStore.accountDetailData.users.name;
  }, [formProfile]);

  const isFormPhoneEdit = useMemo(() => {
    return formProfile.phone !== exploreStore.accountDetailData.users.phone;
  }, [formProfile]);

  const isFormEmailEdit = useMemo(() => {
    return formProfile.email !== exploreStore.accountDetailData.users.email;
  }, [formProfile]);

  const parseDisableForm = (type) => {
    let isDisabled;
    switch (true) {
      case type !== 'name' && isFormNameEdit:
        isDisabled = true;
        break;
      case type !== 'phone' && isFormPhoneEdit:
        isDisabled = true;
        break;
      case type !== 'email' && isFormEmailEdit:
        isDisabled = true;
        break;
      default:
        isDisabled = false;
    }
    return isDisabled;
  };

  const submitUpdateForm = () => {
    exploreStore.updateAccount(formProfile);
    setTimeout(() => {
      navigation.navigate('Account');
    }, 500);
  };

  const listRegister = [
    {
      id: 1,
      title: t('name'),
      placeholder: 'Enter your name',
      value: formProfile.name,
      form: 'name',
    },
    {
      id: 2,
      title: t('phoneNumber'),
      placeholder: 'Phone number',
      type: 'phone',
      value: formProfile.phone,
      form: 'phone',
    },
    {
      id: 3,
      title: 'Email',
      placeholder: 'e.g. hayuq@mail.com',
      value: formProfile.email,
      form: 'email',
    },
  ];

  return (
    <VStack
      style={{
        backgroundColor: Colors.neutral10,
      }}>
      {/* ------ Header------ */}
      <VStack style={componentStyles.containerHeadear}>
        <Animatable.View animation="bounceInRight" delay={200}>
          <FastImage
            source={ProfileBg}
            style={componentStyles.imgProfileBg}
            resizeMode="contain"
          />
        </Animatable.View>
        <HStack style={componentStyles.containerNavigator}>
          <TouchableOpacity onPress={goBack}>
            <FastImage
              source={BackGreyIcon}
              style={componentStyles.imgGoback}
            />
          </TouchableOpacity>
          <Spacer width={CustomSpacing(16)} />
          <Text style={[Fonts.headlineL]}>{t('editProfile')}</Text>
        </HStack>
        <Animatable.View
          animation="bounceIn"
          delay={200}
          style={componentStyles.containerAnimationProfilePic}>
          <VStack>
            <VStack style={componentStyles.containerProfilePic}>
              <Text style={[Fonts.h2, {color: Colors.neutral10}]}>
                {getInitialName(exploreStore.accountDetailData.users.name)}
              </Text>
            </VStack>
            <Spacer height={CustomSpacing(16)} />
          </VStack>
        </Animatable.View>
      </VStack>
      {/* ------ Profile Data ------ */}
      <VStack style={componentStyles.containerProfileData}>
        <Spacer height={CustomSpacing(30)} />
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Animatable.View
            duration={400}
            easing="ease-out"
            animation={'bounceInUp'}
            useNativeDriver>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              {listRegister.map((item) => (
                <VStack key={item.id}>
                  <VStack
                    style={
                      (componentStyles.containerInput,
                      {
                        opacity: parseDisableForm(item.form) ? 0.5 : 1,
                      })
                    }>
                    <HStack>
                      <Text style={[Fonts.label]}>{item.title} </Text>
                      <Text style={[Fonts.label, {color: Colors.dangerMain}]}>
                        *
                      </Text>
                    </HStack>
                    <HStack>
                      {item.type && (
                        <>
                          <FastImage
                            source={Flagicon}
                            style={componentStyles.imgFlagicon}
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <Text style={[Fonts.label]}>+62 |</Text>
                          <Spacer width={CustomSpacing(8)} />
                        </>
                      )}
                      <TextInput
                        editable={!parseDisableForm(item.form)}
                        value={item.value}
                        placeholder={item.placeholder}
                        style={[Fonts.label]}
                        keyboardType={item.type ? 'numeric' : 'default'}
                        onChangeText={(text) => {
                          setFormProfile({
                            ...formProfile,
                            [item.form]: text,
                          });
                        }}
                      />
                    </HStack>
                  </VStack>
                  <Spacer height={CustomSpacing(16)} />
                </VStack>
              ))}
              {isVerified === 1 ? (
                <VStack>
                  <VStack style={componentStyles.verifyEmailContainer}>
                    <Text style={[Fonts.label, {color: Colors.supportMain}]}>
                      {t('captionVerifyEmail')}{' '}
                      <Text
                        onPress={requestVerifyEmail}
                        style={[
                          Fonts.labelSemiBold,
                          {color: Colors.supportMain},
                        ]}>
                        {t('verifyNow')}
                      </Text>
                    </Text>
                  </VStack>
                </VStack>
              ) : (
                <VStack>
                  <VStack style={componentStyles.verifiedEmailContainer}>
                    <Text style={[Fonts.label, {color: Colors.successMain}]}>
                      {t('captionEmailVerified')}
                    </Text>
                  </VStack>
                </VStack>
              )}
            </KeyboardAvoidingView>
          </Animatable.View>
        </TouchableWithoutFeedback>
        <Spacer height={CustomSpacing(50)} />
        <Button
          isSubmitting={exploreStore.updateAccountLoading}
          onPress={submitUpdateForm}
          disabled={
            isFormNameEdit || isFormPhoneEdit || isFormEmailEdit ? false : true
          }
          type="primary"
          label={t('saveChange')}
        />
        {/* <VStack style={componentStyles.containerBtnAction}>
          <Button
            isSubmitting={exploreStore.updateAccountLoading}
            onPress={submitUpdateForm}
            disabled={
              isFormNameEdit || isFormPhoneEdit || isFormEmailEdit
                ? false
                : true
            }
            type="primary"
            label="Save Changes"
          />
        </VStack> */}
      </VStack>
    </VStack>
  );
});

export default EditProfile;
