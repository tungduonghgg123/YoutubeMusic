import React, { Component } from 'react';
import { ScrollView, Image, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { ListItem } from "react-native-elements";
import axios from 'axios';

export default class HomeScreen extends Component {
  state = {
    nextPageToken: '',
    isLoading: false,
    listItem: []
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  onGetVideos(maxResults, pageToken) {
    this.setState({isLoading: true})
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
      console.log(response)
      this.setState({
        listItem: [...this.state.listItem, ...response.data.items],
        nextPageToken: response.data.nextPageToken,
        isLoading: false
      })
    })
  };

  componentDidMount() {
    this.onGetVideos(7);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray', height: '100%' }}>
        <Text style={{ margin: 5, fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Home</Text>
        <ScrollView
          style={{ paddingTop: 7 }}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent) && !this.state.isLoading && this.state.listItem.length < 50 && this.state.listItem.length != 0) {
              this.onGetVideos(5, this.state.nextPageToken)
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
                    {/* <Text style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'black', color: 'white', opacity: 0.7, padding: 2, borderRadius: 2, overflow: 'hidden', fontSize: 12 }}>
                      {item.contentDetails.duration}
                    </Text> */}
                  </View>
                }
                title={item.snippet.title}
                titleStyle={{ color: 'white' }}
                titleProps={{ numberOfLines: 3 }}
                // subtitle={
                //   <View>
                //     <Text numberOfLines={1} >{item.snippet.channelTitle}</Text>
                //     <Text>{item.statistics.viewCount + ' views'}</Text>
                //   </View>
                // }
                subtitleStyle={{ color: 'black', fontSize: 11 }}
                pad={10}
                onPress={() => this.props.navigation.navigate('Play', { videoId: item.id })}
              />
            )
          })}
          <ActivityIndicator size='large' animating={this.state.isLoading} />
        </ScrollView>
      </SafeAreaView >
    );
  }
}