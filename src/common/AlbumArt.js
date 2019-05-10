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

const styles = {
  container: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  image: {
    width: 320,
    height: 180,
    borderWidth: 1,
    borderRadius: 15,
    borderBottomWidth: 0,
  },
};
export { AlbumArt };