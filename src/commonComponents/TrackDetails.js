import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import TextTicker from 'react-native-text-ticker'
import { TEXT_COLOR, COMMON_COMPONENTS_COLOR } from '../style'
import { Icon} from 'react-native-elements'

/**
 * 
 * `issue` TextTicker doesn't work on first track
 */
const TrackDetails = ({ channelTitle, title, onMorePress, onAddPress, downloadDisabled, addToAlbumDisabled }) => {
    const { buttonStyle, containerStyle, textStyle,
        titleContainerStyle, channelTitleContainerStyle } = styles;
    return (
        <View>
            <View style={containerStyle}>
                <TouchableOpacity onPress={onAddPress} disabled={addToAlbumDisabled}>
                    <Icon 
                        iconStyle={!addToAlbumDisabled ? [] : styles.off}
                        name='add'
                        color= {COMMON_COMPONENTS_COLOR}
                        size={18}
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
                <TouchableOpacity onPress={onMorePress} disabled={downloadDisabled}>
                <Icon 
                        iconStyle={!downloadDisabled ? [] : styles.off}
                        name='arrow-downward'
                        color= {COMMON_COMPONENTS_COLOR}
                        size={18}
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
    },
    off: {
        opacity: 0.30,
      }
}
export { TrackDetails };