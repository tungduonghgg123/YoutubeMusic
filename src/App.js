import React, { Component } from 'react';
import Navigation from 'react-navigation'
import PlayScreen from './PlayScreen';
import SearchScreen from './SearchScreen'



const TabNavigator = Navigation.createBottomTabNavigator({
  Search: { screen: SearchScreen },
  Play: { screen: PlayScreen }
})

const AppSwitchNavigator = Navigation.createSwitchNavigator({
  TabNavigator
})
const AppContainer = Navigation.createAppContainer(AppSwitchNavigator)

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}