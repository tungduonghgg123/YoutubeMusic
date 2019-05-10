import React from 'react';
import { Image, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";


const YoutubeSearchItem = ({ item, onPress }) => {

    return (
        <ListItem
            containerStyle={{ alignItems: 'flex-start', backgroundColor: null, paddingTop: 2, paddingBottom: 2 }}
            leftElement={
                <View style={{}}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 160, height: 100 }}
                        source={{ uri: item.snippet.thumbnails.medium.url }}
                    />
                    <Text style={{ position: 'absolute', bottom: 7, right: 5, backgroundColor: 'black', color: 'white', opacity: 0.7, padding: 2, borderRadius: 2, overflow: 'hidden', fontSize: 12 }}>
                        {item.contentDetails.duration}
                    </Text>
                </View>
            }
            title={item.snippet.title}
            titleStyle={{ color: 'white' }}
            titleProps={{ numberOfLines: 3 }}
            subtitle={
                <View>
                    <Text numberOfLines={1} >{item.snippet.channelTitle}</Text>
                    <Text>{item.statistics.viewCount + ' views'}</Text>
                </View>
            }
            subtitleStyle={{ color: 'black', fontSize: 11 }}
            pad={10}
            onPress={onPress}
        />
    )
}

export { YoutubeSearchItem }