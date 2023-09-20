/**
 * @format
 */
import 'react-native-gesture-handler';
// import './src/config/Lang.config';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/config/Lang.config';

AppRegistry.registerComponent(appName, () => App);
