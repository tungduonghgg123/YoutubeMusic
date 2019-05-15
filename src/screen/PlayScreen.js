import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner,
  Item, ItemsListVertical
} from '../commonComponents'
import { TextInput, Button, SafeAreaView, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";
import moment from 'moment';
import localTracks from '../storage/tracks'
import { BACKGROUND_COLOR } from '../style'
//redux
import { connect } from 'react-redux';
import * as actions from '../redux/actions'




class PlayScreen extends Component {
  constructor(props) {
    console.log('initialized')
    super(props);
    this.state = {
      autoOn: false,
      repeatOn: false,
      mode: 'youtube',
      nextPageToken: '',
      isLoading: false,
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
  onPressAuto() {
    this.setState((state) => {
      return { autoOn: !this.state.autoOn }
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
      if (track) {
        this.props.addNextTracks([])
        this.getNextVideos(data.nextTrack, 7)

        this.props.syncTrack(track)
        this.props.syncPaused(false)
      } else {
        this.props.syncPaused(true)
      }
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended event')
      if (this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      // let current = await TrackPlayer.getPosition();
      // let buffered = await TrackPlayer.getBufferedPosition();
      // if(current > buffered) {
      //   TrackPlayer.play();
      //   console.log('havent ended yet, current > buffered, need to loading ');
      //   console.log(current)
      //   console.log(buffered )
      // }
      this.props.syncPaused(true)
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {

      switch (playbackState.state) {
        case TrackPlayer.STATE_PLAYING:
          this.props.syncLoading(false);
          console.log('playing')
          // this.onPressPlay()
          break;
        case TrackPlayer.STATE_PAUSED:
          console.log('paused')
          break;
        case TrackPlayer.STATE_BUFFERING:
          console.log('buffering')

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
        case TrackPlayer.STATE_NONE:
          console.log('state none')
          break;
        case TrackPlayer.STATE_STOPPED:
          console.log('state stopped')
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
  playFromYoutube(videoId) {
    if (videoId) {
      this.memoizedLoad(videoId)
    } else {
      this.memoizedLoad(this.props.navigation.getParam('videoId'));
    }
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

  getNextVideos(relatedToVideoId, maxResults, pageToken) {
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
      const videoIds = response.data.items.map(item => item.id.videoId)
      this.getVideoDetails(videoIds.join()).then(videos => {
        videos.map(video => {
          const duration = moment.duration(video.contentDetails.duration)
          video.contentDetails.duration = duration.asHours() < 1 ? moment(duration._data).format("m:ss") : moment(duration._data).format("H:mm:ss")
          video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
          this.props.appendNextTracks( video)
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
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView stickyHeaderIndices={[0, 2]}
          onScroll={({ nativeEvent }) => {
            if (!this.state.isLoading && this.isCloseToEdge(nativeEvent) && this.props.listItem.length < 30 && this.props.listItem.length != 0) {
              this.getNextVideos(this.props.track.id, 1, this.state.nextPageToken)
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
          <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} description={this.props.track.description}/>
          <View style={{backgroundColor: BACKGROUND_COLOR}}>
            <TrackDetails
              title={!this.props.track.title ? "" : this.props.track.title}
              channelTitle={!this.props.track.artist ? "" : this.props.track.artist}

            />
            <SeekBar
              trackLength={!this.props.track.duration ? 0 : this.props.track.duration}
            />
            <PlaybackControl
              paused={this.props.paused}
              autoOn={this.state.autoOn}
              repeatOn={this.state.repeatOn}
              onPressPause={this.onPressPause.bind(this)}
              onPressPlay={this.onPressPlay.bind(this)}
              onPressRepeat={this.onPressRepeat.bind(this)}
              onPressAuto={this.onPressAuto.bind(this)}
              forwardDisabled={false}
              backwardDisabled={false}
              autoDisabled={false}
              onForward={this.onPressForward.bind(this)}
              onBack={this.onPressBack.bind(this)}
            />
          </View>
          {this.props.loading ?
            <Spinner /> : <View style={{ flex: 1 }} />
          }
          <Button 
            title='get current position' 
            onPress={async () => { 
                let position = await TrackPlayer.getPosition() 
                let bufferedPosition = await TrackPlayer.getBufferedPosition() 
                console.log(bufferedPosition) 
                console.log(position) }} />
           <Button title='stop' onPress={() => { TrackPlayer.stop() }} />
          <ItemsListVertical isLoading={this.state.isLoading}>
            {this.props.listItem.map((item, itemKey) => {
              return (
                <Item
                  item={item}
                  key={itemKey}
                  onPress={() => {
                    this.playFromYoutube(item.id)
                    this.props.addNextTracks([])
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
  loading: state.syncLoadingReducer,
  listItem: state.syncNextTrackListReducer
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