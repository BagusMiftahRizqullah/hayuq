// create mobx store
import {makeAutoObservable, observable} from 'mobx';
import {persist} from 'mobx-persist';

export class RouterStore {
  location = null;
  onCall = false;
  callStatus = '';
  isConnected = true;
  weatherRain = false;
  splashShow = true;
  myMenu = 'Home';
  inAppUpdate = false;
  @observable defaultLanguage = 'id';

  constructor() {
    makeAutoObservable(this);
  }

  setInAppUpdate = (update) => {
    this.inAppUpdate = update;
  };

  setMyMenu = (menu) => {
    this.myMenu = menu;
  };

  setSplashShow = (location) => {
    this.splashShow = location;
  };

  setLocation = (location) => {
    this.location = location;
  };

  setOnCall = (status) => {
    this.onCall = status;
    if (status) {
      this.callStatus = 'connecting';
    } else {
      this.callStatus = '';
    }
  };

  setCallStatus(status) {
    this.callStatus = status;
  }

  setConnectedStatus = (status) => {
    this.isConnected = status;
  };

  setWeatherRain = (status) => {
    this.weatherRain = status;
  };

  setLanguage = (lang) => {
    this.defaultLanguage = lang;
  };
}
