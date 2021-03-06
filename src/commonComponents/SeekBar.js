import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Slider from 'react-native-slider';
import { THUMP_COLOR, TEXT_COLOR, MIN_TRACK_TINT_COLOR, MAX_TRACK_TINT_COLOR} from '../style'
function pad(n, width, z=0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSecondsAndHours = (position) => {
  if(position > 3600 ){
    return [
      pad(Math.floor(position / 3600), 2),
      pad(Math.floor(position % 3600 / 60), 2),
      pad(position  % 3600 % 60, 2),
    ]
  };
  return [
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
  ]
};
class SeekBar extends TrackPlayer.ProgressComponent {

  render() {
    const { trackLength, currentPosition, onSeek, onSlidingStart} = this.props;
    const position = Math.round(this.state.position);
      const elapsed = minutesAndSecondsAndHours(position);
      const total = minutesAndSecondsAndHours(trackLength);
      return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.numberStyle}>
              {elapsed.length === 3? 
                elapsed[0] + ":" + elapsed[1] + ":" + elapsed[2]:
                elapsed[0] + ":" + elapsed[1]
              }
            </Text>
            <View style={{flex: 1}} />
            <Text style={[styles.numberStyle]}>
              {total.length === 3?  
                total[0] + ":" + total[1]+ ":" + total[2]:
                total[0] + ":" + total[1]
              }
            </Text>
          </View>
          <Slider
            maximumValue={trackLength}
            onSlidingComplete={ async value => {
              await TrackPlayer.seekTo(value)
            }}
            value={this.state.position}
            style={styles.slider}
            minimumTrackTintColor={MIN_TRACK_TINT_COLOR}
            maximumTrackTintColor={MAX_TRACK_TINT_COLOR}
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
    backgroundColor: THUMP_COLOR,
  },
  numberStyle: {
    color: TEXT_COLOR,
    fontSize: 12,
    textAlign:'center',
  }
});