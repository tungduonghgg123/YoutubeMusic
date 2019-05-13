import React, { Component } from 'react';
import { ScrollView, Image, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { ListItem, SearchBar } from "react-native-elements";
import { YoutubeSearchItem, YoutubeSeachScroll } from '../commonComponents'
import axios from 'axios';
import moment from 'moment';

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
export default class SearchScreen extends Component {
  state = {
    searchInput: '',
    isLoading: false,
    nextPageToken: '',
    listItem: []
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

  onSearch(text, maxResults, pageToken) {
    if (!pageToken) {
      this.setState({ listItem: [] })
    }
    this.setState({ isLoading: true, searchInput: text })
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: "snippet",
        q: text,
        type: "video",
        maxResults: maxResults,
        pageToken: pageToken,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then((response) => {
      const videoIds = response.data.items.map(item => item.id.videoId)
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
    }).catch((error) => {
      console.log(error);
    });
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FBCD17', height: '100%' }}>
        <SearchBar
          placeholder="Search Youtube Music"
          containerStyle={{ backgroundColor: null, borderTopWidth: 0, borderBottomWidth: 0, paddingTop: 10, paddingBottom: 2 }}
          inputContainerStyle={{backgroundColor: 'white'}}
          inputStyle={{color: '#4F0645'}}
          placeholderTextColor= '#4F0645'
          round={true}
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize="none"
          showLoading={this.state.isLoading}
          value={this.state.searchInput}
          onChangeText={searchInput => this.setState({ searchInput })}
          onSubmitEditing={event => this.onSearch(event.nativeEvent.text, 7)}
        />

        <YoutubeSeachScroll
          onSearch={this.onSearch.bind(this)} 
          searchInput={this.state.searchInput}
          isLoading={this.state.isLoading}
          listItem= {this.state.listItem}
          nextPageToken={this.state.nextPageToken}
        >
          {this.state.listItem.map((item, itemKey) => {
            return (
              <YoutubeSearchItem
                item={item}
                key={itemKey}
                onPress={() => {
                  this.props.navigation.navigate('Play', { videoId: item.id })

                }}
              />
            )
          })}
        </YoutubeSeachScroll>
      </SafeAreaView >
    );
  }
}

const styles = {

}