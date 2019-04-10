import React, {Component} from 'react';
import TrackPlayer from 'react-native-track-player';
import { Button } from './common'
import { Text, View} from 'react-native';
var track = {
    id: 'unique track id', // Must be a string, required
    url: require('../WhoAreYou.mp3'), // Load media from the app bundle
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: require('../ava1.jpg'), // Load artwork from the app bundle
};
TrackPlayer.setupPlayer().then(async (result) => {
    // The player is ready to be used
    console.log(result)
    TrackPlayer.add([track]).then(async function() {
      let trackId = await TrackPlayer.getCurrentTrack();
      let duration = await TrackPlayer.getDuration();


     

    });
});

export default class App extends Component {
  render() {
    return (
      <View>
        <Text>Ahihi</Text>
        <Button whenPressed = {() => TrackPlayer.play()}>
          Play
        </Button>
        <Button whenPressed = {() =>TrackPlayer.stop()}>
          Stop
        </Button>
        <Button whenPressed = {() =>TrackPlayer.pause()}>
          pause
        </Button>
        <Button whenPressed = {() => TrackPlayer.reset()}>
          reset
        </Button>
      </View>

    );
  }
}

