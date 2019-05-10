import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Slider from 'react-native-slider';

class MiniPlayer extends TrackPlayer.ProgressComponent {
    render() {
        const { textStyle, containerStyle, buttonStyle, playButton, onMessagePress } = styles;
        const { paused, onUpPress, onPressPause, onPressPlay, message, trackLength } = this.props;
        return (
            <View style={{
                backgroundColor: 'pink',
            }}>

                <Slider
                    disabled={true}
                    maximumValue={trackLength}
                    onSlidingComplete={async value => {
                        await TrackPlayer.seekTo(value)
                    }}
                    value={this.state.position}
                    style={styles.slider}
                    minimumTrackTintColor='#fff'
                    maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
                    thumbStyle={styles.thumb}
                    trackStyle={styles.track}
                />

                <View style={containerStyle}>
                    <TouchableOpacity onPress={onUpPress}>
                        <Image style={buttonStyle}
                            source={require('../img/ic_keyboard_arrow_up_white.png')} />
                    </TouchableOpacity>
                    <Text onPress={onMessagePress} style={textStyle} >
                        {message.toUpperCase()}
                    </Text>
                    {!paused ?
                        <TouchableOpacity onPress={onPressPause}>
                            <View style={playButton}>
                                <Image source={require('../img/ic_pause_white_24pt.png')} />
                            </View>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={onPressPlay}>
                            <View style={playButton}>
                                <Image source={require('../img/ic_play_arrow_white_24pt.png')} />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}
const styles = {
    slider: {
        height: 1
    },
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 5,
        height: 5,
        backgroundColor: 'white',
    },
    textStyle: {
        flex: 1,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.72)',
        fontWeight: 'bold',
        fontSize: 10,
    },
    containerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5
    },
    buttonStyle: {
        opacity: 0.72,
    },
    playButton: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 36 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
}
export { MiniPlayer };