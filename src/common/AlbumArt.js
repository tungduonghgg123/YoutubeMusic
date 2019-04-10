import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'

const AlbumArt = ({onPress, url, path }) => {
    const {container, image} = styles;
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={container}>
                <Image style= {image}source = {require('../img/Spiderman.jpg')} />
            </TouchableOpacity>
        </View>
    )
}
const { width, height } = Dimensions.get('window');
const imageSize = width - 48;

const styles = {
  container: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  image: {
    width: imageSize,
    height: imageSize,
  },
};
export { AlbumArt };