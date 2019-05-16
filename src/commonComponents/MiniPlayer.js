import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, SafeAreaView, Image, TouchableOpacity, Keyboard } from 'react-native';
import Slider from 'react-native-slider';
import NavigationService from '../service/NavigationService';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import TextTicker from 'react-native-text-ticker'
import {
    MINIPLAYER_BACKGROUND_COLOR, THUMP_COLOR, MINI_TEXT_COLOR,
    BUTTON_BORDER_COLOR, COMMON_COMPONENTS_COLOR, MINI_BUTTON_SIZE,
    MIN_TRACK_TINT_COLOR, MAX_TRACK_TINT_COLOR
} from '../style'
import { Icon } from 'react-native-elements'




class MiniPlayer extends TrackPlayer.ProgressComponent {
    
    _keyboardDidShow() {
        this.setState({ keyboardDidShow: true })
    }
    _keyboardDidHide() {
        this.setState({ keyboardDidShow: false })
    }
    onUpPress() {
        NavigationService.navigate('Play');
    }
    onPressPause() {
        this.props.syncPaused(true)
        TrackPlayer.pause();
    }
    onPressPlay() {
        this.props.syncPaused(false)
        TrackPlayer.play();
    }
    // componentDidMount() {
    //     this.keyboardDidShowListener = Keyboard.addListener(
    //         'keyboardDidShow',
    //         this._keyboardDidShow.bind(this),
    //     );
    //     this.keyboardDidHideListener = Keyboard.addListener(
    //         'keyboardDidHide',
    //         this._keyboardDidHide.bind(this),
    //     );
    //     this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {

    //         console.log('---------------------')
    //         // console.log('track changed')
    //         let track = await TrackPlayer.getTrack(data.nextTrack);
    //         /**
    //          * sync track to redux store:
    //          */
    //         if (track) {
    //             this.props.syncTrack(track)
    //             this.props.syncPaused(false)
    //         } else {
    //             this.props.syncPaused(true)
    //         }
    //     });
    // }
    componentDidMount(){
        super.componentDidMount()
    }

    render() {
        const { textStyle, containerStyle, upButtonStyle, playButtonStyle, miniPlayerStyle,
            textContainerStyle
        } = styles;

        const { duration, title } = this.props.track ? this.props.track : {};

        return (

            <View>
                {!this.props.miniPlayerState || this.state.keyboardDidShow ?
                    <View /> :
                    <View style={miniPlayerStyle}>
                        <Slider
                            disabled={true}
                            maximumValue={duration ? duration : 0}
                            onSlidingComplete={async value => { await TrackPlayer.seekTo(value) }}
                            value={this.state.position}
                            style={styles.slider}
                            minimumTrackTintColor={MIN_TRACK_TINT_COLOR}
                            maximumTrackTintColor={MAX_TRACK_TINT_COLOR}
                            thumbStyle={styles.thumb}
                            trackStyle={styles.track}
                        />
                        <View style={containerStyle}>
                            <TouchableOpacity onPress={this.onUpPress.bind(this)}>
                                <Icon
                                    name='expand-less'
                                    size={MINI_BUTTON_SIZE}
                                    color={COMMON_COMPONENTS_COLOR}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.onUpPress.bind(this)}>
                                <View style={textContainerStyle}>
                                    <TextTicker
                                        style={textStyle}
                                        animationType='auto'
                                        loop
                                        bounce
                                        scroll={false}
                                        repeatSpacer={100}
                                        marqueeDelay={1000}
                                    >
                                        {!title ? '' : title.toUpperCase()}
                                    </TextTicker>
                                </View>
                            </TouchableOpacity>

                            {!this.props.paused ?
                                <TouchableOpacity onPress={this.onPressPause.bind(this)}>
                                    <View style={playButtonStyle}>
                                        <Icon
                                            name='pause'
                                            size={MINI_BUTTON_SIZE}
                                            color={COMMON_COMPONENTS_COLOR}
                                        />
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={this.onPressPlay.bind(this)}>
                                    <View style={playButtonStyle}>
                                        <Icon
                                            name='play-arrow'
                                            size={MINI_BUTTON_SIZE}
                                            color={COMMON_COMPONENTS_COLOR}
                                        />
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }</View>


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
    textStyle: {
        textAlign: 'center',
        color: MINI_TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: 10,
    },
    textContainerStyle: {
        flex: 1,
        width: 300,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingTop: 5,
        paddingBottom: 5
    },
    upButtonStyle: {

    },
    playButtonStyle: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: BUTTON_BORDER_COLOR,
        borderRadius: 36 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniPlayerStyle: {
        backgroundColor: MINIPLAYER_BACKGROUND_COLOR,
        width: '100%',
        position: "absolute",
        bottom: 0,
    }
}
const mapStateToProps = state => ({
    miniPlayerState: state.miniPlayerReducer,
    track: state.syncTrackReducer,
    paused: state.syncPausedReducer,
    tab: state.tabMeasurementReducer

});
export default connect(mapStateToProps, actions)(MiniPlayer);

