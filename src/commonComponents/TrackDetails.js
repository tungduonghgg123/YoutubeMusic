import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import TextTicker from 'react-native-text-ticker'

/**
 * 
 * `issue` TextTicker doesn't work on first track
 */
const TrackDetails = ({ title, onMorePress, onAddPress, onCheckPress }) => {
    const { buttonStyle, containerStyle, textStyle, textContainerStyle } = styles;
    return (

        <View style={containerStyle}>
            <TouchableOpacity onPress={onAddPress}>
                <Image
                    source={require('../img/baseline_add_white_18dp.png')}
                    style={buttonStyle}
                />
            </TouchableOpacity>
            <View style={textContainerStyle}>
                
                <TextTicker
                    style={textStyle}
                    animationType='auto'
                    loop
                    bounce
                    repeatSpacer={100}
                    marqueeDelay={1000}
                    scroll={false}
                >
                    {title}
                    
                </TextTicker>
            </View>
            <TouchableOpacity onPress={onMorePress}>
                <Image source={require('../img/ic_more_horiz_white.png')}
                    style={buttonStyle}
                />
            </TouchableOpacity>

        </View>
    )
}
const styles = {
    buttonStyle: {
    },
    containerStyle: {
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 12,
        paddingRight: 12,
        height: 40
    },
    textStyle: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.72)',
        fontWeight: 'bold',
        fontSize: 15
    },
    textContainerStyle: {
        width: 300,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
}
export { TrackDetails };