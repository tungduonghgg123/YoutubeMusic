import React, { Component } from 'react';
import Navigation from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import TrackPlayer from 'react-native-track-player';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);
const TabNavigator = Navigation.createBottomTabNavigator({
  Search: { screen: SearchScreen },
  Play: { screen: PlayScreen },
  
  
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