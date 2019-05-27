import { Dimensions } from 'react-native'
function calFontSize(standardSize) {
    const standardDiagonalLength = 734.3;
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const diagonalLength = Math.sqrt(width * width + height * height);
    return diagonalLength * standardSize / standardDiagonalLength;
}

const BACKGROUND_COLOR = '#FBCD17'
const MINIPLAYER_BACKGROUND_COLOR = BACKGROUND_COLOR
const TEXT_COLOR = '#7D6B7D'
export const DISABLED_OPACITY = 0.5;

/**
 * `../commonComponents/Item.js` styles
 */
const CHANNEL_TITLE_COLOR = 'white'
const VIEWS_COUNT_COLOR = 'white'
const TITLE_COLOR = TEXT_COLOR
export const ITEM_CONTAINER_COLOR = '#C0C480'
export const CHANNEL_TITLE_FONT_SIZE = calFontSize(10)
export const VIEWS_COUNT_COLOR_FONT_SIZE = calFontSize(10)
export const TITLE_FONT_SIZE = calFontSize(10)
/**
 * `common Components` styles
 */

const COMMON_COMPONENTS_COLOR = '#FF665A'
export const SECOND_COMMON_COMPONENTS_COLOR = 'white'
const THUMP_COLOR = COMMON_COMPONENTS_COLOR
/**
 * `../commonComponents/MiniPlayer.js` style
 */

const BUTTON_BORDER_COLOR = COMMON_COMPONENTS_COLOR
const MINI_BUTTON_SIZE = 24
const MINI_TEXT_COLOR = TEXT_COLOR
/**
 * `../commonComponents/Header.js`
 */
const HEADER_BUTTON_SIZE = 24
export const HEADER_FONT_SIZE = calFontSize(12)
/**
 * `../commonComponents/TrackDetails.js`
 */
export const TRACKDETAILS_FONT_SIZE = calFontSize(12)
export const TEXT_WIDTH = Dimensions.get('window').width*4/5;

/**
 * `../commonComponents/PlaybackControl.js`
 */
const PLAY_BUTTON_SIZE = 48;
/**
 * `../commonComponents/SeekBar.js`
 */
const MIN_TRACK_TINT_COLOR = COMMON_COMPONENTS_COLOR
const MAX_TRACK_TINT_COLOR = 'white'

/**
 * `../commonComponents/Item.js`
 */
const DURATION_COLOR = 'white'
const DURATION_BACKGROUND_COLOR = 'black'
export const THUMBNAIL_WIDTH = 160;
export const THUMBNAIL_HEIGHT = 90;
const LIVE_COLOR = 'red'
const LIVE_BACKGROUND_COLOR = 'black'

/**
 * `../screen/Main.js`
 */
const INDICATOR_COLOR = COMMON_COMPONENTS_COLOR

export {
    MINI_TEXT_COLOR,
    BACKGROUND_COLOR,
    MINIPLAYER_BACKGROUND_COLOR,
    TEXT_COLOR,
    CHANNEL_TITLE_COLOR,
    INDICATOR_COLOR,
    DURATION_BACKGROUND_COLOR,
    DURATION_COLOR,
    LIVE_BACKGROUND_COLOR,
    LIVE_COLOR,
    MAX_TRACK_TINT_COLOR,
    MIN_TRACK_TINT_COLOR,
    HEADER_BUTTON_SIZE,
    COMMON_COMPONENTS_COLOR,
    THUMP_COLOR,
    BUTTON_BORDER_COLOR,
    MINI_BUTTON_SIZE,
    VIEWS_COUNT_COLOR,
    TITLE_COLOR,
    PLAY_BUTTON_SIZE

}