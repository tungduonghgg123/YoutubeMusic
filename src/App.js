import React, { Component } from 'react';
import Navigation from 'react-navigation'
// import LoginScreen from './LoginScreen';
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import HomeScreen from './HomeScreen';
import NextScreen from './NextScreen.js';
import TrackPlayer from 'react-native-track-player';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

/**
 * RedBoxes and YellowBoxes are automatically disabled in release (production) builds.
For now, just let yellow box on
 */
// YellowBox.ignoreWarnings( ['Possible Unhandled Promise Rejection']);


const TabNavigator = Navigation.createBottomTabNavigator({
  // Login: {screen: LoginScreen},
  Home: { screen: HomeScreen },
  Search: { screen: SearchScreen },
  Play: { screen: PlayScreen },
  Next: { screen: NextScreen },
}, {
  initialRouteName: 'Play'
})

const AppSwitchNavigator = Navigation.createSwitchNavigator({
  TabNavigator
})
const AppContainer = Navigation.createAppContainer(AppSwitchNavigator)

export default class App extends Component {
  componentDidMount() {
    /**
     * WORKING ON IT: setup player immediately after the application is launched.
     */
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SKIP,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE
      ]
    });
  }
  render() {
    return (
      <AppContainer />
    );
  }
}