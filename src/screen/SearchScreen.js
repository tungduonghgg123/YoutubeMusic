import React, { Component } from 'react';
import { View } from 'react-native';
import { SearchBar } from "react-native-elements";
import { Item, ItemsListVertical } from '../commonComponents'
import axios from 'axios';
import moment from 'moment';
import { BACKGROUND_COLOR, TEXT_COLOR, YOUTUBE_API_KEY } from '../style'
import { connect } from 'react-redux';
import * as actions from '../redux/actions'

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

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      isLoading: false,
      nextPageToken: '',
      listItem: [],
      showSearchBar: true
    };
  }
  // componentDidMount(){
  //   this.onSearch('lac quan',7)
  // }
  getVideoDetails(videoId) {
    return axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: YOUTUBE_API_KEY
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
    axios.get('https://content.googleapis.com/youtube/v3/search', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: "snippet",
        q: text,
        type: "video",
        maxResults: maxResults,
        pageToken: pageToken,
        key: YOUTUBE_API_KEY
      }
    }).then((response) => {
      const videoIds = response.data.items.map(item => item.id.videoId)
      this.getVideoDetails(videoIds.join()).then(videos => {
        videos.map(video => {
          // axios.get(`http://119.81.246.233:3000/load/${video.id}`).then().catch(error => console.log(error.message))
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
        {this.state.showSearchBar ?
          <SearchBar
            placeholder="Search Youtube Music"
            containerStyle={{ backgroundColor: null, borderTopWidth: 0, borderBottomWidth: 0, paddingTop: 10, paddingBottom: 2 }}
            inputContainerStyle={{ backgroundColor: 'white' }}
            inputStyle={{ color: TEXT_COLOR }}
            placeholderTextColor={TEXT_COLOR}
            round={true}
            // autoFocus={true}
            autoCorrect={false}
            autoCapitalize="none"
            showLoading={this.state.isLoading}
            value={this.state.searchInput}
            onChangeText={searchInput => this.setState({ searchInput })}
            onSubmitEditing={event => this.onSearch(event.nativeEvent.text, 7)}
          /> : <View />}

        <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.listItem.length < 50 && this.state.listItem.length != 0)
              this.onSearch(this.state.searchInput, 5, this.state.nextPageToken)
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
      </View>
    );
  }
}

export default connect(null, actions)(SearchScreen)