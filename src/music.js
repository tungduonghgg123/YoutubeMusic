import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl,CustomButton } from './common'
import { Text, View, TextInput, Button} from 'react-native';


export default class Music extends Component {
  state = {paused: false, text: null}

  onPressPause() {
    this.setState({paused: true})
  }
  onPressPlay() {
    this.setState({paused: false})
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
    });
    TrackPlayer.play()
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
          trackLength={180}
          currentPosition={120}
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
        <CustomButton whenPressed={() => TrackPlayer.play()}>
          Play
        </CustomButton>
        {/* <CustomButton whenPressed={() => TrackPlayer.stop()}>
          Stop
        </CustomButton> */}
        <CustomButton whenPressed={() => TrackPlayer.pause()}>
          Pause
        </CustomButton>
        <CustomButton whenPressed={() => TrackPlayer.reset()}>
          Reset
        </CustomButton>
      </View>

    );
  }
}

