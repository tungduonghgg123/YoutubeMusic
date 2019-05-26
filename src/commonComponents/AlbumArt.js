import React, {Component} from 'react';
import { View, Image, ScrollView, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CardFlip from 'react-native-card-flip';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'
import NestedScrollView from 'react-native-nested-scroll-view'
const imageWidth = Dimensions.get('window').width - 48;

class AlbumArt extends Component{
  constructor(props){
    super(props);
    this.state = {shouldSetStaticHeight:false};
  }
  render(){
    const { url, description } = this.props;
    return (
      <View style={styles.container}>
        <CardFlip style={styles.cardContainer} ref={(card) => this.card = card}>
          <TouchableOpacity activeOpacity={1}
            onPress={() => this.card.flip()}
          >
            <Image style={styles.image}
              source={!url ? null : { uri: url }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
  
          <NestedScrollView>
            <Text
            activeOpacity={1}
              style={[{ color: TEXT_COLOR }, this.state.shouldSetStaticHeight ? styles.image : []]}
              onPress={() => { this.card.flip() }}
              // onLayout={({ nativeEvent }) => {
              //   console.log(nativeEvent)
              //   if(nativeEvent.layout.height < styles.image.height) {
              //     this.setState({shouldSetStaticHeight: true});
              //   }
              // }}
            >
              {description}
            </Text>
          </NestedScrollView>
        </CardFlip>
    
      </View>
    )
  }
}

function changeTextHeight() {

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