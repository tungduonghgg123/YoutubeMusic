import React from 'react';
import { Image, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import {
    CHANNEL_TITLE_COLOR, VIEWS_COUNT_COLOR, TITLE_COLOR,
    DURATION_COLOR, DURATION_BACKGROUND_COLOR,
    LIVE_COLOR, LIVE_BACKGROUND_COLOR,
} from '../style'

const Item = ({ item, onPress }) => {
    const { durationStyle, liveStyle, containerStyle, channelTitleStyle, viewCountStyle } = styles;
    return (
        <ListItem
            containerStyle={containerStyle}
            leftElement={
                <View>
                    <Image
                        resizeMode='contain'
                        style={{ width: 160, height: 100 }}
                        source={{ uri: item.snippet.thumbnails.medium.url }}
                    />
                    {item.snippet.liveBroadcastContent == 'none' ?
                        <Text style={durationStyle}>
                            {item.contentDetails.duration}
                        </Text>
                        :
                        <Text style={liveStyle}>
                            {item.snippet.liveBroadcastContent}
                        </Text>
                    }
                </View>
            }
            title={item.snippet.title}
            titleStyle={{ color: TITLE_COLOR }}
            titleProps={{ numberOfLines: 3 }}
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
        // marginBottom: 10,
        padding: 0,
        paddingLeft: 24,
        paddingRight: 24,
        // borderWidth: 1,
        // // borderBottomWidth: 1,
        // borderColor: ITEM_CONTAINER_COLOR
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
    liveStyle: {
        position: 'absolute',
        bottom: 7,
        right: 5,
        color: LIVE_COLOR,
        backgroundColor: LIVE_BACKGROUND_COLOR,
        opacity: 0.7,
        padding: 2,
        borderRadius: 2,
        overflow: 'hidden',
        fontSize: 12,
        fontWeight: 'bold',
    },
    channelTitleStyle: {
        color: CHANNEL_TITLE_COLOR
    },
    viewCountStyle: {
        color: VIEWS_COUNT_COLOR
    }
}