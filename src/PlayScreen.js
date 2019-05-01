import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text, View } from 'react-native';
import axios from 'axios';
import { tsParameterProperty } from '@babel/types';

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
    url: "https://youtubemusicbackend.herokuapp.com/play/6KJrNWC0tfw", // Load media from heroku
    // url: require('../WhoAreYou.mp3'),
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
  async componentDidUpdate(prevProps) {
    let videoId = this.props.navigation.getParam('videoId');
    if (prevProps.navigation.getParam('videoId') === videoId) {
      return;
    }
    TrackPlayer.pause();
    this.load(videoId);
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
      let track = await TrackPlayer.getTrack(data.nextTrack);
      this.setState({track});
      let duration = await TrackPlayer.getDuration();
      this.setState({ duration: Math.round(duration) })
  });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended')
      TrackPlayer.stop()
      this.setState({ paused: true });

  });

    let videoId = this.props.navigation.getParam('videoId');
    if (!videoId)
      return;
    this.load(videoId);
    // this.addAndPlay(HARDCODEtracks);

  }
  async load(videoId) {
    this.setState({ isLoading: true })
    let track = await this.initializeTrack(videoId)
    this.addAndPlay(track)
  }
  async getTheTrackQueue() {
    let tracks = await TrackPlayer.getQueue();
    console.log(tracks)
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
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}
          onForward={() => { TrackPlayer.skipToNext().then((result) => console.log('skip success')) }}
          onBack={() => { TrackPlayer.skipToPrevious().then((result) => console.log('skip success')) }}
        />
        {this.state.isLoading ?
          <Spinner /> : <View />
        }
      </SafeAreaView>
    );
  }
}