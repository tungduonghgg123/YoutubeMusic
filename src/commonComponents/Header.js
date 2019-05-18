import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import {HEADER_BUTTON_SIZE, COMMON_COMPONENTS_COLOR, TEXT_COLOR, HEADER_FONT_SIZE} from '../style'
const Header = ({ message, onDownPress, onQueuePress, onMessagePress }) => {
    const { textStyle, containerStyle, buttonStyle } = styles;
    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={onDownPress}>
                <Icon 
                    name='expand-more'
                    color={COMMON_COMPONENTS_COLOR}
                    size={HEADER_BUTTON_SIZE}
                />
            </TouchableOpacity>
            <Text onPress={onMessagePress} style={textStyle} >
                {message.toUpperCase()}
            </Text>
            <TouchableOpacity onPress={onQueuePress}>
            <Icon 
                    name='queue-music'
                    color={COMMON_COMPONENTS_COLOR}
                    size={HEADER_BUTTON_SIZE}
            />
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    textStyle: {
        flex: 1,
        textAlign: 'center',
        color: TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: HEADER_FONT_SIZE
    },
    containerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        marginBottom: 20
    },
    buttonStyle: {
        opacity: 0.72,
    }
}

export { Header };