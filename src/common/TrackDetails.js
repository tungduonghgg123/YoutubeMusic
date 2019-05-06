import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import TextTicker from 'react-native-text-ticker'

const TrackDetails = ({ title, onMorePress, onAddPress, onCheckPress }) => {
    const { buttonStyle, containerStyle, textStyle } = styles;
    return (
        <View style={containerStyle}>
            <TouchableOpacity onPress={onAddPress}>
                <Image
                    source={require('../img/baseline_add_white_18dp.png')}
                    style={buttonStyle}
                />
            </TouchableOpacity>
            <View style={textStyle}>
                <Text style={textStyle}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onMorePress}>
                <Image source={require('../img/ic_more_horiz_white.png')}
                    style={buttonStyle}
                />
            </TouchableOpacity>

        </View>
    )
}
function changeAddButton(params) {

}
const styles = {
    buttonStyle: {
        opacity: 0.72,
    },
    containerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 12,
        paddingRight: 12,
    },
    textStyle: {
        flex: 1,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.72)',
        fontWeight: 'bold',
        fontSize: 15
    },
}
export { TrackDetails };