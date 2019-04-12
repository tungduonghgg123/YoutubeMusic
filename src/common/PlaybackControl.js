import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const PlaybackControl = ({onShufflePress}) => {
    const { containerStyle } = styles;
    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={onShufflePress}>
                <Image source={require('../img/ic_shuffle_white.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../img/ic_skip_previous_white_36pt.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../img/ic_play_arrow_white_48pt.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../img/ic_skip_next_white_36pt.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../img/ic_repeat_white.png')}/>
            </TouchableOpacity>
            
        </View>
    )
}
const styles = {
    containerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}
export { PlaybackControl};