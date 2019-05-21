import {SYNCTRACKID} from '../actions/type'

export default function (state = '', action) {
    switch (action.type) {
        case SYNCTRACKID:
            return state = action.payload;
        default:
            return state;
    }
}