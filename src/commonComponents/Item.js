import React from 'react';
import { Image, Text, View, Platform } from 'react-native';
import { ListItem } from "react-native-elements";
import {
    CHANNEL_TITLE_COLOR, VIEWS_COUNT_COLOR, TITLE_COLOR,
    DURATION_COLOR, DURATION_BACKGROUND_COLOR, THUMBNAIL_HEIGHT,THUMBNAIL_WIDTH
} from '../style'

const Item = ({ item, onPress }) => {
    const { durationStyle, containerStyle, channelTitleStyle, viewCountStyle } = styles;
    return (
        <ListItem
            containerStyle={containerStyle}
            leftElement={
                <View>
                    <Image
                        resizeMode='contain'
                        style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT, backgroundColor: 'black' }}
                        source={{ uri: item.snippet.thumbnails.medium.url }}
                    />
                    <Text style={durationStyle}>
                        {item.contentDetails.duration}
                    </Text>
                </View>
            }
            title={item.snippet.title}
            titleStyle={{ color: TITLE_COLOR, fontSize: 10 }}
            titleProps={{ numberOfLines: Platform.OS === 'ios'? 4:3 }}
            subtitle={
                <View>
                    <Text
                        numberOfLines={1}
                        style={channelTitleStyle}
                    >
                        {item.snippet.channelTitle}
                    </Text>
                    <Text style={viewCountStyle}>{item.statistics.viewCount + ' views'}</Text>
                </View>
            }
            subtitleStyle={{ color: 'black', fontSize: 11 }}
            pad={10}
            onPress={onPress}
        />
    )
}

export { Item }

const styles = {
    containerStyle: {
        alignItems: 'flex-start',
        backgroundColor: null,
        paddingTop: 0,
        height: THUMBNAIL_HEIGHT,
        marginBottom: 5
    },
    durationStyle: {
        position: 'absolute',
        bottom: 7,
        right: 5,
        color: DURATION_COLOR,
        backgroundColor: DURATION_BACKGROUND_COLOR,
        opacity: 0.7,
        padding: 2,
        borderRadius: 2,
        overflow: 'hidden',
        fontSize: 12,
        fontWeight: 'bold',
    },
    channelTitleStyle: {
        color: CHANNEL_TITLE_COLOR,
        fontSize: 10
    },
    viewCountStyle: {
        color: VIEWS_COUNT_COLOR,
        fontSize: 10
    }
}