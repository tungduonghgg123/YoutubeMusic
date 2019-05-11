import React, { Component } from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import HomeScreen from './HomeScreen';
import NextScreen from './NextScreen.js';
import TrackPlayer from 'react-native-track-player';
import { YellowBox } from 'react-native';
import { Header, MiniPlayer } from './common'
import { Root } from "native-base";

YellowBox.ignoreWarnings(['Remote debugger']);

/**
 * `RedBoxes and YellowBoxes are automatically disabled in release (production) builds.`
For now, just let yellowBoxes on
 */
// YellowBox.ignoreWarnings( ['Possible Unhandled Promise Rejection']);


const TabNavigator = createBottomTabNavigator({
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
  
const MainNavigator = createStackNavigator({
  Tabs: TabNavigator,
  Play: {
    screen: PlayScreen,
    navigationOptions: {
      header: null,
      headerLeft: null
    }
  }
})
  
  const SecondPlayer = createBottomTabNavigator({
    tabBarComponent: () => <MiniPlayer message='tungduong' />
  })


const AppContainer = createAppContainer(MainNavigator)

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
      <Root>
        <AppContainer />
        <MiniPlayer
          // message = {!this.state.track ? "" : this.state.track.title.slice(0, 30)}
          // paused= {this.state.paused}
          // onPressPause={this.onPressPause.bind(this)}
          // onPressPlay={this.onPressPlay.bind(this)}
          // trackLength={!this.state.track ? 0 : this.state.track.duration}
          // onUpPress = {

          // }
          message='tung duong'
        />

      </Root>

    );
  }
}
