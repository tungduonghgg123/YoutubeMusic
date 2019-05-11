import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'

const AlbumArt = ({ onPress, url, path }) => {
  const { container, image } = styles;
  let source = !url ? null : {uri: url}
 
  return (
    <View style={container} >
        <Image style={image}
          source={source}
          resizeMode={'contain'}
        />
    </View>
  )
}

const { width, height } = Dimensions.get('window');
const paddingLeft = 24;
const paddingRight = 24;
const imageWidth = width - paddingLeft - paddingRight;

const styles = {
  container: {
    paddingLeft: paddingLeft,
    paddingRight: paddingRight,
  },
  image: {
    width: imageWidth,
    height: imageWidth / 320 * 180,
    borderWidth: 1,
    borderRadius: 15,
    borderBottomWidth: 0,
  },
};
export { AlbumArt };