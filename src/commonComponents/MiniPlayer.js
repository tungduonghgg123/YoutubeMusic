import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, SafeAreaView, Image, TouchableOpacity, Keyboard } from 'react-native';
import Slider from 'react-native-slider';
import NavigationService from '../service/NavigationService';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import TextTicker from 'react-native-text-ticker'
import { MINIPLAYER_BACKGROUND_COLOR} from '../style'




class MiniPlayer extends TrackPlayer.ProgressComponent {
    constructor(props){
        super(props);
        this.state = {
            keyboardDidShow: false
        }
    }
    _keyboardDidShow(){
        this.setState({keyboardDidShow: true})
    }
    _keyboardDidHide(){
        this.setState({keyboardDidShow: false})
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
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this),
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this),
          );
          this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      
            console.log('---------------------')
            // console.log('track changed')
            let track = await TrackPlayer.getTrack(data.nextTrack);
            /**
             * sync track to redux store:
             */
            if (track) {
              this.props.syncTrack(track)
              this.props.syncPaused(false)
            } else {
              this.props.syncPaused(true)
            }
          });
    }
    render() {
        const { textStyle, containerStyle, upButtonStyle, playButtonStyle, miniPlayerStyle,
            textContainerStyle
        } = styles;
        
        const { duration, title } = this.props.track? this.props.track: {} ;
        
        return (
            <View>
                {!this.props.miniPlayerState || this.state.keyboardDidShow ?
                    <View /> :
                    <View style={miniPlayerStyle}>
                        <Slider
                            disabled={true}
                            maximumValue={duration? duration:0}
                            onSlidingComplete={async value => { await TrackPlayer.seekTo(value) }}
                            value={this.state.position}
                            style={styles.slider}
                            minimumTrackTintColor='#fff'
                            maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
                            thumbStyle={styles.thumb}
                            trackStyle={styles.track}
                        />
                        <View style={containerStyle}>
                            <TouchableOpacity onPress={this.onUpPress.bind(this)}>
                                <Image style={upButtonStyle}
                                    source={require('../img/ic_keyboard_arrow_up_white.png')} />
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
                                        <Image source={require('../img/ic_pause_white_24pt.png')} />
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={this.onPressPlay.bind(this)}>
                                    <View style={playButtonStyle}>
                                        <Image source={require('../img/ic_play_arrow_white_24pt.png')} />
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
    slider: {
        height: 1
    },
    track: {
        height: 1,
        borderRadius: 1,
    },
    thumb: {
        width: 1,
        height: 1,
        backgroundColor: 'white',
    },
    textStyle: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.72)',
        fontWeight: 'bold',
        fontSize: 10,
    },
    textContainerStyle: {
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
        // paddingLeft: 12,
        // paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5
    },
    upButtonStyle: {

    },
    playButtonStyle: {
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: 'white',
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
