import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import TextTicker from 'react-native-text-ticker'
import { TEXT_COLOR } from '../style'
/**
 * 
 * `issue` TextTicker doesn't work on first track
 */
const TrackDetails = ({ channelTitle, title, onMorePress, onAddPress, onCheckPress }) => {
    const { buttonStyle, containerStyle, textStyle,
        titleContainerStyle, channelTitleContainerStyle } = styles;
    return (
        <View>
            <View style={containerStyle}>
                <TouchableOpacity onPress={onAddPress}>
                    <Image
                        source={require('../img/baseline_add_white_18dp.png')}
                        style={buttonStyle}
                    />
                </TouchableOpacity>
                <View style={titleContainerStyle}>

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
            <View style={channelTitleContainerStyle}>
                <Text style={{ color: TEXT_COLOR }}>
                    {channelTitle}
                </Text>
            </View>
        </View>
    )
}
const styles = {
    buttonStyle: {
    },
    containerStyle: {
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
        color: TEXT_COLOR,
        fontWeight: 'bold',
        fontSize: 15
    },
    titleContainerStyle: {
        width: 300,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    channelTitleContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    }
}
export { TrackDetails };