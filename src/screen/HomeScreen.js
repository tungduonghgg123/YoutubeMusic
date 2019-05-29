import React, { Component } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import { ItemsListVertical, ItemsListHorizontal, SquareItem, Card, CardSection } from '../commonComponents'
import { getVideosHomeScreen } from '../utils'
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPageToken: '',
      isLoading: false,
      countResults: 0,
      totalResults: 0,
      listItem: []
    };
    this.offset = 0;
  }

  getVideos(maxResults, pageToken) {
    this.setState({ isLoading: true })
    getVideosHomeScreen(maxResults, pageToken).then((result) => {
      let newListItem = this.state.listItem
      result.videos.map(element => {
        let index = this.state.listItem.findIndex(el => el.categoryId === element.categoryId)
        if (index == -1) {
          newListItem = newListItem.concat(element)
        } else {
          newListItem[index].list = newListItem[index].list.concat(element.list)
        }
      })
      this.setState({
        listItem: newListItem,
        nextPageToken: result.nextPageToken,
        isLoading: false,
        countResults: this.state.countResults + maxResults,
        totalResults: result.pageInfo.totalResults
      })
    }).catch((error) => {
      console.log(error)
    });
  }

  componentDidMount() {
    this.getVideos(50);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
        <StatusBar backgroundColor={BACKGROUND_COLOR} barStyle="light-content" />
        <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.countResults < this.state.totalResults && this.state.listItem.length != 0)
              this.getVideos(50, this.state.nextPageToken)
          }}
        >
          {this.state.listItem.map((element, elementKey) => {
            if (element.list && element.list.length > 0)
              return (
                <Card key={elementKey}>
                  <CardSection>
                    <Text style={styles.cardTitleStyle}>{element.title}</Text>
                  </CardSection>
                  <ItemsListHorizontal
                    isLoading={this.state.isLoading}
                    onCloseToEdge={() => {
                      if (!this.state.isLoading && this.state.countResults < this.state.totalResults && this.state.listItem.length != 0)
                        this.getVideos(50, this.state.nextPageToken)
                    }}
                  >
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
        </ItemsListVertical>
      </View >
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