import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import { HEADER_BUTTON_SIZE, COMMON_COMPONENTS_COLOR, TEXT_COLOR, HEADER_FONT_SIZE } from '../style'
const QueueHeader = ({ message, onBackPress, onMessagePress }) => {
    const { textStyle, containerStyle, buttonStyle } = styles;
    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={onBackPress} style={buttonStyle} >
                <Icon
                    name='arrow-back'
                    color={COMMON_COMPONENTS_COLOR}
                    size={HEADER_BUTTON_SIZE}
                />
            </TouchableOpacity>
            <Text onPress={onMessagePress} style={textStyle} >
                {message.toUpperCase()}
            </Text>
        </View>
    );
};

const styles = {
    textStyle: {
        textAlign: 'center',
        color: TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: HEADER_FONT_SIZE,
    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonStyle: {
        position: 'absolute',
        left: 10,
        
    }
}

export { QueueHeader };