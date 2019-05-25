import React from 'react';
import { ImageBackground, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  CHANNEL_TITLE_COLOR, VIEWS_COUNT_COLOR, TITLE_COLOR,
  DURATION_COLOR, DURATION_BACKGROUND_COLOR,
  LIVE_COLOR, LIVE_BACKGROUND_COLOR, CHANNEL_TITLE_FONT_SIZE, VIEWS_COUNT_COLOR_FONT_SIZE, TITLE_FONT_SIZE
} from '../style'

const SquareItem = ({ item, style, onPress }) => {
  return (
    <TouchableOpacity style={[style, styles.containerStyle]} onPress={onPress}>
      <ImageBackground
        resizeMode='contain'
        style={{ width: 160, height: 100 }}
        source={{ uri: item.snippet.thumbnails.medium.url }}
      >

        {item.snippet.liveBroadcastContent == 'none' ?
          <Text style={styles.durationStyle}>
            {item.contentDetails.duration}
          </Text>
          :
          <Text style={styles.liveStyle}>
            {item.snippet.liveBroadcastContent}
          </Text>
        }
      </ImageBackground>
      <Text style={{ color: TITLE_COLOR, width: 160, fontSize: TITLE_FONT_SIZE}} numberOfLines={3}>{item.snippet.title}</Text>
      <View style={{ color: 'black', fontSize: 11 }}>
        <Text numberOfLines={1} style={styles.channelTitleStyle}>{item.snippet.channelTitle}</Text>
        <Text style={styles.viewCountStyle}>{item.statistics.viewCount + ' views'}</Text>
      </View>
    </TouchableOpacity>
  )
}

export { SquareItem }

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'flex-start',
    backgroundColor: null,
    // marginBottom: 10,
    padding: 0,
    paddingLeft: 24,
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
    color: CHANNEL_TITLE_COLOR,
    fontSize: CHANNEL_TITLE_FONT_SIZE

  },
  viewCountStyle: {
    color: VIEWS_COUNT_COLOR,
    fontSize: VIEWS_COUNT_COLOR_FONT_SIZE

  }
})