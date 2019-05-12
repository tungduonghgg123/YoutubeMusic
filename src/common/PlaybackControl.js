import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

class PlaybackControl extends TrackPlayer.ProgressComponent {
  async repeatAndPlay() {
    console.log('ahihi')
    await TrackPlayer.seekTo(0);
    this.props.onPressPlay()
  }
  render() {
    const { paused,
      shuffleOn,
      repeatOn,
      onPressPlay,
      onPressPause,
      onBack,
      onForward,
      onPressShuffle,
      onPressRepeat,
      forwardDisabled,
      backwardDisabled,
      shuffleDisabled } = this.props;
    return (
      <View style={styles.container}>
      {/* Shuffle */}
        <TouchableOpacity activeOpacity={0.0} onPress={onPressShuffle} disabled={shuffleDisabled}>
          <Image style={[styles.secondaryControl, shuffleOn ? [] : styles.off]}
            source={require('../img/ic_shuffle_white.png')} />
        </TouchableOpacity>

        <View style={{ width: 40 }} />
      {/* Backward */}
        <TouchableOpacity onPress= {() => {
          /**
          * repeat track when if it reached the 4th second
          else use the onBack() method passed from the parent component.
          *  */ 
          this.state.position > 3 ? this.repeatAndPlay(): onBack() 
        }} 
        
        disabled={backwardDisabled}>
          <Image style={[backwardDisabled && { opacity: 0.3 }]}
            source={require('../img/ic_skip_previous_white_36pt.png')} />
        </TouchableOpacity>

        <View style={{ width: 20 }} />
      {/* Play/pause */}
        {!paused ?
          <TouchableOpacity onPress={onPressPause}>
            <View style={styles.playButton}>
              <Image source={require('../img/ic_pause_white_48pt.png')} />
            </View>
          </TouchableOpacity> :
          <TouchableOpacity onPress={onPressPlay}>
            <View style={styles.playButton}>
              <Image source={require('../img/ic_play_arrow_white_48pt.png')} />
            </View>
          </TouchableOpacity>
        }

        <View style={{ width: 20 }} />
        {/* Forward */}
        <TouchableOpacity onPress={onForward}
          disabled={forwardDisabled}>
          <Image style={[forwardDisabled && { opacity: 0.3 }]}
            source={require('../img/ic_skip_next_white_36pt.png')} />
        </TouchableOpacity>

        <View style={{ width: 40 }} />
        {/* Repeat */}
        <TouchableOpacity activeOpacity={0.0} onPress={onPressRepeat}>
          <Image style={[styles.secondaryControl, repeatOn ? [] : styles.off]}
            source={require('../img/ic_repeat_white.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

export { PlaybackControl };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  }
})
