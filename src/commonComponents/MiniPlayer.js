import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, BackHandler, TouchableOpacity, Keyboard, Dimensions, Platform } from 'react-native';
import NavigationService from '../service/NavigationService';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import TextTicker from 'react-native-text-ticker'
import {
    MINIPLAYER_BACKGROUND_COLOR, MINI_TEXT_COLOR,
    BUTTON_BORDER_COLOR, COMMON_COMPONENTS_COLOR, MINI_BUTTON_SIZE,
    TITLE_FONT_SIZE
} from '../style'
import { Icon } from 'react-native-elements'
import { MiniPlayerSlider, Spinner } from '../commonComponents'
import { PlayScreen } from '../screen/PlayScreen'
import { getTrackPlayerState, getTrackOriginID } from '../utils'



class MiniPlayer extends PlayScreen {
    _keyboardDidShow() {
        this.setState({ keyboardDidShow: true })
    }
    _keyboardDidHide() {
        this.setState({ keyboardDidShow: false })
    }
    onUpPress() {
        NavigationService.navigate('Play');
    }
    async componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this),
        );
        this.onHardwareBack = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        }
        );
        this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
            if (!this.shouldQueueEndedEventRun)
                return;
            let currentPos = await TrackPlayer.getPosition();
            let duration = await this.props.track.duration;

            //   if ( duration - currentPos > 1) {
            //     let buffered = await TrackPlayer.getBufferedPosition();
            //     currentPos = await TrackPlayer.getPosition()
            //     while (buffered < currentPos) {
            //       console.log('auto re-buffering')
            //       TrackPlayer.play();
            //       this.shouldQueueEndedEventRun = false;
            //       TrackPlayer.play();
            //       await timeout(20000);
            //       TrackPlayer.play();
            //       this.shouldQueueEndedEventRun = true;
            //       buffered = await TrackPlayer.getBufferedPosition();
            //       currentPos = await TrackPlayer.getPosition()
            //     }
            //     return;
            //   }
            if (this.props.repeatOn) {
                TrackPlayer.seekTo(0);
                this.onPressPlay()
                return;
            }
            if (this.props.autoOn) {
                this.playSuggestedNextVideo()
                return;
            }
            this.props.syncPaused(true)
        });
        this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {
            getTrackPlayerState()
            switch (playbackState.state) {
                case TrackPlayer.STATE_PLAYING:
                    this.props.syncPaused(false)
                    this.props.syncLoading(false)
                    break;
                case TrackPlayer.STATE_PAUSED:
                    if (Platform.OS === 'android') {
                        if (this.prevPlaybackState === TrackPlayer.STATE_NONE) {
                            this.onPressPlay()
                        }
                    }
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    this.props.syncPaused(true)
                    break;
                case TrackPlayer.STATE_NONE:
                    if (Platform.OS === 'android') {
                        if (this.prevPlaybackState === TrackPlayer.STATE_BUFFERING || this.prevPlaybackState === TrackPlayer.STATE_PAUSED) {
                            this.onPressPlay()
                        }
                    }
                    break;
                case TrackPlayer.STATE_STOPPED:
                    this.props.syncPaused(true)
                    break;
                default:
                    if (Platform.OS === "ios")
                        this.onPressPlay()
                    break;
            }
            this.prevPlaybackState = playbackState.state;
        })
        this.onRemotePause = TrackPlayer.addEventListener('remote-pause'), () => {
            console.log('remote pause')
        }
    }
    componentWillUnmount() {
        this.onTrackChange.remove();
        this.onQueueEnded.remove();
        this.onPlaybackStateChange.remove();
    }

    render() {
        const { textStyle, containerStyle, loadingButtonStyle, playButtonStyle, miniPlayerStyle,
            textContainerStyle
        } = styles;
        const { duration, title } = this.props.track ? this.props.track : {};
        return (
            <View>
                {!this.props.miniPlayerState || this.state.keyboardDidShow || !this.props.track.id ?
                    <View /> :
                    <View style={miniPlayerStyle}>
                        <MiniPlayerSlider
                            maximumValue={duration}
                        />
                        <View style={containerStyle} >
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
                                        bounce={false}
                                        scroll={false}
                                        repeatSpacer={100}
                                        marqueeDelay={1000}
                                    >
                                        {!title ? '' : title.toUpperCase()}
                                    </TextTicker>
                                </View>
                            </TouchableOpacity>
                            {
                                this.props.loading ?
                                    <View style={loadingButtonStyle}>
                                        <Spinner size='small' color={COMMON_COMPONENTS_COLOR} animating={this.props.loading} />
                                    </View>
                                    :
                                    <View>
                                        {!this.props.paused ?
                                            <TouchableOpacity onPress={this.onPressPause.bind(this)} >
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
                            }

                        </View>
                    </View>
                }</View>


        )
    }
}
const textWidth = Dimensions.get('window').width * 4 / 5;
const styles = {
    textStyle: {
        textAlign: 'center',
        color: MINI_TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: TITLE_FONT_SIZE
    },
    textContainerStyle: {
        flex: 1,
        width: textWidth,
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
    loadingButtonStyle: {
        height: 30,
        width: 30,
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
    tab: state.tabMeasurementReducer,
    loading: state.syncLoadingReducer,
    listItem: state.syncNextTrackListReducer,
    autoOn: state.syncAutoModeReducer,
    repeatOn: state.syncRepeatModeReducer,
});
export default connect(mapStateToProps, actions)(MiniPlayer);

