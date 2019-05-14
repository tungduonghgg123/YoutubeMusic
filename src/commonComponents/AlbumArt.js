import React from 'react';
import { View, Image, ScrollView, Dimensions, Text } from 'react-native'
import FlipCard from 'react-native-flip-card'
import { BACKGROUND_COLOR } from '../style'

const AlbumArt = ({ url, description }) => {
  const { container, image } = styles;
  let source = !url ? null : { uri: url }

  return (
    <FlipCard flipHorizontal={true} flipVertical={false}>
      <View style={container} >
        <Image style={image}
          source={source}
          resizeMode={'contain'}
        />
      </View>
      <View style={container} >
        <View style={image} >
          <Text>{description}</Text>
        </View>
      </View>
    </FlipCard>
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
    borderColor: BACKGROUND_COLOR
  },
};
export { AlbumArt };