import React, { Component } from 'react';
import { ScrollView, Image, SafeAreaView, Text, View, ActivityIndicator, Button } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from './actions'
import { Item, ItemsListVertical } from './common'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPageToken: '',
      isLoading: false,
      listItem: []
    };
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  getVideoDetails(videoId) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: process.env.YOUTUBE_API_KEY
      }
    }).then((response) => {
      return response.data.items
    }).catch((error) => {
      console.log(error);
    });
  }

  getVideos(maxResults, pageToken) {
    this.setState({ isLoading: true })
    axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: maxResults,
        pageToken: pageToken,
        regionCode: 'VN',
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      const videoIds = response.data.items.map(item => item.id)
      this.getVideoDetails(videoIds.join()).then(videos => {
        videos.map(video => {
          const duration = moment.duration(video.contentDetails.duration)
          video.contentDetails.duration = duration.asHours() < 1 ? moment(duration._data).format("m:ss") : moment(duration._data).format("H:mm:ss")
          video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
          this.setState({ listItem: [...this.state.listItem, video] })
        })
      })
      this.setState({
        nextPageToken: response.data.nextPageToken,
        isLoading: false
      })
    })
  };

  componentDidMount() {
    this.getVideos(7);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray', height: '100%' }}>
        <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Home</Text>
        <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.listItem.length < 50 && this.state.listItem.length != 0)
              this.getVideos(5, this.state.nextPageToken)
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
        </ItemsListVertical>
      </SafeAreaView >
    );
  }
}

function numberFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" }
  ];
  for (var i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export default connect(null, actions)(HomeScreen)