import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text, View } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";

let HARDCODEtracks = [
  {
    id: "4ZbQffYdhj0", // Must be a string, required
    url: "https://youtubemusicbackend.herokuapp.com/play/4ZbQffYdhj0", // Load media from heroku
    // url: require('../WhoAreYou.mp3'),
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
  },
  {
    id: '6KJrNWC0tfw', // Must be a string, required
    // url: "https://youtubemusicbackend.herokuapp.com/play/6KJrNWC0tfw", // Load media from heroku
    url: require('../WhoAreYou.mp3'),
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
  },
]
export default class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: null,
      paused: true,
      duration: 0,
      isLoading: false,
      shuffleOn: false,
      repeatOn: true
    };
  }
  onPressPause() {
    this.setState({ paused: true });
    TrackPlayer.pause();
  }
  onPressPlay() {
    this.setState({ paused: false })
    TrackPlayer.play();
  }
  onPressRepeat() {
    this.setState((state) => {
      return {repeatOn: !this.state.repeatOn}
    })
    
  }
  async onPressBack() {
    await TrackPlayer.skipToPrevious();
  }
  async onPressForward() {
    await TrackPlayer.skipToNext();
  }
  initializeTrack(videoId) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      const track = {
        id: videoId,
        url: `https://youtubemusicbackend.herokuapp.com/play/${videoId}`, // Load media from heroku
        title: response.data.items[0].snippet.title,
        artist: response.data.items[0].snippet.channelTitle,
        description: response.data.items[0].snippet.description,
        date: response.data.items[0].snippet.publishedAt,
        thumbnail: {
          url: response.data.items[0].snippet.thumbnails.medium.url
        }
      };
      return track;
    })
      .catch(error => console.log(error))
  }
  async addAndPlay(track) {
    TrackPlayer.add(track).then(async () => {
      /**
       * PURPOSE: wait until track player have finished loading
       */
      TrackPlayer.getState().then(() => this.setState({ isLoading: false }))  
      
    });
    TrackPlayer.skip(track.id).then(() => console.log('skip to track id successfully'))
    this.onPressPlay();
  }
  memoizedLoad = memoize(async (videoId) => {
    if(!videoId)
      return;
    TrackPlayer.pause();
    this.setState({ isLoading: true })
    let track = await this.initializeTrack(videoId)
    this.addAndPlay(track)
  })
  
  async getTheTrackQueue() {
    let tracks = await TrackPlayer.getQueue();
    console.log(tracks)
    TrackPlayer.getState().then((result) => console.log(result))
  }
  async componentDidUpdate() {
    this.memoizedLoad(this.props.navigation.getParam('videoId'));
  }
  componentWillUnmount() {
    // Removes the event handler
    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onRemotePause.remove();
    this.onRemotePlay.remove();
}
  async componentDidMount() {
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      console.log('track was changed!')
      // if(this.state.repeatOn) {
      //   await TrackPlayer.skip(this.state.track.id);
      // }
      let track = await TrackPlayer.getTrack(data.nextTrack);
      this.setState({track});
      let duration = await TrackPlayer.getDuration();
      this.setState({ duration: Math.floor(duration) })
      console.log(duration)
      this.setState({ paused: false });
  });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended')
      if(this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      this.setState({ paused: true });
  });
    this.memoizedLoad(this.props.navigation.getParam('videoId'));
  }
  
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
        <Header
          message="playing from Youtube"
          onQueuePress={this.getTheTrackQueue.bind(this)}
        />
        <AlbumArt url={!this.state.track ? "" : this.state.track.thumbnail.url} />
        <TrackDetails
          title={!this.state.track ? "" : this.state.track.title.slice(0, 30)}
        />
        <SeekBar
          trackLength={this.state.duration}
        />
        <PlaybackControl
          paused={this.state.paused}
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
        {this.state.isLoading ?
          <Spinner /> : <View />
        }

      </SafeAreaView>
    );
  }
}