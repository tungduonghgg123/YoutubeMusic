import React from "react";
import { View, Text, Image } from 'react-native'

const VideoCard = (props) => {
  console.log(props)
  return (
    <View style={styles.containerStyle}>
      <Text>{props.videoId}</Text>
      <Text>{props.description}</Text>
      <Text>{props.channelTitle}</Text>
      <Text>{props.publishedAt}</Text>
      <Image
        style={{ width: props.thumbnails.width, height: props.thumbnails.height }}
        source={{ uri: props.thumbnails.url }}
      />
    </View>
  )
}

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    // borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  }
}
export { VideoCard };