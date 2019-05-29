import React, { Component } from 'react';
import { StatusBar, View, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import { Item, ItemsListVertical, ItemsListHorizontal, SquareItem, Card, CardSection } from '../commonComponents'
import { getVideosHomeScreen } from '../utils'
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPageToken: '',
      isLoading: false,
      listItem: []
    };
    this.offset = 0;
  }

  getVideos(maxResults, pageToken) {
    this.setState({ isLoading: true })
    getVideosHomeScreen(maxResults, pageToken).then((result) => {
      const { videos, nextPageToken } = result;
      this.setState({
        listItem: videos
      })
      this.setState({
        nextPageToken: nextPageToken,
        isLoading: false
      })
    }).catch((error) => {
      console.log(error)
    });
  }

  componentDidMount() {
    this.getVideos(30);
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
        <StatusBar backgroundColor={BACKGROUND_COLOR} barStyle="light-content" />
        {this.state.listItem.map((element, elementKey) => {
          if (element.list && element.list.length > 0)
            return (
              <Card key={elementKey}>
                <CardSection>
                  <Text style={styles.cardTitleStyle}>{element.title}</Text>
                </CardSection>
                <ItemsListHorizontal>
                  {element.list.map((item, itemKey) => {
                    return (
                      <SquareItem
                        item={item}
                        key={itemKey}
                        style={{ marginBottom: 5 }}
                        onPress={() => {
                          this.props.navigation.navigate('Play', { videoId: item.id })
                        }}
                      />
                    )
                  })}
                </ItemsListHorizontal>
              </Card>
            )
        })}
        {/* <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.listItem.length < 50 && this.state.listItem.length != 0)
              this.getVideos(25, this.state.nextPageToken)
          }}
        >
          {this.state.listItem.map((item, itemKey) => {
            return (
              <Item
                item={item}
                key={itemKey}
                onPress={() => {
                  this.props.navigation.navigate('Play', { videoId: item.id })
                }}
              />
            )
          })}
        </ItemsListVertical> */}
      </ScrollView >
    );
  }
}
export default connect(null, actions)(HomeScreen)

const styles = StyleSheet.create({
  cardTitleStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: TEXT_COLOR,
    backgroundColor: BACKGROUND_COLOR
  }
})