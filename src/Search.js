import React, { Component } from 'react'
import { View, TextInput, Text, ScrollView } from 'react-native';
import axios from 'axios';
import { VideoCard } from './common'

export default class Search extends Component {
  state = {
    listItem: []
  }
  onSearch(text) {
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: "snippet",
        q: text,
        key: "AIzaSyDzP76efMfCi4BrzcEVNg2N4aBNpl_wrmE"
      }
    })
      .then((response) => {
        console.log(response)
        this.setState({
          listItem: response.data.items
        })

      })
      .catch(function (error) {
        console.log(error);
      });

  }

  render() {
    return (
      <View style={containerStyle}>
        <TextInput
          style={{ height: 40 }}
          borderBottomWidth={1}
          autoFocus={true}
          onSubmitEditing={event => this.onSearch(event.nativeEvent.text)}
          placeholder="Search Youtube Music"
        />
        <ScrollView>
          {this.state.listItem.map((item, key) => {
            card = {
              videoId: item.id.videoId,
              description: item.snippet.description,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              thumbnails: item.snippet.thumbnails.high || item.snippet.thumbnails.high.default
            }
            return (
              <VideoCard
                key={key}
                {...card}
              />
            )
          })}
        </ScrollView>
      </View>
    );
  }
}

const containerStyle = {
  paddingTop: 50
};