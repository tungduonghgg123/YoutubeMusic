import React from 'react';
import { View, Image, ScrollView, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CardFlip from 'react-native-card-flip';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'
import NestedScrollView from 'react-native-nested-scroll-view'
const imageWidth = Dimensions.get('window').width - 48;

const AlbumArt = ({ url, description }) => {
  return (
    <View style={styles.container}>
      <CardFlip style={styles.cardContainer} ref={(card) => this.card = card}>
        <TouchableOpacity activeOpacity = {1} onPress={() => this.card.flip()}>
          <Image style={styles.image}
            source={!url ? null : { uri: url }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity activeOpacity = {1} style={styles.image} onPress={() => { this.card.flip() }}>
          <NestedScrollView>
            <Text style={{ color: TEXT_COLOR }} >{description}</Text>
          </NestedScrollView>
        </TouchableOpacity>

      </CardFlip>

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: imageWidth,
    height: imageWidth / 320 * 180,
  },
  image: {
    width: imageWidth,
    height: imageWidth / 320 * 180,
    // borderWidth: 1,
    // borderRadius: '50%',
    // borderBottomWidth: 0,
    // borderColor: BACKGROUND_COLOR
  },
});

export { AlbumArt };