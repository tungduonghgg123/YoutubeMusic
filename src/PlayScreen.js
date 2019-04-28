import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text } from 'react-native';

export default class PlayScreen extends Component {
  state = {
    videoId: this.props.navigation.state.params.videoId,
    paused: true,
    duration: 0,
    isLoading: true
  }

  onPressPause() {
    this.setState({ paused: true });
    TrackPlayer.pause();
  }

  onPressPlay() {
    this.setState({ paused: false })
    TrackPlayer.play();
  }
  
  componentDidMount() {
    var track = {
      id: 'unique track id', // Must be a string, required
      url: `https://youtubemusicbackend.herokuapp.com/play/${this.props.navigation.getParam('videoId')}`, // Load media from heroku
      // url: require('../WhoAreYou.mp3'),
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      // artwork: require('../ava1.jpg'), // Load artwork from the app bundle
    };

    console.log(track)

    this.onPressPlay();
    TrackPlayer.setupPlayer().then(async (result) => {
      TrackPlayer.add(track).then(async () => {
        this.setState({isLoading: false})
        let duration = await TrackPlayer.getDuration();
        this.setState({ duration: Math.round(duration) })
      });
    });
  }

  componentWillReceiveProps() {
    // this.setState({videoId: this.props.navigation.state.params.videoId})
    var track = {
      id: 'unique track id', // Must be a string, required
      url: `https://youtubemusicbackend.herokuapp.com/play/${this.props.navigation.getParam('videoId')}`, // Load media from heroku
      // url: require('../WhoAreYou.mp3'),
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      // artwork: require('../ava1.jpg'), // Load artwork from the app bundle
    };

    console.log(track)

    this.onPressPlay();
    TrackPlayer.setupPlayer().then(async (result) => {
      TrackPlayer.add(track).then(async () => {
        this.setState({isLoading: false})
        let duration = await TrackPlayer.getDuration();
        this.setState({ duration: Math.round(duration) })
      });
    });
  }

  render() {
    console.log(this.props.navigation.state.params.videoId)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
        <Header
          message="playing from Youtube"
        />
        <AlbumArt />
        <TrackDetails
          title='Sunflower'
        />
        <SeekBar
          trackLength={this.state.duration}
        />
        <PlaybackControl
          paused={this.state.paused}
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}
        />
        {this.state.isLoading?
          <Spinner/> :
          <Text>
            loading done
          </Text>
        }
      </SafeAreaView>
    );
  }
}