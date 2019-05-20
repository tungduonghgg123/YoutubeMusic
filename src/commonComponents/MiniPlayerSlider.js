import React from 'react';
import TrackPlayer from 'react-native-track-player';
import Slider from 'react-native-slider';
import {
    THUMP_COLOR, MIN_TRACK_TINT_COLOR, MAX_TRACK_TINT_COLOR,
} from '../style'

export  class MiniPlayerSlider extends TrackPlayer.ProgressComponent {
    render() {
        return (
            <Slider
                disabled={true}
                maximumValue={this.props.maximumValue ? this.props.maximumValue : 0}
                onSlidingComplete={async value => { await TrackPlayer.seekTo(value) }}
                value={this.state.position}
                style={styles.slider}
                minimumTrackTintColor={MIN_TRACK_TINT_COLOR}
                maximumTrackTintColor={MAX_TRACK_TINT_COLOR}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
            />
        )
    }
}

const styles = {
    /**
     * `slider`: is a container holds `track` (progress bar).
     */
    slider: {
        height: 1,
    },
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 1,
        height: 1,
        backgroundColor: THUMP_COLOR
    },
}