import React, { Component } from 'react';
import { SafeAreaView, Text, StatusBar, View } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import { BACKGROUND_COLOR } from '../style'
import { Item, ItemsListVertical } from '../commonComponents'
import {getVideosHomeScreen} from '../utils'

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
  getVideos(maxResults, pageToken){
    this.setState({ isLoading: true })
    getVideosHomeScreen(maxResults, pageToken).then((result) => {
      const {videos,nextPageToken } = result;
      this.setState({ listItem: this.state.listItem.concat(videos) })
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

  onScroll = (event) => {
    // var currentOffset = event.nativeEvent.contentOffset.y;
    // var direction = currentOffset > this.offset ? 'down' : 'up';
    // console.log('current: ', currentOffset);
    // console.log('previou: ', this.offset) 
    // this.offset = currentOffset;

    // console.log(direction);
    // console.log('-------------')
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
        <StatusBar backgroundColor={BACKGROUND_COLOR} barStyle="light-content" />
        <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.listItem.length < 50 && this.state.listItem.length != 0)
              this.getVideos(25, this.state.nextPageToken)
          }}
          onScroll={this.onScroll.bind(this)}
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
        </ItemsListVertical>
      </View>
    );
  }
}
export default connect(null, actions)(HomeScreen)