import React, { Component } from 'react';
import { SafeAreaView, Text, StatusBar, BackHandler } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import { BACKGROUND_COLOR } from '../style'
import { Item, ItemsListVertical } from '../commonComponents'


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
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: 'snippet,statistics,contentDetails',
        fields: 'nextPageToken,items(id,snippet,statistics(viewCount),contentDetails(duration))',
        chart: 'mostPopular',
        regionCode: 'VN',
        maxResults: maxResults,
        pageToken: pageToken,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      response.data.items.map(video => {
        if (video.snippet.categoryId == '10') {
          axios.get(`http://119.81.246.233:3000/load/${video.id}`).then().catch(error => console.log(error))
          const duration = moment.duration(video.contentDetails.duration)
          video.contentDetails.duration = duration.asHours() < 1 ? moment(duration._data).format("m:ss") : moment(duration._data).format("H:mm:ss")
          video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
          this.setState({ listItem: [...this.state.listItem, video] })
        }
      })
      this.setState({
        nextPageToken: response.data.nextPageToken,
        isLoading: false
      })
    })
  };
  // onHardwareBackPress(){
  //   let routeName = this.props.navigation.state.routeName
  //   switch (routeName) {
  //     case 'Home':
  //     console.log('called from home screen')

  //       this.props.navigation.goBack();
  //       return true;
  //     default:
  //       return true;
  //   }
  // }
  componentDidMount() {
    this.getVideos(30);
    // BackHandler.addEventListener('hardwareBackPress', () => {
    //   this.onHardwareBackPress()
    // });
  }
  // componentWillUnmount(){
  //   BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
  // }
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
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
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