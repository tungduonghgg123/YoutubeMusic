import React, {Component} from 'react';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl } from './common'
import { Text, View} from 'react-native';
import Music from './Music';


export default class App extends Component {
  
  render() {
    return (
      <View style={{backgroundColor: 'brown', flex: 1}}>
        <Music></Music>
      </View>
    );
  }
}

