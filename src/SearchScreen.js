import React, { Component } from 'react';
import { ScrollView, Image, SafeAreaView, Text, View } from 'react-native';
import { ListItem, SearchBar } from "react-native-elements";
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
    search: '',
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
      return response.data.items[0]
    }).catch((error) => {
      console.log(error);
    });
  }

  onSearch(text, maxResults, pageToken) {
    if (!pageToken) {
      this.setState({ listItem: [] })
    }
    this.setState({ isLoading: true, search: text })
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
      response.data.items.map(async item => {
        const video = await this.getVideoDetails(item.id.videoId);
        const duration = moment(moment.duration(video.contentDetails.duration)._data)
        video.contentDetails.duration = duration.isBefore(1, 'h') ? duration.format("m:ss") : duration.format("H:mm:ss")
        video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
        this.setState({ listItem: [...this.state.listItem, video] })
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray', height: '100%' }}>
        <SearchBar
          placeholder="Search Youtube Music"
          containerStyle={{ backgroundColor: null, borderTopWidth: 0, borderBottomWidth: 0, paddingTop: 0, paddingBottom: 2 }}
          round={true}
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize="none"
          showLoading={this.state.isLoading}
          value={this.state.searchInput}
          onChangeText={searchInput => this.setState({ searchInput })}
          onSubmitEditing={event => this.onSearch(event.nativeEvent.text, 7)}
        />

        <ScrollView
          style={{ paddingTop: 7 }}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent) && this.state.listItem.length < 50 && this.state.listItem.length != 0) {
              this.onSearch(this.state.search, 5, this.state.nextPageToken)
            }
          }}
          scrollEventThrottle={5000}
        >
          {this.state.listItem.map((item, key) => {
            console.log(item)
            return (
              <ListItem
                key={key}
                containerStyle={{ alignItems: 'flex-start', backgroundColor: null, paddingTop: 7, paddingBottom: 7 }}
                leftElement={
                  <View style={{}}>
                    <Image
                      style={{ width: item.snippet.thumbnails.medium.width / 2, height: item.snippet.thumbnails.medium.height / 2 }}
                      source={{ uri: item.snippet.thumbnails.medium.url }}
                    />
                    <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'black', color: 'white', opacity: 0.7, padding: 2, borderRadius: 2, overflow: 'hidden', fontSize: 12 }}>
                      {item.contentDetails.duration}
                    </Text>
                  </View>
                }
                title={item.snippet.title}
                titleStyle={{ color: 'white' }}
                titleProps={{ numberOfLines: 3 }}
                subtitle={
                  <View>
                    <Text>{item.snippet.channelTitle}</Text>
                    <Text>{item.statistics.viewCount + ' views'}</Text>
                  </View>
                }
                subtitleStyle={{ color: 'black', fontSize: 11 }}
                subtitleProps={{ numberOfLines: 2 }}
                pad={10}
                onPress={() => this.props.navigation.navigate('Play', { videoId: item.id })}
              />
            )
          })}
        </ScrollView>
      </SafeAreaView >
    );
  }
}