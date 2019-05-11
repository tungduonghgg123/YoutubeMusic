import React, { Component } from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import HomeScreen from './HomeScreen';
import NextScreen from './NextScreen.js';
import TrackPlayer from 'react-native-track-player';

import  {MiniPlayer}  from './common'
import { Root } from "native-base";
import NavigationService from './NavigationService';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

/**
 * `RedBoxes and YellowBoxes are automatically disabled in release (production) builds.`
For now, just let yellowBoxes on
 */
// YellowBox.ignoreWarnings( ['Possible Unhandled Promise Rejection']);


<<<<<<< HEAD:src/Main.js
const TabNavigator = Navigation.createBottomTabNavigator({
=======
const TabNavigator = createBottomTabNavigator({
>>>>>>> master:src/App.js
  Home: { screen: HomeScreen },
  Search: { screen: SearchScreen },
  Next: { screen: NextScreen },
}, {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  })
<<<<<<< HEAD:src/Main.js
const AppContainer = Navigation.createAppContainer(TabNavigator)
=======
  
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
>>>>>>> master:src/App.js

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
