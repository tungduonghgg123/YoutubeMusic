/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, Text, TouchableOpacity, Image} from 'react-native';

const Header = ({ message, onDownPress, onQueuePress, onMessagePress }) => {
    const { textStyle, containerStyle, buttonStyle } = styles;
    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={onDownPress}>
                <Image style={buttonStyle}
                    source={require('../img/ic_keyboard_arrow_down_white.png')} />
            </TouchableOpacity>
            <Text onPress={onMessagePress} style={textStyle} >
                {message.toUpperCase()}
            </Text>
            <TouchableOpacity onPress={onDownPress}>
                <Image style={buttonStyle}
                    source={require('../img/ic_queue_music_white.png')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    textStyle: {
        flex: 1,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.72)',
        fontWeight: 'bold',
        fontSize: 10,
    },
    containerStyle: {
        height: 72,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 12,
        paddingRight: 12,
    },
    buttonStyle: {
        opacity: 0.72,

    }
}
export { Header };
