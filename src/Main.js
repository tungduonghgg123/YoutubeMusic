import React, { Component } from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import HomeScreen from './HomeScreen';
import TrackPlayer from 'react-native-track-player';

import  MiniPlayer  from './common/MiniPlayer'
import { Root } from "native-base";
import NavigationService from './NavigationService';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

/**
 * `RedBoxes and YellowBoxes are automatically disabled in release (production) builds.`
For now, just let yellowBoxes on
 */
// YellowBox.ignoreWarnings( ['Possible Unhandled Promise Rejection']);


const TabNavigator = createBottomTabNavigator({
  Home: { screen: HomeScreen },
  Search: { screen: SearchScreen },
}, {
    initialRouteName: 'Search',
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  })
  
const MainNavigator = createStackNavigator({
  Tabs: TabNavigator,
  Play: {
    screen: PlayScreen,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  },
  Mini: MiniPlayer
})


const AppContainer = createAppContainer(MainNavigator)

export default class Main extends Component {
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
      <Root >
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
        <MiniPlayer
           
        />
      </Root>

    );
  }
}
