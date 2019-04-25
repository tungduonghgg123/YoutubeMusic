import React, {Component} from 'react';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl } from './common'
import { Text, View} from 'react-native';
import Music from './music';


export default class App extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'brown', flex: 1}}>
        <Header 
          message= "playing from your library"
          onMessagePress={() => console.log('ahihi')}
        />
        <AlbumArt/>
        <TrackDetails 
          title = 'Sunflower'
        />
        <SeekBar 
          trackLength={180}
          currentPosition={120}
        />
        <PlaybackControl />
        <Music></Music>
      </View>
    );
  }
}

