import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl,CustomButton } from './common'
import { Text, View, TextInput, Button} from 'react-native';


export default class Music extends Component {
  state = {paused: true, text: 'Wr21LZPVPrw', length: 0}

  onPressPause() {
    this.setState({paused: true});
    TrackPlayer.pause();
  }
  onPressPlay() {
    this.setState({paused: false})
    TrackPlayer.play();
  }
  
  onPressSubmit () {
    var track = {
      id: 'unique track id', // Must be a string, required
      url: `https://youtubemusicbackend.herokuapp.com/play/${this.state.text}`, // Load media from heroku
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      // artwork: require('../ava1.jpg'), // Load artwork from the app bundle
    };
    TrackPlayer.setupPlayer().then(async (result) => {
      TrackPlayer.add([track]);
      // this.setState({length: TrackPlayer.getDuration()}).then(() => {
      //   alert(this.state.length)
      // })
      alert(TrackPlayer.getDuration())
      this.onPressPlay();
    });
    
  }
  
  render() {
    return (
      <View>
        <Header 
          message= "playing from your library"
          onMessagePress={() => console.log('ahihi')}
        />
        <AlbumArt/>
        <TrackDetails 
          title = 'Sunflower'
        />
        <SeekBar 
          trackLength={this.state.length}
          currentPosition={0}
        />
        <PlaybackControl 
          paused={this.state.paused}
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}

        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 3, color: "white" }}
          onChangeText={(text) => this.setState({ text })}
          placeholder="Enter video id here"
        />
        <Button onPress={this.onPressSubmit.bind(this)}
          title="Submit"
          color="#841584"
          accessibilityLabel="Play music"
        />
      </View>

    );
  }
}

