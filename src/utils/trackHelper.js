const SEPERATOR = '_';
import { Alert} from 'react-native'
import axios from 'axios';
import moment from 'moment';
import TrackPlayer from 'react-native-track-player';
import { YOUTUBE_API_KEY } from '../style'
import store from '../redux/store';
import {syncLoadingNextTracks, appendNextTracks, setSuggestedNextTracks, syncTrack} from '../redux/actions'

export async function getTrackPlayerState() {
  let state = await TrackPlayer.getState()
  switch (state) {
    case TrackPlayer.STATE_PLAYING:
      console.log('playing')
      break;
    case TrackPlayer.STATE_PAUSED:
      console.log('paused')
      break;
    case TrackPlayer.STATE_BUFFERING:
      console.log('buffering')
      break;
    case TrackPlayer.STATE_NONE:
      console.log('state none')
      break;
    case TrackPlayer.STATE_STOPPED:
      console.log('state stopped')
      break;
    default:
      console.log('state not found')
      break;
  }
}

export function getTrackQueue() {
  return new Promise((resolve, reject) => {
    TrackPlayer.getQueue().then((tracks) => {
      resolve(tracks)
    }, (error) => {
      console.log(error)
    })
  })
}

/**
 * 
 * @param {videoId of track} videoId 
 * get required properties to play a track
 */
export function getTrackDetails(videoId) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: YOUTUBE_API_KEY
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
        duration: moment.duration(duration).asSeconds(),
        artwork: response.data.items[0].snippet.thumbnails.medium.url
      };
      resolve(track);
    })
      .catch(error => {
        console.log(error)
      })
  })
}

/**
 * 
 * @param {*} videoId 
 * just get informations to show up.
 */
function getVideoInfo(videoId) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: YOUTUBE_API_KEY
      }
    }).then((response) => {
      resolve(response.data.items)
    }).catch((error) => {
      console.log(error)
    })
  })
}

/**
 * get next videos related to video id. 
 */
export function getNextVideos(relatedToVideoId, maxResults, pageToken) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/search', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: 'snippet',
        maxResults: maxResults,
        type: 'video',
        relatedToVideoId: relatedToVideoId,
        pageToken: pageToken,
        key: YOUTUBE_API_KEY
      }
    }).then(response => {
      const videoIds = response.data.items.map(item => item.id.videoId)
      getVideoInfo(videoIds.join())
        .then((videos) => {
          let nextVideos = videos.map(video => {
            video.contentDetails.duration = formatDuration(video.contentDetails.duration);
            video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
            return video;
          })
          resolve({
            nextVideos,
            nextPageToken: response.data.nextPageToken
          })
        })
    }).catch((error) => {
      console.log(error)
    })
  })
};

export function getVideosHomeScreen(maxResults, regionCode, pageToken) {
  return new Promise((resolve, reject) => {
    let params = {
      part: 'snippet,statistics,contentDetails',
      fields: 'pageInfo,nextPageToken,items(id,snippet,statistics(viewCount),contentDetails(duration))',
      chart: 'mostPopular',
      maxResults: maxResults,
      pageToken: pageToken,
      key: YOUTUBE_API_KEY
    }
    if (regionCode != '') params.regionCode = regionCode
    
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: params
    }).then(response => {
      let videos = [{
        categoryId: '10',
        title: 'Trending musics',
        list: []
      }, {
        categoryId: '1',
        title: 'Trending films & animations',
        list: []
      }, {
        categoryId: '17',
        title: 'Trending sports',
        list: []
      }, {
        categoryId: '18',
        title: 'Trending short movies',
        list: []
      }, {
        categoryId: '20',
        title: 'Trending gamings',
        list: []
      }, {
        categoryId: '24',
        title: 'Trending entertainments',
        list: []
      }, {
        categoryId: '27',
        title: 'Trending educations',
        list: []
      }, {
        categoryId: '30',
        title: 'Trending movies',
        list: []
      }];

      pushVideo = (video) => {
        // axios.get(`http://119.81.246.233:3000/load/${video.id}`).then().catch(error => console.log(error))
        video.contentDetails.duration = formatDuration(video.contentDetails.duration);
        video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
        videos.find(el => el.categoryId === video.snippet.categoryId).list.push(video)
      }

      response.data.items.map(video => {
        switch (video.snippet.categoryId) {
          case '10':
          case '1':
          case '17':
          case '18':
          case '20':
          case '24':
          case '27':
          case '30':
            pushVideo(video)
            break;
        }
      })

      // remove element with empty list
      for (var i = 0; i < videos.length; i++) {
        if (videos[i].list.length == 0)
          videos.splice(i, 1);
      }
      resolve({
        videos,
        nextPageToken: response.data.nextPageToken,
        pageInfo: response.data.pageInfo
      })
    }).catch((error) => {
      console.log(error)
    })
  })
}

export function getTrackOriginID(id) {
  const indexOfSeperator = id.indexOf(SEPERATOR);
  return id.slice(indexOfSeperator + 1);
}

async function getPreviousTrack() {
  let current = await TrackPlayer.getCurrentTrack();
  let queue = await TrackPlayer.getQueue();
  let indexOfCurrent = -1;
  for (let i = 0; i < queue.length; i++) {
    let track = queue[i];
    if (track.id === current) {
      indexOfCurrent = i;
      break;
    }
  }
  switch (indexOfCurrent) {
    case -1:
      console.log('current track is not found in queue');
      return {
        eligible: false,
        id: -1,
        current
      };
    case 0:
      console.log('there is no previous track');
      return {
        eligible: false,
        id: -1,
        current
      };
    default:
      let id = queue[indexOfCurrent - 1].id;
      return {
        eligible: true,
        id,
        current
      };
  }
}

export async function getComingTrackInQueue() {
}

export async function resetSeekBar() {
  return TrackPlayer.seekTo(0);
}

function formatDuration(duration) {
  const durationObj = moment.duration(duration);
  return durationObj.asHours() < 1 ? moment(durationObj._data).format("m:ss") : moment(durationObj._data).format("H:mm:ss");
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
 async function getSuggestedNextTracks(relatedToVideoId, maxResults, pageToken) {
  store.dispatch(syncLoadingNextTracks(true))
  let {nextVideos, nextPageToken} = await getNextVideos(relatedToVideoId, maxResults, pageToken);
  store.dispatch(appendNextTracks(nextVideos, nextPageToken));
  store.dispatch(syncLoadingNextTracks(false))
}
function onPlaybackTrackChanged(id, track) {
  store.dispatch(syncTrack(track))
  store.dispatch(setSuggestedNextTracks([]))
  getSuggestedNextTracks(id, 7)
}
async function onPressBack() {
  let { eligible, id, current } = await getPreviousTrack();
  if (eligible) {
    let prevTrack = await TrackPlayer.getTrack(id);
    onPlaybackTrackChanged(getTrackOriginID(id), prevTrack)
    await TrackPlayer.skipToPrevious();
    removeTrack(current)
  } else {
    Alert.alert('Oop', 'There is no previous track!')
  }
}
function removeTrack(id){
  TrackPlayer.remove(id)
}
export {getSuggestedNextTracks, onPlaybackTrackChanged, getPreviousTrack, onPressBack}