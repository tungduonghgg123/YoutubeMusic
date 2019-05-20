import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { View, BackHandler, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
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
import { MiniPlayerSlider } from '../commonComponents'
import { PlayScreen } from '../screen/PlayScreen'



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
    playFromYoutube() {}
    componentDidMount() {
        super.componentDidMount()
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
    }
    render() {
        const { textStyle, containerStyle, upButtonStyle, playButtonStyle, miniPlayerStyle,
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
                                        scroll={false}
                                        repeatSpacer={100}
                                        marqueeDelay={1000}
                                    >
                                        {!title ? '' : title.toUpperCase()}
                                    </TextTicker>
                                </View>
                            </TouchableOpacity>

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
    listItem: state.syncNextTrackListReducer

});
export default connect(mapStateToProps, actions)(MiniPlayer);

