import React, {Component} from 'react';
import { Header, AlbumArt, TrackDetails, SeekBar } from './common'
import { Text, View} from 'react-native';
import Music from './music';


export default class App extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}>
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
      <Music></Music>
      </View>
    );
  }
}

