import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";
import moment from 'moment';
import localTracks from './storage/tracks'
//redux
import { connect } from 'react-redux';
import * as actions from './actions'
import { Item, ItemsListVertical } from './common'

class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuffleOn: false,
      repeatOn: false,
      mode: 'youtube',
      nextPageToken: '',
      isLoading: false,
      listItem: []
    };
    this.props.miniPlayerOff();
  }
  onPressPause() {
    TrackPlayer.pause();
    this.props.syncPaused(true)
  }
  onPressPlay() {
    TrackPlayer.play();
    this.props.syncPaused(false)
  }
  onPressRepeat() {
    this.setState((state) => {
      return { repeatOn: !this.state.repeatOn }
    })
  }
  async onPressBack() {
    await TrackPlayer.skipToPrevious();
  }
  async onPressForward() {
    await TrackPlayer.skipToNext();
  }
  async getTheTrackQueue() {
    let tracks = await TrackPlayer.getQueue();
    console.log(tracks)
    TrackPlayer.getState().then((result) => console.log(result))

  }
  memoizedLoad = memoize(async (videoId) => {
    if (!videoId)
      return;
    /**
     * pause Track Player before loading and playing new Track.
     *  */
    this.onPressPause()
    this.props.syncLoading(true)
    let track = await this.initializeTrack(videoId)
    this.addAndPlay(track)
  })
  async addAndPlay(track) {
    await TrackPlayer.add(track)
    /**
     * skip to this `track` by using `track id`
     */
    await TrackPlayer.skip(track.id)
    this.onPressPlay();
  }
  initializeTrack(videoId) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      let duration = response.data.items[0].contentDetails.duration;
      const track = {
        id: videoId,
        url: `http://119.81.246.233:3000/play/${videoId}`, // Load media from server
        title: response.data.items[0].snippet.title,
        artist: response.data.items[0].snippet.channelTitle,
        description: response.data.items[0].snippet.description,
        date: response.data.items[0].snippet.publishedAt,
        thumbnail: {
          url: response.data.items[0].snippet.thumbnails.medium.url
        },
        duration: moment.duration(duration).asSeconds()
      };
      this.props.syncTrack(track)
      return track;
    })
      .catch(error => console.log(error))
  }




  async componentDidMount() {
    this.getVideos(this.props.navigation.getParam('videoId'), 7);
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      if (data.nextTrack === 'helperTrack') {
        console.log('helper track ON')
        return;
      }
      console.log('---------------------')
      // console.log('track changed')
      this.getTheTrackQueue()
      let track = await TrackPlayer.getTrack(data.nextTrack);
      /**
       * sync track to redux store:
       */
      this.props.syncTrack(track)
      this.props.syncPaused(false)
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended')
      if (this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      this.props.syncPaused(true)
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {

      console.log(JSON.stringify(playbackState));
      switch (playbackState.state) {
        case 'playing':
          // this.setState({isLoading: false})
          this.props.syncLoading(false)
          break;
        case 'loading':

          // if(this.prevPlaybackState === 'playing'){
          //   let helperTrack = {
          //     id: 'helperTrack', 
          //     url: 'somellink',
          //     title: 'helper Title', 
          //     artist: 'tung duong',
          //   }
          //   await TrackPlayer.add(helperTrack)
          //   await TrackPlayer.skip(helperTrack.id);
          //   await TrackPlayer.skipToPrevious();
          //   await TrackPlayer.remove(helperTrack.id)
          // }

          break;
        default:
          break;

      }
      this.prevPlaybackState = playbackState.state;
    })
    this.onRemotePause = TrackPlayer.addEventListener('remote-pause'), () => {
      console.log('remote pause')
    }
    this.playFromYoutube()

  }
  async componentDidUpdate() {
    this.playFromYoutube()
  }
  playFromYoutube() {
    this.memoizedLoad(this.props.navigation.getParam('videoId'));
  }
  /**
   * not working at the moment.
   */
  playFromLocal() {
    TrackPlayer.add(localTracks).then(() => {
      console.log('track added');
      this.onPressPlay()
    })

  }
  componentWillUnmount() {
    // Removes the event handler
    /**
     * `weird`: this will be invoked when transition.
     */

    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onPlaybackStateChange.remove();

  }
  isCloseToEdge({ layoutMeasurement, contentOffset, contentSize }) {
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

  getVideos(relatedToVideoId, maxResults, pageToken) {
    this.setState({ isLoading: true })
    axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: maxResults,
        type: 'video',
        relatedToVideoId: relatedToVideoId,
        pageToken: pageToken,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
        <ScrollView stickyHeaderIndices={[0, 2]}
          onScroll={({ nativeEvent }) => {
            if (!this.state.isLoading && this.isCloseToEdge(nativeEvent) && this.state.listItem.length < 30 && this.state.listItem.length != 0) {
              this.getVideos(this.props.navigation.getParam('videoId'), 1, this.state.nextPageToken)
            }
          }}
          scrollEventThrottle={5000}
        >
          <Header
            message="playing from Youtube"
            onQueuePress={this.getTheTrackQueue.bind(this)}
            onDownPress={() => {
              this.props.navigation.goBack();
              this.props.miniPlayerOn();
            }}
          />
          <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} />
          <View>
            <TrackDetails
              title={!this.props.track.title ? "" : this.props.track.title}
            />
            <SeekBar
              trackLength={!this.props.track.duration ? 0 : this.props.track.duration}
            />
            <PlaybackControl
              paused={this.props.paused}
              shuffleOn={this.state.shuffleOn}
              repeatOn={this.state.repeatOn}
              onPressPause={this.onPressPause.bind(this)}
              onPressPlay={this.onPressPlay.bind(this)}
              onPressRepeat={this.onPressRepeat.bind(this)}
              forwardDisabled={false}
              backwardDisabled={false}
              shuffleDisabled={true}
              onForward={this.onPressForward.bind(this)}
              onBack={this.onPressBack.bind(this)}
            />
          </View>
          {this.props.loading ?
            <Spinner /> : <View style={{ flex: 1 }} />
          }
          <ItemsListVertical isLoading={this.state.isLoading}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  paused: state.syncPausedReducer,
  track: state.syncTrackReducer,
  loading: state.syncLoadingReducer
});

export default connect(mapStateToProps, actions)(PlayScreen)

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