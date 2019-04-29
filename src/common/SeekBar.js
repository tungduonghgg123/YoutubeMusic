import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Slider from 'react-native-slider';

function pad(n, width, z=0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
]);


class SeekBar extends TrackPlayer.ProgressComponent {
  constructor(props){
    super(props);
    this.state = {duration: 0}
  }
  // componentDidMount(){
  //   this.onSkip = TrackPlayer.addEventListener('remote-skip', async () => {
  //     let duration = await TrackPlayer.getDuration();
  //     await this.setState({ duration: Math.round(duration) })
  //   })
  //   // this.getDuration()
  // }
  // componentWillUnmount() {
  //   this.onSkip.remove();
// }
  // componentDidUpdate(prevProps){
  //   let videoId = this.props.navigation.getParam('videoId');
  //   if(prevProps.navigation.getParam('videoId') === videoId)
  //     return;
  //   // this.getDuration()
  // }
  render() {
      const { trackLength, currentPosition, onSeek, onSlidingStart} = this.props;
      const position = Math.round(this.state.position);
      const elapsed = minutesAndSeconds(position);
      const total = minutesAndSeconds(trackLength);

      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text}>
              {elapsed[0] + ":" + elapsed[1]}
            </Text>
            <View style={{flex: 1}} />
            <Text style={[styles.text, {width: 40}]}>
              {trackLength > 1 &&  total[0] + ":" + total[1]}
            </Text>
          </View>
          <Slider
            maximumValue={trackLength}
            onSlidingComplete={ async value => {
              await TrackPlayer.seekTo(value)
            }}

            value={this.state.position}

            style={styles.slider}
            minimumTrackTintColor='#fff'
            maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            />
        </View>
          
      );
  }
  
}

export { SeekBar};

const styles = StyleSheet.create({
  slider: {
    marginTop: -12,
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign:'center',
  }
});