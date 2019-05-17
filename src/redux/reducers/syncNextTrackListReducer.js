import { SET_NEXTTRACK_LIST, APPEND_NEXTTRACK_LIST} from '../actions/type'


const initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_NEXTTRACK_LIST:
            return state = action.payload;
        case APPEND_NEXTTRACK_LIST:
            return state = state.concat(action.payload)
        default:
            return state;
    }
}

