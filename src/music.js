import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { CustomButton } from './common'
import { TextInput, View, Button } from 'react-native';



export default class Music extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null
    }
  }
  
  onPressSubmit () {
    var track = {
      id: 'unique track id', // Must be a string, required
      url: `https://youtubemusicbackend.herokuapp.com/play/${this.state.text}`, // Load media from heroku
      // url: `http://localhost:3000/play/${this.state.text}`, // Load media from localhost
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      // artwork: require('../ava1.jpg'), // Load artwork from the app bundle
    };
    TrackPlayer.setupPlayer().then(async (result) => {
      // The player is ready to be used
      console.log(result)
      TrackPlayer.add([track]).then(async function () {
        let trackId = await TrackPlayer.getCurrentTrack();
        let duration = await TrackPlayer.getDuration();
        console.log(trackId)
        console.log(duration)
      });
    });
    TrackPlayer.play()
  }
  
  render() {
    return (
      <View>
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

