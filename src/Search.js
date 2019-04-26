import React, { Component } from 'react'
import { View, ScrollView, Image } from 'react-native';
import { ListItem, SearchBar } from "react-native-elements"
import axios from 'axios';

export default class Search extends Component {
  state = {
    search: '',
    isLoading: false,
    nextPageToken: '',
    listItem: []
  };

  onSearch(text, pageToken) {
    this.setState({ isLoading: true, search: text })
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: "snippet",
        q: text,
        type: "video",
        maxResults: 10,
        safeSearch: "strict",
        pageToken: pageToken,
        key: "AIzaSyBeIS0TakspKCNGxdxWj1eeczRDTT17mNo"
        // key: "AIzaSyDzP76efMfCi4BrzcEVNg2N4aBNpl_wrmE"
        // key: "AIzaSyAj-0GyBrQ39mh57ho6WYMPVhWlL8rY0tg"
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        listItem: [...this.state.listItem, ...response.data.items],
        nextPageToken: response.data.nextPageToken,
        isLoading: false
      })
      console.log(this.state.listItem.length)
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
      <View style={{ height: '100%' }}>
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
          onSubmitEditing={event => this.onSearch(event.nativeEvent.text)}
        />

        <ScrollView
          style={{ paddingTop: 7 }}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent) && this.state.listItem.length < 50) {
              this.onSearch(this.state.search, this.state.nextPageToken)
            }
          }}
          scrollEventThrottle={5000}
        >
          {this.state.listItem.map((item, key) => {
            return (
              <ListItem
                key={key}
                containerStyle={{ alignItems: 'flex-start', backgroundColor: null, paddingTop: 7, paddingBottom: 7 }}
                leftElement={
                  <Image
                    style={{ width: item.snippet.thumbnails.medium.width / 2, height: item.snippet.thumbnails.medium.height / 2 }}
                    source={{ uri: item.snippet.thumbnails.medium.url }}
                  />
                }
                title={item.snippet.title}
                titleStyle={{ color: 'white' }}
                titleProps={{ numberOfLines: 3 }}
                subtitleStyle={{ color: 'black', fontSize: 12 }}
                subtitle={item.snippet.channelTitle}
                subtitleProps={{ numberOfLines: 2 }}
                pad={10}
              />
            )
          })}
        </ScrollView>
      </View >
    );
  }
}