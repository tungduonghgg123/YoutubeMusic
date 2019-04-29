import React, { Component } from 'react';
import Navigation from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'
import TrackPlayer from 'react-native-track-player';

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
    TrackPlayer.setupPlayer()
  }
  render() {
    return (
      <AppContainer />
    );
  }
}