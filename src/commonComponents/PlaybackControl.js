import React from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SECOND_COMMON_COMPONENTS_COLOR, COMMON_COMPONENTS_COLOR, HEADER_BUTTON_SIZE, 
  PLAY_BUTTON_SIZE, BUTTON_BORDER_COLOR, DISABLED_OPACITY  } from '../style'
import { Icon} from 'react-native-elements'

class PlaybackControl extends TrackPlayer.ProgressComponent {
  async repeatAndPlay() {
    await TrackPlayer.seekTo(0);
    this.props.onPressPlay()
  }
  render() {
    const { paused,
      autoOn,
      repeatOn,
      onPressPlay,
      onPressPause,
      onBack,
      onForward,
      onPressAuto,
      onPressRepeat,
      forwardDisabled,
      backwardDisabled,
      autoDisabled,
      loading } = this.props;
    return (
      <View style={styles.container}>
        {/* Auto */}
        <TouchableOpacity
          activeOpacity={0.0}
          onPress={onPressAuto}
          disabled={autoDisabled}>
          <Text style={[ autoOn ? styles.on : styles.off]}>
            AUTO
          </Text>
        </TouchableOpacity>

        <View style={{ width: 20 }} />

        {/* Backward */}
        <TouchableOpacity
          onPress={() => { this.state.position > 3 ? this.repeatAndPlay() : onBack() }}
          disabled={backwardDisabled}>
          <Icon
            color={COMMON_COMPONENTS_COLOR}
            size={HEADER_BUTTON_SIZE}
            name='skip-previous' />
        </TouchableOpacity>

        <View style={{ width: 20 }} />

        {/* Play/pause */}
        {
            !paused ?
              <TouchableOpacity onPress={onPressPause}>
                <View style={styles.playButton}>
                  <Icon
                    name='pause'
                    size={PLAY_BUTTON_SIZE}
                    color={COMMON_COMPONENTS_COLOR}
                  />
                </View>
              </TouchableOpacity> :
              <TouchableOpacity onPress={onPressPlay}>
                <View style={styles.playButton}>
                  <Icon
                    name='play-arrow'
                    size={PLAY_BUTTON_SIZE}
                    color={COMMON_COMPONENTS_COLOR}
                  />
                </View>
              </TouchableOpacity>
        }

        <View style={{ width: 20 }} />

        {/* Forward */}
        <TouchableOpacity onPress={onForward}
          disabled={forwardDisabled}>
          <Icon
            color={COMMON_COMPONENTS_COLOR}
            size={HEADER_BUTTON_SIZE}
            name='skip-next' />
        </TouchableOpacity>

        <View style={{ width: 40 }} />

        {/* Repeat */}
        <TouchableOpacity onPress={onPressRepeat}>
          <Icon
            iconStyle={repeatOn ? [] : styles.off}
            color={COMMON_COMPONENTS_COLOR}
            size={18}
            name='repeat'
          />
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
    borderColor: BUTTON_BORDER_COLOR,
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  off: {
    color: SECOND_COMMON_COMPONENTS_COLOR
  },
  on: {
    color: COMMON_COMPONENTS_COLOR
  }
})
