import React, { Component } from 'react';
import {SafeAreaView, YellowBox} from 'react-native'
import {createStackNavigator,createAppContainer, 
    createMaterialTopTabNavigator, MaterialTopTabBar
} from 'react-navigation'
import { PlayScreen, SearchScreen, HomeScreen} from './'
import PlayScreenChild from '/Users/duongtung/Workspace/YoutubeMusic/playground/PlayScreenChild.js'
import TrackPlayer from 'react-native-track-player';
import { Icon } from 'react-native-elements'
import MiniPlayer from '../commonComponents/MiniPlayer'
import { Root } from "native-base";
import NavigationService from '../service/NavigationService';
import { BACKGROUND_COLOR, COMMON_COMPONENTS_COLOR, INDICATOR_COLOR} from '../style'


YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(['Warning: ViewPagerAndroid has been extracted']);

/**
 * `RedBoxes and YellowBoxes are automatically disabled in release (production) builds.`
For now, just let yellowBoxes on
 */
// YellowBox.ignoreWarnings( ['Possible Unhandled Promise Rejection']);

function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView style={{backgroundColor: BACKGROUND_COLOR}}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}
const TabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: <Icon name='home' color={COMMON_COMPONENTS_COLOR} />
    }
  },
  Search: { 
    screen: SearchScreen ,
    navigationOptions: {
      tabBarIcon: <Icon name='search'  color={COMMON_COMPONENTS_COLOR}/>
    }
  },
}, {
    initialRouteName: 'Home',
    navigationOptions: {
      header: null,
      headerLeft: null,
    },
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: BACKGROUND_COLOR
      },
      indicatorStyle: {
        backgroundColor: INDICATOR_COLOR
      },
    },
    tabBarComponent: SafeAreaMaterialTopTabBar,
    

  })
export {TabNavigator}
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
}, {
  // initialRouteName: 'Play',
})


const AppContainer = createAppContainer(MainNavigator)

export default class Main extends Component {
  componentDidMount() {
    /**
     * WORKING ON IT: setup player immediately after the application is launched.
     */
    TrackPlayer.setupPlayer({
      maxBuffer: 1000,
      minBuffer: 100
    });
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
        }} />
        <MiniPlayer/>
      </Root>

    );
  }
}
